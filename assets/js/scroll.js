// =============================================================
//  scroll.js  —  Scroll-driven motion controller
//  • reveal-on-scroll (IntersectionObserver, staggered)
//  • Experience "plate-heap" depth (scale + dim buried cards)
//  • Featured Projects one-by-one cascade
//  • scroll progress bar
//  Honors prefers-reduced-motion.
// =============================================================

(function () {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---------------------------------------------------------
    //  1. Scroll progress bar
    // ---------------------------------------------------------
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    function updateProgress() {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        const p = max > 0 ? h.scrollTop / max : 0;
        bar.style.transform = 'scaleX(' + p + ')';
    }

    // ---------------------------------------------------------
    //  2. Reveal-on-scroll
    //     Any element with .reveal / .reveal-fade fades in.
    //     Children of a [data-stagger] container get an
    //     incremental delay so they cascade one-by-one.
    // ---------------------------------------------------------
    if (reduceMotion) {
        document.querySelectorAll('.reveal, .reveal-fade').forEach(function (el) {
            el.classList.add('in');
        });
    } else {
        // assign stagger delays
        document.querySelectorAll('[data-stagger]').forEach(function (group) {
            const step = parseInt(group.getAttribute('data-stagger'), 10) || 90;
            const kids = group.querySelectorAll('.reveal, .reveal-fade');
            kids.forEach(function (el, i) {
                el.style.setProperty('--rd', (i * step) + 'ms');
            });
        });

        const revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                // toggle so the reveal replays scrolling DOWN and back UP
                entry.target.classList.toggle('in', entry.isIntersecting);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

        document.querySelectorAll('.reveal, .reveal-fade').forEach(function (el) {
            revealObserver.observe(el);
        });
    }

    // ---------------------------------------------------------
    //  3. Bidirectional cascade — Featured Projects + Certifications
    //     Cards light up as they enter (staggered) AND reset when
    //     they leave the viewport, so the cascade replays whether
    //     you scroll DOWN or back UP.
    // ---------------------------------------------------------
    function setStagger(items, cols, step) {
        items.forEach(function (el, i) {
            el.style.setProperty('--rd', ((i % cols) * step) + 'ms');
        });
    }

    const projectCards = Array.from(document.querySelectorAll('.projects-grid .project-card'));
    const certTiles    = Array.from(document.querySelectorAll('.certs-grid .cert-tile'));
    const certLabels   = Array.from(document.querySelectorAll('.cert-group-label'));

    if (reduceMotion) {
        projectCards.concat(certTiles, certLabels).forEach(function (el) {
            el.classList.add('in');
        });
    } else {
        // per-grid stagger so each row sweeps left-to-right
        setStagger(projectCards, 3, 110);
        document.querySelectorAll('.certs-grid').forEach(function (grid) {
            setStagger(Array.from(grid.children), 3, 100);
        });

        const cascadeObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                // toggle — add on enter, remove on leave (replays both directions)
                entry.target.classList.toggle('in', entry.isIntersecting);
            });
        }, { threshold: 0.16, rootMargin: '0px 0px -6% 0px' });

        projectCards.concat(certTiles, certLabels).forEach(function (el) {
            cascadeObserver.observe(el);
        });
    }

    // ---------------------------------------------------------
    //  4. Experience "plate-heap" depth
    //     As the next card rises to cover the current one,
    //     scale + dim the buried card so the stack reads as a
    //     receding heap of plates.
    // ---------------------------------------------------------
    const expCards = Array.from(document.querySelectorAll('.exp-card'));

    function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

    function updateStack() {
        for (let i = 0; i < expCards.length; i++) {
            const card = expCards[i];
            const next = expCards[i + 1];
            if (!next) {
                card.style.transform = 'scale(1)';
                card.style.filter = 'none';
                continue;
            }
            // stuck position of this card (matches CSS: 90px + i*18px)
            const base = window.innerWidth <= 768 ? 72 : 90;
            const peek = window.innerWidth <= 768 ? 12 : 18;
            const stuckTop = base + i * peek;

            const nextTop = next.getBoundingClientRect().top;
            // distance between next card's top and this card's resting top.
            // large  -> next still far below   -> not buried (t = 0)
            // small  -> next has climbed over  -> buried      (t = 1)
            const range = card.offsetHeight * 0.85;
            const t = clamp(1 - (nextTop - stuckTop) / range, 0, 1);

            const scale = 1 - t * 0.07;
            const bright = 1 - t * 0.32;
            card.style.transform = 'scale(' + scale.toFixed(4) + ')';
            card.style.filter = 'brightness(' + bright.toFixed(3) + ')';
        }
    }

    // ---------------------------------------------------------
    //  rAF-throttled scroll loop
    // ---------------------------------------------------------
    let ticking = false;
    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
            updateProgress();
            if (!reduceMotion) updateStack();
            ticking = false;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // initial paint
    updateProgress();
    if (!reduceMotion) updateStack();
})();
