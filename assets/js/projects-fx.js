/* ============================================================
   projects-fx.js — Featured Projects interaction layer
   • 3D cursor tilt on each project card (GSAP quickTo, perspective)
   • Light-reactive spotlight that tracks the pointer (CSS vars,
     painted by .project-card::after in scroll.css)
   • Magnetic "View All Projects on GitHub" button
   Fine-pointer devices only; honors prefers-reduced-motion;
   degrades silently without GSAP.

   COEXISTENCE with scroll.js cascade:
   scroll.css gives .project-card a CSS transition on transform
   (the reveal cascade). While the pointer is over a card we add
   .fx-live, which drops `transform` from the transition list so
   GSAP can drive it without being smeared/delayed. On leave we
   tween back to neutral, clearProps, and remove the class — the
   scroll cascade regains full ownership.
   ============================================================ */
(function () {
    'use strict';

    var grid = document.querySelector('.projects-grid');
    if (!grid) return;

    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reduceMotion) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll('.project-card'));
    var hasGSAP = typeof gsap !== 'undefined';

    // ---------------------------------------------------------
    //  Spotlight — pure CSS-var update, works with or without GSAP
    // ---------------------------------------------------------
    function moveSpot(card, e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }

    // ---------------------------------------------------------
    //  3D tilt — GSAP quickTo for buttery per-frame updates
    // ---------------------------------------------------------
    var MAX_RX = 7;    // deg, around X (pointer up/down)
    var MAX_RY = 9;    // deg, around Y (pointer left/right)

    cards.forEach(function (card) {
        var toRX = null, toRY = null;

        card.addEventListener('pointerenter', function () {
            card.classList.add('fx-live');
            if (!hasGSAP) return;

            gsap.set(card, { transformPerspective: 900, transformOrigin: 'center' });
            toRX = gsap.quickTo(card, 'rotationX', { duration: 0.45, ease: 'power3.out' });
            toRY = gsap.quickTo(card, 'rotationY', { duration: 0.45, ease: 'power3.out' });
            gsap.to(card, { scale: 1.018, duration: 0.45, ease: 'power3.out' });
        });

        card.addEventListener('pointermove', function (e) {
            moveSpot(card, e);
            if (!hasGSAP || !toRX) return;

            var r = card.getBoundingClientRect();
            var px = (e.clientX - r.left) / r.width - 0.5;   // -0.5 .. 0.5
            var py = (e.clientY - r.top) / r.height - 0.5;
            toRX(-py * MAX_RX * 2);
            toRY(px * MAX_RY * 2);
        });

        card.addEventListener('pointerleave', function () {
            if (!hasGSAP) {
                card.classList.remove('fx-live');
                return;
            }
            toRX = toRY = null;
            gsap.to(card, {
                rotationX: 0,
                rotationY: 0,
                scale: 1,
                duration: 0.6,
                ease: 'power3.out',
                onComplete: function () {
                    gsap.set(card, { clearProps: 'transform,transformPerspective' });
                    card.classList.remove('fx-live');
                }
            });
        });
    });

    // ---------------------------------------------------------
    //  Magnetic "View All Projects" button
    //  (same recipe as the hero CTAs in landing-anim.js,
    //   scoped here so the two never double-bind)
    // ---------------------------------------------------------
    if (hasGSAP) {
        var moreBtn = document.querySelector('.more-projects .btn');
        if (moreBtn) {
            var strength = 0.3;
            moreBtn.addEventListener('mousemove', function (e) {
                var r = moreBtn.getBoundingClientRect();
                gsap.to(moreBtn, {
                    x: (e.clientX - (r.left + r.width / 2)) * strength,
                    y: (e.clientY - (r.top + r.height / 2)) * strength,
                    duration: 0.4,
                    ease: 'power3.out'
                });
            });
            moreBtn.addEventListener('mouseleave', function () {
                gsap.to(moreBtn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)' });
            });
        }
    }
})();
