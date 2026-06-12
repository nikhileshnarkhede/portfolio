/* ============================================================
   pubs-fx.js — Publications figure, full play on arrival
   The moment the publication card enters the viewport — whether
   scrolling DOWN into it or back UP into it — the COMPLETE
   sequence plays start-to-finish at its own pace:

     axes draft in → points populate → fit draws → R² rolls to 0.99

   It restarts on every entry (both directions), so the reader
   always sees the whole figure perform.

   CSS holds the figure's FINAL state, so reduced-motion visitors
   and GSAP-less fallbacks simply see the completed plot with the
   static "0.99" from the HTML.
   ============================================================ */
(function () {
    'use strict';

    var item = document.querySelector('.publication-item');
    if (!item) return;

    var axisY = item.querySelector('.pub-axis-y');
    var axisX = item.querySelector('.pub-axis-x');
    var points = item.querySelectorAll('.pub-pt');
    var fit = item.querySelector('.pub-fit');
    var r2 = item.querySelector('.pub-r2');
    if (!axisY || !axisX || !fit) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
    if (reduceMotion || !hasGSAP) return;   // CSS final state remains

    gsap.registerPlugin(ScrollTrigger);

    var r2state = { v: 0 };
    if (r2) r2.textContent = '0.00';

    var tl = gsap.timeline({
        paused: true,
        scrollTrigger: {
            trigger: item,
            start: 'top 82%',     // entering from below (scrolling down)
            end: 'bottom 18%',    // entering from above (scrolling back up)
            // restart on enter (down) and on enter-back (up)
            toggleActions: 'restart none restart none'
        }
    });

    tl
        // axes draft in — anchored at the plot origin (28,146)
        .fromTo(axisY,
            { scaleY: 0, svgOrigin: '28 146' },
            { scaleY: 1, duration: 0.5, ease: 'power2.out' }, 0)
        .fromTo(axisX,
            { scaleX: 0, svgOrigin: '28 146' },
            { scaleX: 1, duration: 0.5, ease: 'power2.out' }, 0.12)

        // data points populate one by one
        .fromTo(points,
            { opacity: 0, scale: 0, transformOrigin: '50% 50%' },
            {
                opacity: 0.92,
                scale: 1,
                duration: 0.35,
                stagger: 0.06,
                ease: 'back.out(2.2)'
            }, 0.45)

        // regression fit draws through the cloud
        .fromTo(fit,
            { strokeDasharray: 1, strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, 1.35);

    // R² rolls up in lockstep with the fit line
    if (r2) {
        tl.to(r2state, {
            v: 0.99,
            duration: 0.9,
            ease: 'power2.out',
            onUpdate: function () {
                r2.textContent = r2state.v.toFixed(2);
            }
        }, 1.35);
    }
})();
