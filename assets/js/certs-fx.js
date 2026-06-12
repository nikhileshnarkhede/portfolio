/* ============================================================
   certs-fx.js — Certifications "credential wall" layer
   • Counting numbers: "13 of 23" subtitle + per-group count chips
     animate 0 → N when the section/group scrolls into view
   • Group label hairline rule draws across the row on entry
   • "2026" recency chip pops in with a spring
   (The diagonal gleam sweep on each tile is pure CSS, keyed off
    the cascade's .in class — see certifications.css)

   Honors prefers-reduced-motion; degrades silently without GSAP.
   Visual transforms are scoped to chips/labels only — tile
   transforms stay owned by the scroll.js cascade + CSS hover.
   ============================================================ */
(function () {
    'use strict';

    var section = document.getElementById('certifications');
    if (!section) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
    if (reduceMotion || !hasGSAP) return;

    gsap.registerPlugin(ScrollTrigger);

    // ---------------------------------------------------------
    //  Subtitle counters — wrap each number in a span, count up
    // ---------------------------------------------------------
    var subtitle = section.querySelector('.certs-subtitle');
    if (subtitle && !subtitle.dataset.fx) {
        subtitle.dataset.fx = '1';
        subtitle.innerHTML = subtitle.innerHTML.replace(
            /\b(\d+)\b/g,
            '<span class="certs-num" data-n="$1">0</span>'
        );

        ScrollTrigger.create({
            trigger: section,
            start: 'top 72%',
            once: true,
            onEnter: function () {
                subtitle.querySelectorAll('.certs-num').forEach(function (el, i) {
                    var target = parseInt(el.dataset.n, 10) || 0;
                    var state = { n: 0 };
                    gsap.to(state, {
                        n: target,
                        duration: 1.1,
                        delay: i * 0.12,
                        ease: 'power2.out',
                        onUpdate: function () {
                            el.textContent = Math.round(state.n);
                        }
                    });
                });
            }
        });
    }

    // ---------------------------------------------------------
    //  Per-group: chip count-up, label rule draw, 2026 chip pop
    // ---------------------------------------------------------
    section.querySelectorAll('.cert-group').forEach(function (group) {
        var label = group.querySelector('.cert-group-label');
        var chip = group.querySelector('.cert-group-count');
        var recency = group.querySelector('.cert-group-new');

        if (recency) gsap.set(recency, { scale: 0, opacity: 0 });

        ScrollTrigger.create({
            trigger: group,
            start: 'top 78%',
            once: true,
            onEnter: function () {
                // hairline rule draws across the remaining row width
                if (label) label.classList.add('rule-in');

                // count chip 0 → N
                if (chip) {
                    var target = parseInt(chip.textContent, 10) || 0;
                    var state = { n: 0 };
                    gsap.to(state, {
                        n: target,
                        duration: 0.9,
                        ease: 'power2.out',
                        onUpdate: function () {
                            chip.textContent = Math.round(state.n);
                        }
                    });
                }

                // "2026" chip springs in after the count settles
                if (recency) {
                    gsap.to(recency, {
                        scale: 1,
                        opacity: 1,
                        duration: 0.55,
                        delay: 0.55,
                        ease: 'back.out(2.4)'
                    });
                }
            }
        });
    });
})();
