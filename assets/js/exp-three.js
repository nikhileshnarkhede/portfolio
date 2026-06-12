/* ============================================================
   exp-three.js — "Career trajectory" · refined flat design
   Three.js + GSAP ScrollTrigger layer for the Experience section.

   Visual language (deliberately flat & precise, not "3D balls"):
   • hairline path, gentle serpentine, minimal depth
   • crisp ring markers (billboard sprites, retina canvas textures)
   • numbers 01–08 aligned left of each node, tabular & consistent
   • active state: small blue fill + ring + faint tight glow
   • small traveling dot scrubbed to scroll, lit path behind it

   Sticky full-viewport canvas inside the section · pauses
   off-screen/hidden tab · reduced-motion → static frame ·
   degrades silently without WebGL or GSAP.
   Card transforms stay owned by scroll.js — this file only
   toggles classes and drives the WebGL scene.
   ============================================================ */
(function () {
    'use strict';

    var canvas = document.getElementById('exp-canvas');
    var section = document.getElementById('experience');
    if (!canvas || !section || typeof THREE === 'undefined') return;

    // the rail is desktop-only (CSS hides it < 1024px) — don't spin up
    // a WebGL context the user will never see
    if (window.matchMedia('(max-width: 1023px)').matches) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isMobile = window.matchMedia('(max-width: 768px)').matches;
    var hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
    if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

    var cards = Array.prototype.slice.call(section.querySelectorAll('.exp-card'));
    var NODES = Math.max(cards.length, 2);

    // ---------- Renderer / scene / camera ----------
    var renderer;
    try {
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
    } catch (e) {
        canvas.style.display = 'none';
        return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
    var CAMR = isMobile ? 17 : 14.5;

    var world = new THREE.Group();
    scene.add(world);

    // ---------- Path: straight vertical timeline rail ----------
    // Node i sits at the same index position as card i (01 top → 08
    // bottom), evenly spaced — the rail and the card stack are the
    // same ordered list.
    var nodePos = [];
    (function () {
        var i, u;
        for (i = 0; i < NODES; i++) {
            u = NODES > 1 ? i / (NODES - 1) : 0;
            nodePos.push(new THREE.Vector3(
                0,                  // straight line — no weave
                3.3 - u * 6.4,      // even descent, 01 at top
                0
            ));
        }
    })();

    var curve = new THREE.CatmullRomCurve3(nodePos, false, 'catmullrom', 0.6);
    var SEG = 360;
    var pathPts = curve.getPoints(SEG);

    var basePath = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pathPts),
        new THREE.LineBasicMaterial({
            color: 0xffffff, transparent: true, opacity: 0.22, depthWrite: false
        })
    );
    world.add(basePath);

    var litGeo = new THREE.BufferGeometry().setFromPoints(pathPts);
    litGeo.setDrawRange(0, 0);
    var litPath = new THREE.Line(litGeo, new THREE.LineBasicMaterial({
        color: 0x2997ff, transparent: true, opacity: 0.95, depthWrite: false
    }));
    world.add(litPath);

    // ---------- Crisp retina sprite textures ----------
    var TEX = 256;   // high-res canvas → crisp at small scale

    function texCircle(draw) {
        var c = document.createElement('canvas');
        c.width = c.height = TEX;
        draw(c.getContext('2d'));
        var t = new THREE.CanvasTexture(c);
        t.anisotropy = 4;
        return t;
    }

    var ringTex = texCircle(function (g) {
        g.strokeStyle = '#ffffff';
        g.lineWidth = 16;
        g.beginPath();
        g.arc(TEX / 2, TEX / 2, TEX / 2 - 14, 0, Math.PI * 2);
        g.stroke();
    });

    var dotTex = texCircle(function (g) {
        g.fillStyle = '#ffffff';
        g.beginPath();
        g.arc(TEX / 2, TEX / 2, TEX / 2 - 14, 0, Math.PI * 2);
        g.fill();
    });

    var glowTex = texCircle(function (g) {
        var grd = g.createRadialGradient(TEX / 2, TEX / 2, 0, TEX / 2, TEX / 2, TEX / 2);
        grd.addColorStop(0, 'rgba(90, 170, 255, 0.85)');
        grd.addColorStop(0.4, 'rgba(60, 150, 255, 0.25)');
        grd.addColorStop(1, 'rgba(40, 120, 255, 0)');
        g.fillStyle = grd;
        g.fillRect(0, 0, TEX, TEX);
    });

    function texLabel(text) {
        var c = document.createElement('canvas');
        c.width = 256;
        c.height = 128;
        var g = c.getContext('2d');
        g.font = '500 76px -apple-system, "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif';
        g.textAlign = 'right';
        g.textBaseline = 'middle';
        g.fillStyle = '#ffffff';
        g.fillText(text, 236, 68);
        var t = new THREE.CanvasTexture(c);
        t.anisotropy = 4;
        return t;
    }

    function sprite(tex, color, opacity, sx, sy) {
        var s = new THREE.Sprite(new THREE.SpriteMaterial({
            map: tex, transparent: true, opacity: opacity, depthWrite: false
        }));
        s.material.color.set(color);
        s.scale.set(sx, sy, 1);
        return s;
    }

    // ---------- Milestone nodes (flat, precise) ----------
    var BLUE = 0x2997ff;
    var nodes = [];

    nodePos.forEach(function (p, i) {
        // faint tight glow, active only
        var glow = sprite(glowTex, 0xffffff, 0, 1.0, 1.0);
        glow.position.copy(p);
        world.add(glow);

        // blue fill, active only
        var fill = sprite(dotTex, BLUE, 0, 0.21, 0.21);
        fill.position.copy(p);
        world.add(fill);

        // crisp ring, always visible
        var ring = sprite(ringTex, 0xffffff, 0.55, 0.3, 0.3);
        ring.position.copy(p);
        world.add(ring);

        // number, right-aligned to a consistent offset left of the node
        var num = (i + 1 < 10 ? '0' : '') + (i + 1);
        var label = sprite(texLabel(num), 0xffffff, 0.45, 1.1, 0.55);
        label.center.set(1, 0.5);                  // anchor: right edge, middle
        label.position.set(p.x - 0.3, p.y, p.z);   // fixed gap from the ring
        world.add(label);

        nodes.push({ ring: ring, fill: fill, glow: glow, label: label, lit: false });
    });

    // ---------- Traveling marker: small bright dot ----------
    var marker = sprite(dotTex, 0xbfe0ff, 1, 0.13, 0.13);
    world.add(marker);
    var markerGlow = sprite(glowTex, 0xffffff, 0.55, 0.55, 0.55);
    world.add(markerGlow);

    // ---------- Sparse ambient particles ----------
    var P = isMobile ? 140 : 260;
    var pPos = new Float32Array(P * 3);
    var pSeed = new Float32Array(P);
    for (var pi = 0; pi < P; pi++) {
        pPos[pi * 3]     = (Math.random() - 0.5) * 26;
        pPos[pi * 3 + 1] = (Math.random() - 0.5) * 14;
        pPos[pi * 3 + 2] = (Math.random() - 0.5) * 12 - 2;
        pSeed[pi] = Math.random() * Math.PI * 2;
    }
    var pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3).setUsage(THREE.DynamicDrawUsage));
    var particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
        color: 0xaecbe8, size: 0.04, transparent: true, opacity: 0.3,
        sizeAttenuation: true, depthWrite: false
    }));
    world.add(particles);

    // ---------- Scroll progress state ----------
    var prog = { v: 0 };
    var camDrift = { v: 0 };
    var renderDirty = true;

    function applyProgress(p) {
        p = Math.max(0, Math.min(1, p));
        prog.v = p;
        var pt = curve.getPointAt(p);
        marker.position.copy(pt);
        markerGlow.position.copy(pt);
        litGeo.setDrawRange(0, Math.max(1, Math.floor(p * SEG) + 1));
        renderDirty = true;
    }

    // ---------- Active node / card sync ----------
    var activeIndex = -1;

    function setNodeState(i, on) {
        var n = nodes[i];
        if (!n || n.lit === on) return;
        n.lit = on;

        n.label.material.color.set(on ? 0x6ab6ff : 0xffffff);
        n.ring.material.color.set(on ? BLUE : 0xffffff);

        if (hasGSAP && !reduceMotion) {
            gsap.to(n.fill.material, { opacity: on ? 1 : 0, duration: 0.35 });
            gsap.to(n.glow.material, { opacity: on ? 0.4 : 0, duration: 0.45 });
            gsap.to(n.ring.material, { opacity: on ? 1 : 0.55, duration: 0.35 });
            gsap.to(n.ring.scale, { x: on ? 0.4 : 0.3, y: on ? 0.4 : 0.3, duration: 0.45, ease: 'power3.out' });
            gsap.to(n.label.material, { opacity: on ? 1 : 0.45, duration: 0.35 });
        } else {
            n.fill.material.opacity = on ? 1 : 0;
            n.glow.material.opacity = on ? 0.4 : 0;
            n.ring.material.opacity = on ? 1 : 0.55;
            n.ring.scale.set(on ? 0.4 : 0.3, on ? 0.4 : 0.3, 1);
            n.label.material.opacity = on ? 1 : 0.45;
        }
        renderDirty = true;
    }

    function setActive(i) {
        if (i === activeIndex) return;
        if (activeIndex >= 0) {
            setNodeState(activeIndex, false);
            if (cards[activeIndex]) cards[activeIndex].classList.remove('exp-card--active');
        }
        activeIndex = i;
        if (i >= 0) {
            setNodeState(i, true);
            if (cards[i]) cards[i].classList.add('exp-card--active');
        }
    }

    // ---------- Camera ----------
    var mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    if (!isMobile && !reduceMotion) {
        window.addEventListener('mousemove', function (e) {
            mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
            mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
        }, { passive: true });
    }

    function placeCamera(t) {
        mouse.x += (mouse.tx - mouse.x) * 0.04;
        mouse.y += (mouse.ty - mouse.y) * 0.04;
        var d = camDrift.v;
        var ang = mouse.x * 0.03 + Math.sin(t * 0.05) * 0.015;   // tiny yaw sway only
        var camY = 1.5 - d * 3.2 + mouse.y * -0.3;
        camera.position.set(
            Math.sin(ang) * CAMR,
            camY,
            Math.cos(ang) * CAMR
        );
        // look HORIZONTALLY (zero pitch) — keeps the off-center rail a
        // perfect 90° vertical on screen (no perspective keystone lean)
        camera.lookAt(0, camY, 0);
    }

    // ---------- Sizing (sticky 100vh canvas) ----------
    function resize() {
        var w = section.clientWidth || window.innerWidth;
        var h = window.innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();

        var visW = 2 * Math.tan(camera.fov * Math.PI / 360) * CAMR * camera.aspect;

        if (w >= 1024) {
            // desktop split layout: rail sits just left of the cards —
            // close enough to read as one combined timeline component
            world.position.x = -visW * 0.30;
            world.position.y = -1.3;
            world.scale.setScalar(1);
        } else {
            // mobile/tablet: centered backdrop — scale the composition to
            // fit the narrow frustum so the line + labels never clip
            world.position.x = 0;
            world.position.y = 0;
            var span = 3.4;                       // rail + labels width (world units)
            var fit = Math.min(1, (visW * 0.92) / span);
            world.scale.setScalar(fit);
        }

        renderDirty = true;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // ---------- Scroll wiring ----------
    if (hasGSAP && !reduceMotion) {
        gsap.to(prog, {
            v: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top 60%',
                end: 'bottom 75%',
                scrub: 0.9
            },
            onUpdate: function () { applyProgress(prog.v); }
        });

        gsap.to(camDrift, {
            v: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.2
            }
        });

        cards.forEach(function (card, i) {
            ScrollTrigger.create({
                trigger: card,
                start: 'top 62%',
                end: 'bottom 30%',
                onToggle: function (self) {
                    if (self.isActive) setActive(i);
                    else if (activeIndex === i) setActive(-1);
                }
            });
        });

        window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    } else if (!reduceMotion) {
        function fallbackScroll() {
            var r = section.getBoundingClientRect();
            var vh = window.innerHeight;
            var total = r.height - vh * 0.4;
            var p = total > 0 ? (vh * 0.6 - r.top) / total : 0;
            applyProgress(p);
            camDrift.v = Math.max(0, Math.min(1, (vh - r.top) / (r.height + vh)));
            var idx = Math.round(Math.max(0, Math.min(1, p)) * (NODES - 1));
            setActive(p > 0.02 && p < 1.02 ? idx : -1);
        }
        window.addEventListener('scroll', fallbackScroll, { passive: true });
        fallbackScroll();
    }

    // ---------- Render loop with visibility gating ----------
    var running = true;
    var inView = true;

    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
            inView = entries[0].isIntersecting;
        }, { threshold: 0.01 }).observe(section);
    }
    document.addEventListener('visibilitychange', function () {
        running = !document.hidden;
    });

    var clock = new THREE.Clock();

    function renderStatic() {
        litGeo.setDrawRange(0, SEG + 1);
        nodes.forEach(function (n) {
            n.ring.material.opacity = 0.8;
            n.label.material.opacity = 0.7;
        });
        applyProgress(0);
        camDrift.v = 0.35;
        placeCamera(0);
        renderer.render(scene, camera);
    }

    if (reduceMotion) {
        renderStatic();
        window.addEventListener('resize', renderStatic, { passive: true });
        return;
    }

    function tick() {
        requestAnimationFrame(tick);
        if (!running || !inView) { clock.getDelta(); return; }

        var dt = Math.min(clock.getDelta(), 0.05);
        var t = clock.elapsedTime;

        for (var i = 0; i < P; i++) {
            pPos[i * 3 + 1] += Math.sin(t * 0.35 + pSeed[i]) * dt * 0.1;
            pPos[i * 3]     += Math.cos(t * 0.22 + pSeed[i]) * dt * 0.07;
        }
        pGeo.attributes.position.needsUpdate = true;

        // restrained marker pulse
        var pulse = 1 + Math.sin(t * 2.6) * 0.08;
        marker.scale.set(0.13 * pulse, 0.13 * pulse, 1);
        markerGlow.scale.set(0.55 * pulse, 0.55 * pulse, 1);

        placeCamera(t);
        renderer.render(scene, camera);
    }
    tick();
})();
