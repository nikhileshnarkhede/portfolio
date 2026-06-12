/* ============================================================
   contact-fx.js — Get in Touch interaction layer
   • Magnetic hover on contact pills + newsletter button
     (same recipe as the hero CTAs, gentler strength)
   • Click-to-copy on the email pill: clicking copies the address
     and the pill confirms with "Copied ✓" — right-click / long-
     press still offers the normal mailto behavior via the href
   (The drifting aurora behind the section is pure CSS.)

   Fine-pointer gating for magnetism; copy works everywhere.
   Honors prefers-reduced-motion; degrades silently without GSAP.
   ============================================================ */
(function () {
    'use strict';

    var section = document.getElementById('contact');
    if (!section) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var hasGSAP = typeof gsap !== 'undefined';

    // ---------------------------------------------------------
    //  Retire the scroll-progress bar at the closer
    //  (by here it's ~full and reads as a stray blue line,
    //   especially when the navbar auto-hides)
    // ---------------------------------------------------------
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
            var bar = document.querySelector('.scroll-progress');
            if (!bar) return;
            bar.classList.toggle('is-retired', entries[0].isIntersecting);
        }, { threshold: 0.05 }).observe(section);
    }

    // ---------------------------------------------------------
    //  Magnetic pills (desktop only)
    // ---------------------------------------------------------
    if (hasGSAP && finePointer && !reduceMotion) {
        var magnets = section.querySelectorAll('.contact-link, .libutton');
        magnets.forEach(function (el) {
            var strength = 0.22;
            el.addEventListener('mousemove', function (e) {
                var r = el.getBoundingClientRect();
                el.classList.add('fx-live');
                gsap.to(el, {
                    x: (e.clientX - (r.left + r.width / 2)) * strength,
                    y: (e.clientY - (r.top + r.height / 2)) * strength,
                    duration: 0.4,
                    ease: 'power3.out'
                });
            });
            el.addEventListener('mouseleave', function () {
                gsap.to(el, {
                    x: 0, y: 0,
                    duration: 0.7,
                    ease: 'elastic.out(1, 0.5)',
                    onComplete: function () {
                        gsap.set(el, { clearProps: 'transform' });
                        el.classList.remove('fx-live');
                    }
                });
            });
        });
    }

    // ---------------------------------------------------------
    //  Click-to-copy email
    // ---------------------------------------------------------
    var emailLink = section.querySelector('.contact-link[href^="mailto:"]');
    if (!emailLink) return;

    var address = emailLink.getAttribute('href').replace('mailto:', '');

    // wrap the visible address text so it can be swapped during feedback
    var textNode = null;
    emailLink.childNodes.forEach(function (n) {
        if (n.nodeType === 3 && n.textContent.trim()) textNode = n;
    });
    if (!textNode) return;

    var labelSpan = document.createElement('span');
    labelSpan.className = 'contact-email-label';
    labelSpan.textContent = textNode.textContent.trim();
    emailLink.replaceChild(labelSpan, textNode);
    emailLink.setAttribute('title', 'Click to copy \u00b7 right-click for mail app');
    emailLink.setAttribute('aria-label', 'Copy email address ' + address);

    var busy = false;

    function showCopied(ok) {
        if (busy) return;
        busy = true;
        var original = labelSpan.textContent;
        labelSpan.textContent = ok ? 'Copied \u2713' : address;
        emailLink.classList.toggle('copied', ok);
        setTimeout(function () {
            labelSpan.textContent = original;
            emailLink.classList.remove('copied');
            busy = false;
        }, 1600);
    }

    emailLink.addEventListener('click', function (e) {
        e.preventDefault();   // copy instead of launching a mail app
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(address).then(
                function () { showCopied(true); },
                function () { fallbackCopy(); }
            );
        } else {
            fallbackCopy();
        }
    });

    function fallbackCopy() {
        var ta = document.createElement('textarea');
        ta.value = address;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
        document.body.removeChild(ta);
        showCopied(ok);
    }
})();
