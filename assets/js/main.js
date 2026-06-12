// =============================================
//  main.js — Portfolio interactions
//  Includes: nav, scroll, chatbot sheet + 
//  History API (mobile back button fix)
// =============================================

// ── Mobile Nav ───────────────────────────────
const hamburger = document.querySelector('.hamburger');
const navMenu   = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ── Smooth scroll ────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ── Scroll shadow on navbar ──────────────────
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.style.boxShadow = window.scrollY > 50
            ? '0 4px 6px -1px rgba(0,0,0,0.18)'
            : 'none';
    }
}, { passive: true });

// ── Dock the scroll-progress bar inside the navbar ────────
// (so it travels with the nav and never floats as a stray
//  blue line over dark sections when the nav is hidden)
window.addEventListener('load', () => {
    const bar = document.querySelector('.scroll-progress');
    const navbar = document.querySelector('.navbar');
    if (bar && navbar) navbar.appendChild(bar);
});

// ── Card entrance animations ─────────────────
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity  = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.__disabled-handled-by-scrolljs').forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});


// =============================================
//  CHATBOT SHEET
//  — smooth slide-up on desktop
//  — full-screen slide-up on mobile
//  — History API so mobile back button closes
//    the sheet instead of leaving the page
// =============================================

const fab   = document.getElementById('chatbot-fab');
const sheet = document.getElementById('chatbot-sheet');
const btnBack  = document.getElementById('sheet-back');
const btnClose = document.getElementById('sheet-close');

// Track whether WE pushed a history entry so we 
// don't accidentally pop one we didn't push.
let sheetHistoryPushed = false;

function openSheet() {
    if (!sheet) return;
    sheet.setAttribute('data-open', 'true');
    fab.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // prevent scroll-behind on mobile

    // Push a history entry so the browser back button 
    // fires popstate instead of navigating away.
    if (!sheetHistoryPushed) {
        history.pushState({ chatbot: true }, '', location.href);
        sheetHistoryPushed = true;
    }
}

function closeSheet() {
    if (!sheet) return;
    sheet.setAttribute('data-open', 'false');
    sheet.removeAttribute('data-open');
    fab.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';

    // If we're closing via a button (not a back press),
    // go back to clean the history entry we pushed,
    // but only if we actually pushed one.
    if (sheetHistoryPushed) {
        sheetHistoryPushed = false;
        // history.back() would fire popstate → we guard 
        // against double-close with the flag above.
        history.back();
    }
}

// ── FAB click ────────────────────────────────
if (fab) {
    fab.addEventListener('click', () => {
        const isOpen = sheet.hasAttribute('data-open');
        if (isOpen) closeSheet();
        else        openSheet();
    });
}

// ── Close buttons ────────────────────────────
if (btnBack)  btnBack.addEventListener('click',  closeSheet);
if (btnClose) btnClose.addEventListener('click', closeSheet);

// ── Click outside (desktop) ──────────────────
document.addEventListener('click', (e) => {
    if (!sheet || !sheet.hasAttribute('data-open')) return;
    const inside = sheet.contains(e.target) || fab.contains(e.target);
    if (!inside) closeSheet();
});

// ── Escape key ───────────────────────────────
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sheet && sheet.hasAttribute('data-open')) {
        closeSheet();
    }
});

// ── THE KEY FIX: intercept mobile back button ─
// When the user presses the OS back button on mobile,
// the browser fires 'popstate'. If our sheet is open,
// we close it and mark that we consumed the pop.
window.addEventListener('popstate', (e) => {
    if (sheet && sheet.hasAttribute('data-open')) {
        // Close the sheet — do NOT call history.back() again
        sheet.setAttribute('data-open', 'false');
        sheet.removeAttribute('data-open');
        fab.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        sheetHistoryPushed = false;
        // The popstate already moved history back — we're done.
    }
});

// =============================================
//  CHATBOT APPEARANCE
//  — FAB entrance pop-in after page load
//  — greeting nudge (once per session)
//  — "waking up" loader over the Streamlit iframe
// =============================================

// ── FAB entrance ───────────────────────────
if (fab) {
    fab.classList.add('fab-pre');                 // hide pre-entrance
    window.addEventListener('load', () => {
        setTimeout(() => {
            fab.classList.remove('fab-pre');
            fab.classList.add('fab-in');
        }, 800);
    });
}

// ── Greeting nudge ───────────────────────────
const nudge = document.getElementById('chat-nudge');
const nudgeClose = document.getElementById('chat-nudge-close');

function hideNudge() {
    if (!nudge || nudge.hidden) return;
    nudge.classList.remove('nudge-in');
    setTimeout(() => { nudge.hidden = true; }, 320);
}

function retireNudge() {
    try { sessionStorage.setItem('chatNudgeDone', '1'); } catch (e) {}
    hideNudge();
}

if (nudge) {
    let nudgeSeen = false;
    try { nudgeSeen = sessionStorage.getItem('chatNudgeDone') === '1'; } catch (e) {}

    if (!nudgeSeen) {
        setTimeout(() => {
            if (sheet && sheet.hasAttribute('data-open')) return;   // already chatting
            nudge.hidden = false;
            requestAnimationFrame(() => nudge.classList.add('nudge-in'));
        }, 7000);

        setTimeout(hideNudge, 20000);   // quietly retire if ignored
    }

    // tapping the bubble opens the chat; × just dismisses
    nudge.addEventListener('click', () => {
        retireNudge();
        openSheet();
    });
    if (nudgeClose) {
        nudgeClose.addEventListener('click', (e) => {
            e.stopPropagation();
            retireNudge();
        });
    }
}

// opening the chat by any path retires the nudge
if (fab) fab.addEventListener('click', retireNudge);

// ── "Waking up my clone…" loader ─────────────────
const sheetLoading = document.getElementById('sheet-loading');
const chatIframe = document.getElementById('chatbot-iframe');

if (sheetLoading && chatIframe) {
    chatIframe.addEventListener('load', () => {
        // small grace period so the dots don't blink out instantly
        setTimeout(() => sheetLoading.classList.add('done'), 500);
    }, { once: true });

    // safety: never strand the loader (e.g. embed blocks the event)
    setTimeout(() => sheetLoading.classList.add('done'), 25000);
}
