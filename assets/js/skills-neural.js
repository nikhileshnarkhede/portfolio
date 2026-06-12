/* ============================================================
   skills-neural.js — "Living neural network" layer for the
   Technical Skills graph. Rides on top of skills-graph.js
   without modifying it:

   • ENTRY FORWARD PASS — when the section scrolls into view the
     root node fires and pulses travel outward along every
     root→category edge (staggered), like a forward pass.
   • HOVER ACTIVATION — hovering a category sends a pulse from
     the root to it; the node flashes when the signal arrives.
   • CLICK CASCADE — expanding a category propagates activation
     down its child edges; skills flash in sequence as signals
     arrive, like neurons firing.
   • IDLE DRIFT — every ~1.5–3s a stray pulse wanders a random
     visible edge so the network always feels alive.
   • The root node breathes gently.

   Pulses sample their edge's LIVE x1/y1/x2/y2 each frame, so
   they stay glued to edges even mid-layout-transition. The layer
   re-attaches automatically when skills-graph.js rebuilds on
   resize (MutationObserver). Desktop D3 graph only; runs only
   while the section is on screen and the tab is visible.
   Honors prefers-reduced-motion.
   ============================================================ */
(function () {
    'use strict';

    var container = document.getElementById('skills-graph');
    if (!container) return;
    var section = container.closest('section') || container;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var NS = 'http://www.w3.org/2000/svg';
    var inView = false;
    var pageVisible = !document.hidden;
    var engine = null;
    var lastEntryPass = 0;

    /* ------------------------------------------------------- */
    function createEngine(svg) {
        var linksG = svg.querySelector('g.sk-links');
        var nodesG = svg.querySelector('g.sk-nodes');
        if (!linksG || !nodesG) return null;   // mobile fallback graph — skip

        var mainLayer = linksG.parentNode;
        var pulseLayer = document.createElementNS(NS, 'g');
        pulseLayer.setAttribute('class', 'sk-pulses');
        mainLayer.insertBefore(pulseLayer, nodesG);   // under the node boxes

        var lines = Array.prototype.slice.call(linksG.querySelectorAll('line'));
        var nodeById = {};
        Array.prototype.forEach.call(nodesG.children, function (g) {
            var d = g.__data__;
            if (d && d.id) nodeById[d.id] = g;
        });

        var pulses = [];
        var raf = null;
        var idleTimer = null;
        var alive = true;
        var lastHoverId = null;
        var lastHoverAt = 0;

        function idOf(v) { return (v && typeof v === 'object') ? v.id : v; }

        function spawn(line, opts) {
            opts = opts || {};
            var dot = document.createElementNS(NS, 'circle');
            dot.setAttribute('class', 'sk-pulse');
            dot.setAttribute('r', opts.r || 2.6);
            dot.setAttribute('opacity', 0);
            pulseLayer.appendChild(dot);
            pulses.push({
                line: line,
                el: dot,
                t0: performance.now() + (opts.delay || 0),
                dur: opts.dur || 820,
                target: idOf((line.__data__ || {}).target)
            });
            if (!raf) raf = requestAnimationFrame(frame);
        }

        function easeInOut(t) {
            return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        }

        function frame(now) {
            raf = null;
            var any = false;
            for (var i = pulses.length - 1; i >= 0; i--) {
                var p = pulses[i];
                var t = (now - p.t0) / p.dur;
                if (t < 0) { any = true; continue; }
                if (t >= 1) {
                    flash(p.target);
                    p.el.remove();
                    pulses.splice(i, 1);
                    continue;
                }
                var e = easeInOut(t);
                // live edge coordinates — tracks mid-transition layouts
                var x1 = +p.line.getAttribute('x1'), y1 = +p.line.getAttribute('y1');
                var x2 = +p.line.getAttribute('x2'), y2 = +p.line.getAttribute('y2');
                p.el.setAttribute('cx', x1 + (x2 - x1) * e);
                p.el.setAttribute('cy', y1 + (y2 - y1) * e);
                p.el.setAttribute('opacity',
                    t < 0.12 ? (t / 0.12) : (t > 0.85 ? (1 - t) / 0.15 : 1));
                any = true;
            }
            if (any) raf = requestAnimationFrame(frame);
        }

        function flash(targetId) {
            var g = targetId && nodeById[targetId];
            if (!g) return;
            g.classList.add('sk-firing');
            setTimeout(function () { g.classList.remove('sk-firing'); }, 460);
        }

        function rootLines() {
            return lines.filter(function (l) {
                return (l.__data__ || {}).kind === 'root';
            });
        }

        function activeChildLines() {
            return lines.filter(function (l) {
                var ld = l.__data__ || {};
                return ld.kind === 'child' &&
                    parseFloat(l.getAttribute('stroke-opacity') || 0) >= 0.5;
            });
        }

        function activeRootLine() {
            // styleLinks() paints the root→active edge in the accent color
            return lines.find(function (l) {
                var ld = l.__data__ || {};
                return ld.kind === 'root' &&
                    (l.getAttribute('stroke') || '').toLowerCase() === '#0071e3';
            });
        }

        function entryPass() {
            var root = nodeById['skills-root'];
            if (root) {
                root.classList.add('sk-firing');
                setTimeout(function () { root.classList.remove('sk-firing'); }, 650);
            }
            rootLines().forEach(function (l, i) {
                spawn(l, { delay: 140 + i * 70, dur: 760 });
            });
        }

        function idle() {
            if (!alive) return;
            var delay = 1500 + Math.random() * 1500;

            if (inView && pageVisible) {
                var kids = activeChildLines();

                if (kids.length) {
                    // SUBGRAPH OPEN — livelier: signals stream through the
                    // expanded layer, occasionally re-fed from the root
                    if (pulses.length < 10) {
                        var n = Math.random() < 0.35 ? 2 : 1;
                        for (var i = 0; i < n; i++) {
                            spawn(kids[Math.floor(Math.random() * kids.length)],
                                { dur: 780, r: 2.2, delay: i * 150 });
                        }
                        if (Math.random() < 0.25) {
                            var feed = activeRootLine();
                            if (feed) spawn(feed, { dur: 520, r: 2.4 });
                        }
                    }
                    delay = 600 + Math.random() * 650;
                } else if (pulses.length < 6) {
                    // collapsed — occasional stray pulse on the ring
                    var cands = rootLines();
                    if (cands.length) {
                        spawn(cands[Math.floor(Math.random() * cands.length)],
                            { dur: 950, r: 2.2 });
                    }
                }
            }

            idleTimer = setTimeout(idle, delay);
        }
        idle();

        // hover → root fires a signal at that category
        function onOver(e) {
            var g = e.target.closest ? e.target.closest('.sk-nodes > g') : null;
            if (!g) return;
            var d = g.__data__;
            if (!d || d.type !== 'category') return;
            var now = performance.now();
            if (d.id === lastHoverId && now - lastHoverAt < 900) return;
            lastHoverId = d.id;
            lastHoverAt = now;
            var l = lines.find(function (L) {
                var ld = L.__data__ || {};
                return ld.kind === 'root' && idOf(ld.target) === d.id;
            });
            if (l) spawn(l, { dur: 480 });
        }

        // click (expand) → activation cascades down the child edges
        function onClick(e) {
            var g = e.target.closest ? e.target.closest('.sk-nodes > g') : null;
            if (!g) return;
            var d = g.__data__;
            if (!d || d.type !== 'category') return;
            setTimeout(function () {
                var kids = lines.filter(function (L) {
                    var ld = L.__data__ || {};
                    return ld.parentId === d.id &&
                        parseFloat(L.getAttribute('stroke-opacity') || 0) >= 0.5;
                });
                kids.slice(0, 12).forEach(function (L, i) {
                    spawn(L, { delay: i * 55, dur: 560, r: 2.3 });
                });
            }, 430);   // after the D3 layout transition settles
        }

        svg.addEventListener('mouseover', onOver);
        svg.addEventListener('click', onClick);

        // root breathes
        if (nodeById['skills-root']) nodeById['skills-root'].classList.add('sk-breathe');

        return {
            svg: svg,
            entryPass: entryPass,
            destroy: function () {
                alive = false;
                clearTimeout(idleTimer);
                if (raf) cancelAnimationFrame(raf);
                pulses.forEach(function (p) { p.el.remove(); });
                pulses = [];
                pulseLayer.remove();
                svg.removeEventListener('mouseover', onOver);
                svg.removeEventListener('click', onClick);
            }
        };
    }

    /* ---- attach / re-attach (graph rebuilds on resize) ---- */
    function tryAttach() {
        var svg = container.querySelector('svg');
        if (!svg) return;
        if (engine && engine.svg === svg) return;
        if (engine) engine.destroy();
        engine = createEngine(svg);
        if (engine && inView) {
            lastEntryPass = performance.now();
            engine.entryPass();
        }
    }

    new MutationObserver(tryAttach).observe(container, { childList: true });
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryAttach);
    } else {
        tryAttach();
    }

    /* ---- forward pass each time the section comes on screen ---- */
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
            inView = entries[0].isIntersecting;
            if (inView && engine && performance.now() - lastEntryPass > 5000) {
                lastEntryPass = performance.now();
                engine.entryPass();
            }
        }, { threshold: 0.25 }).observe(section);
    } else {
        inView = true;
    }

    document.addEventListener('visibilitychange', function () {
        pageVisible = !document.hidden;
    });
})();
