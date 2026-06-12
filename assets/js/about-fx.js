/* ============================================================
   about-fx.js — About lead statement, scroll-scrubbed typewriter
   The big editorial line types itself out character-by-character
   as the reader scrolls DOWN, and un-types when scrolling back UP
   (GSAP ScrollTrigger scrub). A blinking Apple-blue caret rides
   the typing boundary. Accent words (data-accent) type in blue.

   Layout never shifts: every character exists in the DOM from the
   start (color: transparent until "typed"), so line wrapping is
   stable and only colors change per frame.

   Honors prefers-reduced-motion; without GSAP the text simply
   renders fully visible (no splitting happens at all).
   ============================================================ */
(function () {
    'use strict';

    var lead = document.querySelector('.about-lead');
    if (!lead) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
    if (reduceMotion || !hasGSAP) return;   // CSS default = fully readable text

    gsap.registerPlugin(ScrollTrigger);

    // ---- split into word spans -> char spans ----
    var accents = (lead.dataset.accent || '')
        .split(',')
        .map(function (s) { return s.trim().toLowerCase(); })
        .filter(Boolean);

    var words = lead.textContent.trim().split(/\s+/);
    var html = words.map(function (w) {
        var clean = w.replace(/[^\w-]/g, '').toLowerCase();
        var isAccent = accents.indexOf(clean) !== -1;
        var chars = Array.prototype.map.call(w, function (ch) {
            return '<span class="about-char">' + ch + '</span>';
        }).join('');
        return '<span class="about-word' + (isAccent ? ' about-word--accent' : '') + '">' + chars + '</span>';
    }).join(' ');

    lead.innerHTML = html;
    lead.classList.add('is-split');
    lead.setAttribute('aria-label', words.join(' '));   // screen readers get the plain sentence

    var chars = Array.prototype.slice.call(lead.querySelectorAll('.about-char'));
    var total = chars.length;
    var prev = 0;
    var caretEl = null;

    function setTyped(n) {
        n = Math.max(0, Math.min(total, n));
        if (n === prev && caretEl) return;

        // only touch the range that changed
        var lo = Math.min(prev, n);
        var hi = Math.max(prev, n);
        for (var i = lo; i < hi; i++) {
            chars[i].classList.toggle('typed', i < n);
        }

        // caret rides the last typed character; hidden at 0 and when done
        if (caretEl) caretEl.classList.remove('caret');
        caretEl = (n > 0 && n < total) ? chars[n - 1] : null;
        if (caretEl) caretEl.classList.add('caret');

        prev = n;
    }

    // ---- typing plays on EVERY arrival, from either direction ----
    // (scrolling down into it or back up into it both retype the line)
    var state = { p: 0 };

    var typingTween = gsap.to(state, {
        p: 1,
        paused: true,
        duration: Math.min(4, total * 0.026),   // ~steady keystroke pace
        ease: 'none',
        onUpdate: function () {
            setTyped(Math.round(state.p * total));
        },
        onComplete: function () {
            setTyped(total);   // caret retires, line reads clean
        }
    });

    ScrollTrigger.create({
        trigger: lead,
        start: 'top 78%',
        end: 'bottom 20%',
        onEnter: function () { typingTween.restart(); },
        onEnterBack: function () { typingTween.restart(); },
        onLeaveBack: function () {
            // fully scrolled back above — reset so the next arrival retypes
            typingTween.pause(0);
            setTyped(0);
        }
    });
})();
