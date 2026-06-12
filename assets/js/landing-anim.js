/* ============================================================
   landing-anim.js — GSAP orchestration layer
   • Hero intro: masked line reveals, staged content entrance
   • Hero parallax out on scroll (ScrollTrigger)
   • Auto-hiding glass navbar (down = hide, up = show)
   • Magnetic CTAs (fine pointers only)
   Degrades silently if GSAP fails to load; honors
   prefers-reduced-motion.
   ============================================================ */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ------------------------------------------------------
       Auto-hiding navbar (no GSAP needed — always available)
       ------------------------------------------------------ */
    var navbar = document.querySelector('.navbar');
    var navMenu = document.querySelector('.nav-menu');
    var lastY = window.scrollY;
    var navTicking = false;

    function updateNav() {
        var y = window.scrollY;
        var menuOpen = navMenu && navMenu.classList.contains('active');
        if (!navbar || menuOpen) { navTicking = false; return; }

        if (y > lastY + 6 && y > 220) {
            navbar.classList.add('nav-hidden');
        } else if (y < lastY - 6 || y < 220) {
            navbar.classList.remove('nav-hidden');
        }
        lastY = y;
        navTicking = false;
    }

    window.addEventListener('scroll', function () {
        if (navTicking) return;
        navTicking = true;
        requestAnimationFrame(updateNav);
    }, { passive: true });

    /* ------------------------------------------------------
       Everything below needs GSAP
       ------------------------------------------------------ */
    if (typeof gsap === 'undefined' || reduceMotion) return;

    var hasST = typeof ScrollTrigger !== 'undefined';
    if (hasST) gsap.registerPlugin(ScrollTrigger);

    /* ---------- Hero intro timeline ---------- */
    var heroEls = {
        canvas:  '#hero-canvas',
        eyebrow: '.hero-eyebrow',
        lines:   '.hero-line',
        sub:     '.hero-sub',
        ctas:    '.hero .cta-buttons .btn, .hero .cta-buttons .btn-secondary, .hero .cta-buttons .btn-pill-dark',
        stats:   '.hero-stat',
        cue:     '.scroll-cue',
        fig:     '.hero-fig'
    };

    if (document.querySelector('.hero-line')) {
        gsap.set(heroEls.canvas,  { opacity: 0 });
        gsap.set(heroEls.eyebrow, { opacity: 0, y: 14 });
        gsap.set(heroEls.lines,   { yPercent: 115 });
        gsap.set(heroEls.sub,     { opacity: 0, y: 18 });
        gsap.set(heroEls.ctas,    { opacity: 0, y: 18 });
        gsap.set(heroEls.stats,   { opacity: 0, y: 16 });
        gsap.set([heroEls.cue, heroEls.fig], { opacity: 0 });

        var intro = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.15 });
        intro
            .to(heroEls.canvas,  { opacity: 0.95, duration: 2.2, ease: 'power2.out' }, 0)
            .to(heroEls.eyebrow, { opacity: 1, y: 0, duration: 0.8 }, 0.1)
            .to(heroEls.lines,   { yPercent: 0, duration: 1.25, stagger: 0.13 }, 0.25)
            .to(heroEls.sub,     { opacity: 1, y: 0, duration: 0.9 }, 0.8)
            .to(heroEls.ctas,    { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.95)
            .to(heroEls.stats,   { opacity: 1, y: 0, duration: 0.8, stagger: 0.07 }, 1.15)
            .to([heroEls.cue, heroEls.fig], { opacity: 1, duration: 1.0 }, 1.5);
    }

    /* ---------- Hero parallax out on scroll ---------- */
    if (hasST && document.querySelector('.hero-content')) {
        gsap.to('.hero-content', {
            yPercent: -14,
            opacity: 0.15,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: '88% top',
                scrub: 0.4
            }
        });
        gsap.to('#hero-canvas', {
            yPercent: 10,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 0.4
            }
        });
    }

    /* ---------- Magnetic CTAs (desktop, fine pointer) ---------- */
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.querySelectorAll('.hero .cta-buttons a').forEach(function (btn) {
            var strength = 0.32;
            btn.addEventListener('mousemove', function (e) {
                var r = btn.getBoundingClientRect();
                var dx = e.clientX - (r.left + r.width / 2);
                var dy = e.clientY - (r.top + r.height / 2);
                gsap.to(btn, {
                    x: dx * strength,
                    y: dy * strength,
                    duration: 0.4,
                    ease: 'power3.out'
                });
            });
            btn.addEventListener('mouseleave', function () {
                gsap.to(btn, {
                    x: 0, y: 0,
                    duration: 0.7,
                    ease: 'elastic.out(1, 0.45)'
                });
            });
        });
    }
})();
