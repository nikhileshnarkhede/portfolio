/* ============================================================
   pubs-fx.js — Publications figures, full play on arrival
   Each publication card carries its own miniature figure that
   plays start-to-finish whenever the card enters the viewport
   (from either scroll direction) and restarts on every entry.

   Paper 1 (.pub-figure--bars): grouped R² bars grow up; the DNN
     bars (blue) overtake the SR bars (grey).
   Paper 2 (scatter): axes draft in → points populate → fit draws
     → R² rolls to 0.99.

   CSS holds each figure's FINAL state, so reduced-motion / no-GSAP
   visitors see the completed figures.
   ============================================================ */
(function () {
    'use strict';

    var items = document.querySelectorAll('.publication-item');
    if (!items.length) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
    if (reduceMotion || !hasGSAP) return;   // CSS final state remains

    gsap.registerPlugin(ScrollTrigger);

    items.forEach(function (item) {
        var bars = item.querySelectorAll('.pub-bar');
        if (bars.length) {
            buildBarChart(item, bars);
        } else {
            buildScatter(item);
        }
    });

    /* ---- Paper 1: grouped R² bar chart ---- */
    function buildBarChart(item, bars) {
        // bars grow upward: y must move up as height grows, so animate
        // both height and y from the (baseline, 0) start to (top, h).
        var BASE = 168;   // svg baseline y (matches markup)

        var tl = gsap.timeline({
            paused: true,
            scrollTrigger: {
                trigger: item,
                start: 'top 82%',
                end: 'bottom 18%',
                toggleActions: 'restart none restart none'
            }
        });

        bars.forEach(function (bar, i) {
            var h = parseFloat(bar.getAttribute('data-h')) || 0;
            // SR bars first (even index), DNN bars a beat later (odd) so
            // the blue "overtake" reads as a second wave
            var at = (i % 2 === 0) ? (i * 0.045) : (i * 0.045 + 0.12);
            tl.fromTo(bar,
                { attr: { height: 0, y: BASE } },
                {
                    attr: { height: h, y: BASE - h },
                    duration: 0.7,
                    ease: 'power3.out'
                }, at);
        });
    }

    /* ---- Paper 2: scatter + fit + R² counter ---- */
    function buildScatter(item) {
        var axisY = item.querySelector('.pub-axis-y');
        var axisX = item.querySelector('.pub-axis-x');
        var points = item.querySelectorAll('.pub-pt');
        var fit = item.querySelector('.pub-fit');
        var r2 = item.querySelector('.pub-r2');
        if (!axisY || !axisX || !fit) return;

        var r2state = { v: 0 };
        if (r2) r2.textContent = '0.00';

        var tl = gsap.timeline({
            paused: true,
            scrollTrigger: {
                trigger: item,
                start: 'top 82%',
                end: 'bottom 18%',
                toggleActions: 'restart none restart none'
            }
        });

        tl
            .fromTo(axisY,
                { scaleY: 0, svgOrigin: '28 146' },
                { scaleY: 1, duration: 0.5, ease: 'power2.out' }, 0)
            .fromTo(axisX,
                { scaleX: 0, svgOrigin: '28 146' },
                { scaleX: 1, duration: 0.5, ease: 'power2.out' }, 0.12)
            .fromTo(points,
                { opacity: 0, scale: 0, transformOrigin: '50% 50%' },
                { opacity: 0.92, scale: 1, duration: 0.35, stagger: 0.06, ease: 'back.out(2.2)' }, 0.45)
            .fromTo(fit,
                { strokeDasharray: 1, strokeDashoffset: 1 },
                { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, 1.35);

        if (r2) {
            tl.to(r2state, {
                v: 0.99,
                duration: 0.9,
                ease: 'power2.out',
                onUpdate: function () { r2.textContent = r2state.v.toFixed(2); }
            }, 1.35);
        }
    }
})();
