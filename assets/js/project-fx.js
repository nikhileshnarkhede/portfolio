/* ============================================================
   project-fx.js — shared dynamic layer for all projects/*.html
   • HERO: Three.js constellation field (drifting particles with
     proximity linking) behind the black hero + mouse parallax.
     Canvas is injected by JS — no HTML changes needed per page.
   • HERO: GSAP entrance stagger (back-link → title → subtitle)
     and a scrubbed parallax drift as the hero scrolls away.
   • REPO CARDS: 3D cursor tilt + light spotlight (same language
     as the Featured Projects grid on the main page).

   Honors prefers-reduced-motion; degrades silently without
   Three.js / GSAP / WebGL. Fine-pointer gating for tilt.
   ============================================================ */
(function () {
    'use strict';

    var hero = document.querySelector('.project-hero');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
    if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

    /* =========================================================
       1 · HERO ENTRANCE + SCROLL PARALLAX (GSAP)
       ========================================================= */
    if (hero && hasGSAP && !reduceMotion) {
        var heroBits = hero.querySelectorAll('.back-link, h1, p');

        gsap.from(heroBits, {
            opacity: 0,
            y: 26,
            duration: 0.9,
            stagger: 0.12,
            delay: 0.1,
            ease: 'power3.out'
        });

        // content drifts up + fades as the hero leaves the viewport
        gsap.to(hero.querySelectorAll('h1, p'), {
            y: -44,
            opacity: 0.25,
            ease: 'none',
            scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: 'bottom top',
                scrub: 0.6
            }
        });
    }

    /* =========================================================
       2 · HERO CONSTELLATION (Three.js)
       ========================================================= */
    (function constellation() {
        if (!hero || typeof THREE === 'undefined' || reduceMotion) return;

        var canvas = document.createElement('canvas');
        canvas.className = 'phero-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        hero.prepend(canvas);

        var renderer;
        try {
            renderer = new THREE.WebGLRenderer({
                canvas: canvas, antialias: true, alpha: true,
                powerPreference: 'high-performance'
            });
        } catch (e) {
            canvas.remove();
            return;
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
        camera.position.z = 15;

        var small = window.innerWidth < 768;
        var N = small ? 64 : 120;
        var SX = 24, SY = 10, SZ = 6;        // field half-extents
        var LINK = 3.0;                       // linking distance
        var MAXSEG = N * 5;

        var pos = new Float32Array(N * 3);
        var vel = new Float32Array(N * 3);
        for (var i = 0; i < N; i++) {
            pos[i * 3]     = (Math.random() - 0.5) * 2 * SX;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 2 * SY;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 2 * SZ;
            vel[i * 3]     = (Math.random() - 0.5) * 0.5;
            vel[i * 3 + 1] = (Math.random() - 0.5) * 0.35;
            vel[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
        }

        var ptGeo = new THREE.BufferGeometry();
        ptGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
        scene.add(new THREE.Points(ptGeo, new THREE.PointsMaterial({
            color: 0x9fc6ee, size: 0.09, transparent: true, opacity: 0.75,
            sizeAttenuation: true, depthWrite: false
        })));

        var linePos = new Float32Array(MAXSEG * 6);
        var lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3).setUsage(THREE.DynamicDrawUsage));
        lineGeo.setDrawRange(0, 0);
        scene.add(new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
            color: 0x2997ff, transparent: true, opacity: 0.16, depthWrite: false
        })));

        var mouse = { x: 0, y: 0, tx: 0, ty: 0 };
        if (finePointer) {
            window.addEventListener('mousemove', function (e) {
                mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
                mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
            }, { passive: true });
        }

        function resize() {
            var w = hero.clientWidth || window.innerWidth;
            var h = hero.clientHeight || 420;
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        }
        resize();
        window.addEventListener('resize', resize, { passive: true });

        var running = true;
        var inView = true;
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) {
                inView = entries[0].isIntersecting;
            }, { threshold: 0.01 }).observe(hero);
        }
        document.addEventListener('visibilitychange', function () {
            running = !document.hidden;
        });

        var clock = new THREE.Clock();

        function tick() {
            requestAnimationFrame(tick);
            if (!running || !inView) { clock.getDelta(); return; }

            var dt = Math.min(clock.getDelta(), 0.05);

            // drift + wrap
            for (var i = 0; i < N; i++) {
                pos[i * 3]     += vel[i * 3] * dt;
                pos[i * 3 + 1] += vel[i * 3 + 1] * dt;
                pos[i * 3 + 2] += vel[i * 3 + 2] * dt;
                if (pos[i * 3]     >  SX) pos[i * 3]     = -SX;
                if (pos[i * 3]     < -SX) pos[i * 3]     =  SX;
                if (pos[i * 3 + 1] >  SY) pos[i * 3 + 1] = -SY;
                if (pos[i * 3 + 1] < -SY) pos[i * 3 + 1] =  SY;
                if (pos[i * 3 + 2] >  SZ) pos[i * 3 + 2] = -SZ;
                if (pos[i * 3 + 2] < -SZ) pos[i * 3 + 2] =  SZ;
            }
            ptGeo.attributes.position.needsUpdate = true;

            // proximity linking
            var seg = 0;
            var L2 = LINK * LINK;
            for (var a = 0; a < N && seg < MAXSEG; a++) {
                for (var b = a + 1; b < N && seg < MAXSEG; b++) {
                    var dx = pos[a * 3] - pos[b * 3];
                    var dy = pos[a * 3 + 1] - pos[b * 3 + 1];
                    var dz = pos[a * 3 + 2] - pos[b * 3 + 2];
                    if (dx * dx + dy * dy + dz * dz < L2) {
                        var o = seg * 6;
                        linePos[o]     = pos[a * 3];
                        linePos[o + 1] = pos[a * 3 + 1];
                        linePos[o + 2] = pos[a * 3 + 2];
                        linePos[o + 3] = pos[b * 3];
                        linePos[o + 4] = pos[b * 3 + 1];
                        linePos[o + 5] = pos[b * 3 + 2];
                        seg++;
                    }
                }
            }
            lineGeo.setDrawRange(0, seg * 2);
            lineGeo.attributes.position.needsUpdate = true;

            // mouse parallax
            mouse.x += (mouse.tx - mouse.x) * 0.05;
            mouse.y += (mouse.ty - mouse.y) * 0.05;
            camera.position.x = mouse.x * 1.4;
            camera.position.y = mouse.y * -0.9;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
        }
        tick();
    })();

    /* =========================================================
       3 · REPO CARD TILT + SPOTLIGHT
       (same interaction language as the main Projects grid)
       ========================================================= */
    if (finePointer && !reduceMotion) {
        var cards = document.querySelectorAll('.repo-card');

        cards.forEach(function (card) {
            var toRX = null, toRY = null;

            card.addEventListener('pointerenter', function () {
                card.classList.add('fx-live');
                if (!hasGSAP) return;
                gsap.set(card, { transformPerspective: 850, transformOrigin: 'center' });
                toRX = gsap.quickTo(card, 'rotationX', { duration: 0.45, ease: 'power3.out' });
                toRY = gsap.quickTo(card, 'rotationY', { duration: 0.45, ease: 'power3.out' });
                gsap.to(card, { scale: 1.015, duration: 0.45, ease: 'power3.out' });
            });

            card.addEventListener('pointermove', function (e) {
                var r = card.getBoundingClientRect();
                card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
                card.style.setProperty('--my', (e.clientY - r.top) + 'px');
                if (!hasGSAP || !toRX) return;
                var px = (e.clientX - r.left) / r.width - 0.5;
                var py = (e.clientY - r.top) / r.height - 0.5;
                toRX(-py * 12);
                toRY(px * 16);
            });

            card.addEventListener('pointerleave', function () {
                if (!hasGSAP) {
                    card.classList.remove('fx-live');
                    return;
                }
                toRX = toRY = null;
                gsap.to(card, {
                    rotationX: 0, rotationY: 0, scale: 1,
                    duration: 0.55, ease: 'power3.out',
                    onComplete: function () {
                        gsap.set(card, { clearProps: 'transform,transformPerspective' });
                        card.classList.remove('fx-live');
                    }
                });
            });
        });
    }
})();
