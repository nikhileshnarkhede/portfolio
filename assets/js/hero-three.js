/* ============================================================
   hero-three.js — "Gradient descent on a loss landscape"
   Signature hero visual for an ML researcher.
   • Point-cloud wireframe surface (a living loss function)
   • A glowing marker performs momentum gradient descent,
     leaves a fading trail, converges, then respawns
   • Slow camera orbit + mouse parallax
   • Pauses when off-screen / tab hidden
   • prefers-reduced-motion → single static frame
   Degrades silently if Three.js fails to load.
   ============================================================ */
(function () {
    'use strict';

    var canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isMobile = window.matchMedia('(max-width: 768px)').matches;

    var hero = canvas.parentElement;

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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.75 : 2));

    var scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.055);

    var camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);

    // ---------- The loss function f(x, y, t) ----------
    var EXT = 8.5;                       // half-extent of the surface
    function fSurf(x, y, t) {
        return 1.05 * Math.sin(0.50 * x) * Math.cos(0.50 * y)
             + 0.45 * Math.sin(1.05 * x + 1.3) * Math.cos(0.85 * y - 0.6)
             + 0.12 * Math.sin(2.2 * x + t) * Math.cos(2.0 * y - 0.8 * t);
    }
    function grad(x, y, t) {
        var h = 0.02;
        return {
            x: (fSurf(x + h, y, t) - fSurf(x - h, y, t)) / (2 * h),
            y: (fSurf(x, y + h, t) - fSurf(x, y - h, t)) / (2 * h)
        };
    }

    // ---------- Surface point cloud ----------
    var N = isMobile ? 78 : 118;         // grid resolution per axis
    var COUNT = N * N;
    var positions = new Float32Array(COUNT * 3);
    var colors = new Float32Array(COUNT * 3);
    var geo = new THREE.BufferGeometry();

    var zMin = -1.7, zMax = 1.7;         // approx range of fSurf for shading

    function buildSurface(t) {
        var i, ix, iy, x, y, z, k, s;
        i = 0;
        for (iy = 0; iy < N; iy++) {
            for (ix = 0; ix < N; ix++) {
                x = (ix / (N - 1) - 0.5) * 2 * EXT;
                y = (iy / (N - 1) - 0.5) * 2 * EXT;
                z = fSurf(x, y, t);
                k = i * 3;
                positions[k]     = x;
                positions[k + 1] = z;
                positions[k + 2] = y;

                // shading: valleys dim, ridges bright (monochrome)
                s = (z - zMin) / (zMax - zMin);
                s = 0.16 + 0.62 * Math.max(0, Math.min(1, s));
                colors[k]     = s;
                colors[k + 1] = s;
                colors[k + 2] = s * 1.06;   // whisper of cool tint
                i++;
            }
        }
    }

    buildSurface(0);
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    var pts = new THREE.Points(geo, new THREE.PointsMaterial({
        size: isMobile ? 0.055 : 0.045,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        sizeAttenuation: true,
        depthWrite: false
    }));
    scene.add(pts);

    // ---------- Glow texture (radial gradient sprite) ----------
    function makeGlowTexture() {
        var c = document.createElement('canvas');
        c.width = c.height = 128;
        var g = c.getContext('2d');
        var grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
        grd.addColorStop(0.0, 'rgba(120, 190, 255, 1)');
        grd.addColorStop(0.25, 'rgba(60, 155, 255, 0.55)');
        grd.addColorStop(1.0, 'rgba(40, 120, 255, 0)');
        g.fillStyle = grd;
        g.fillRect(0, 0, 128, 128);
        var tex = new THREE.CanvasTexture(c);
        return tex;
    }

    // ---------- Descent marker + trail ----------
    var marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.085, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0x8ec8ff })
    );
    scene.add(marker);

    var glow = new THREE.Sprite(new THREE.SpriteMaterial({
        map: makeGlowTexture(),
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 0.95
    }));
    glow.scale.set(1.5, 1.5, 1);
    scene.add(glow);

    var TRAIL_MAX = 140;
    var trailPos = new Float32Array(TRAIL_MAX * 3);
    var trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3).setUsage(THREE.DynamicDrawUsage));
    trailGeo.setDrawRange(0, 0);
    var trail = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({
        color: 0x2997ff,
        transparent: true,
        opacity: 0.55,
        depthWrite: false
    }));
    scene.add(trail);
    var trailLen = 0;

    // descent state
    var ball = { x: 0, y: 0, vx: 0, vy: 0, settled: 0, fade: 1, dying: false };

    function respawn() {
        // spawn somewhere on the outer ring so the descent reads clearly
        var ang = Math.random() * Math.PI * 2;
        var r = EXT * (0.45 + Math.random() * 0.38);
        ball.x = Math.cos(ang) * r;
        ball.y = Math.sin(ang) * r;
        ball.vx = 0; ball.vy = 0;
        ball.settled = 0;
        ball.dying = false;
        ball.fade = 0;
        trailLen = 0;
        trailGeo.setDrawRange(0, 0);
    }
    respawn();
    ball.fade = 1; // first appearance: no fade-in pop

    function stepDescent(t, dt) {
        if (ball.dying) {
            ball.fade -= dt * 1.6;
            if (ball.fade <= 0) respawn();
        } else if (ball.fade < 1) {
            ball.fade = Math.min(1, ball.fade + dt * 1.4);
        }

        if (!ball.dying) {
            var g = grad(ball.x, ball.y, t);
            var lr = 1.55 * dt;            // learning rate (per-second scaled)
            ball.vx = ball.vx * Math.pow(0.06, dt) - lr * g.x * 2.2;
            ball.vy = ball.vy * Math.pow(0.06, dt) - lr * g.y * 2.2;
            ball.x += ball.vx;
            ball.y += ball.vy;

            // keep on the table
            var lim = EXT * 0.98;
            if (ball.x > lim) { ball.x = lim; ball.vx *= -0.4; }
            if (ball.x < -lim) { ball.x = -lim; ball.vx *= -0.4; }
            if (ball.y > lim) { ball.y = lim; ball.vy *= -0.4; }
            if (ball.y < -lim) { ball.y = -lim; ball.vy *= -0.4; }

            var speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
            var gmag = Math.sqrt(g.x * g.x + g.y * g.y);
            if (speed < 0.004 && gmag < 0.05) {
                ball.settled += dt;
                if (ball.settled > 1.6) ball.dying = true; // converged → fade & respawn
            } else {
                ball.settled = 0;
            }
        }

        var z = fSurf(ball.x, ball.y, t) + 0.10;
        marker.position.set(ball.x, z, ball.y);
        glow.position.copy(marker.position);

        var f = Math.max(0, Math.min(1, ball.fade));
        marker.material.opacity = f;
        marker.material.transparent = true;
        glow.material.opacity = 0.95 * f;
        marker.scale.setScalar(0.6 + 0.4 * f);

        // trail (skip while fading out)
        if (!ball.dying) {
            if (trailLen < TRAIL_MAX) {
                trailLen++;
            } else {
                // shift left by one point
                trailPos.copyWithin(0, 3);
            }
            var k = (trailLen - 1) * 3;
            trailPos[k] = ball.x;
            trailPos[k + 1] = z - 0.04;
            trailPos[k + 2] = ball.y;
            trailGeo.attributes.position.needsUpdate = true;
            trailGeo.setDrawRange(0, trailLen);
        }
        trail.material.opacity = 0.55 * f;
    }

    // ---------- Camera orbit + mouse parallax ----------
    var mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    if (!isMobile) {
        window.addEventListener('mousemove', function (e) {
            mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
            mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
        }, { passive: true });
    }

    function placeCamera(t) {
        mouse.x += (mouse.tx - mouse.x) * 0.04;
        mouse.y += (mouse.ty - mouse.y) * 0.04;

        var ang = 0.55 + t * 0.035 + mouse.x * 0.10;
        var R = isMobile ? 15.5 : 13.5;
        camera.position.set(
            Math.cos(ang) * R,
            6.4 + mouse.y * -0.7,
            Math.sin(ang) * R
        );
        camera.lookAt(0, -0.5, 0);
    }

    // ---------- Resize ----------
    function resize() {
        var w = hero.clientWidth || window.innerWidth;
        var h = hero.clientHeight || window.innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', function () {
        resize();
        if (reduceMotion) renderStatic();
    }, { passive: true });

    // ---------- Render loop with visibility gating ----------
    var running = true;
    var inView = true;

    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
            inView = entries[0].isIntersecting;
        }, { threshold: 0.02 }).observe(canvas);
    }
    document.addEventListener('visibilitychange', function () {
        running = !document.hidden;
    });

    var clock = new THREE.Clock();

    function renderStatic() {
        buildSurface(0);
        geo.attributes.position.needsUpdate = true;
        placeCamera(0);
        stepDescent(0, 0.016);
        renderer.render(scene, camera);
    }

    if (reduceMotion) {
        // one calm, static frame — no animation
        renderStatic();
        return;
    }

    function tick() {
        requestAnimationFrame(tick);
        if (!running || !inView) { clock.getDelta(); return; }

        var dt = Math.min(clock.getDelta(), 0.05);
        var t = clock.elapsedTime * 0.5;   // slow breathing phase

        buildSurface(t);
        geo.attributes.position.needsUpdate = true;

        stepDescent(t, dt);
        placeCamera(clock.elapsedTime);

        renderer.render(scene, camera);
    }
    tick();
})();
