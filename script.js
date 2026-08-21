// ============================================================
// CONFIGURATION: update these before deploying
// ============================================================

// Formspree: sign up at https://formspree.io → New form → copy the ID
// e.g. if your endpoint is https://formspree.io/f/xyzabcde, set 'xyzabcde'
const FORMSPREE_FORM_ID = 'mwvrprgw';
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/' + FORMSPREE_FORM_ID;
window.FORMSPREE_ENDPOINT = FORMSPREE_ENDPOINT;

// ============================================================
// SKILLS DATA: single source of truth
// ============================================================
const SKILLS_DATA = [
    { name: 'Odoo ERP',    level: 5, total: 10 },
    { name: 'Python',      level: 6, total: 10 },
    { name: 'JavaScript',  level: 7, total: 10 },
    { name: 'Next.js',     level: 6, total: 10 },
    { name: 'HTML / CSS',  level: 8, total: 10 },
    { name: 'PostgreSQL',  level: 6, total: 10 },
    { name: 'Linux (Ubuntu)', level: 7, total: 10 },
    { name: 'Android / Kotlin', level: 5, total: 10 },
];

// Soft skills: shown as chips under the technical bars
const SOFT_SKILLS = [
    'Communication',
    'Problem Solving',
    'Teamwork',
    'Adaptability',
    'Time Management',
    'Attention to Detail',
    'Leadership',
];

// ============================================================
// RENDER SKILLS: editorial rows
// ============================================================
function renderSkillDots() {
    const container = document.getElementById('skill-dots-container');
    if (!container) return;
    container.innerHTML = '';

    const scale = document.createElement('p');
    scale.className = 'skills-scale';
    scale.innerHTML = '<span>Proficiency scale</span><span aria-hidden="true">·</span><span>Filled dots show experience</span>';
    container.appendChild(scale);

    SKILLS_DATA.forEach(skill => {
        const row = document.createElement('div');
        row.className = 'skill-row reveal';

        const name = document.createElement('span');
        name.className = 'skill-name';
        name.textContent = skill.name;

        const dots = document.createElement('div');
        dots.className = 'skill-dots';
        dots.setAttribute('role', 'img');
        dots.setAttribute('aria-label', `${skill.name}: proficiency shown on a ten-dot scale`);
        for (let i = 0; i < skill.total; i++) {
            const dot = document.createElement('i');
            dot.style.setProperty('--i', i);
            if (i < skill.level) dot.dataset.fill = '1'; // lit up with stagger by initSkillStagger
            dots.appendChild(dot);
        }

        row.appendChild(name);
        row.appendChild(dots);
        container.appendChild(row);
    });

    // Soft skills block below the bars
    const softWrap = document.createElement('div');
    softWrap.className = 'soft-skills';

    const softLabel = document.createElement('div');
    softLabel.className = 'soft-skills-label';
    softLabel.textContent = 'Soft Skills';
    softWrap.appendChild(softLabel);

    const softList = document.createElement('div');
    softList.className = 'soft-skills-list';
    SOFT_SKILLS.forEach(skill => {
        const chip = document.createElement('span');
        chip.className = 'soft-chip';
        chip.textContent = skill;
        softList.appendChild(chip);
    });
    softWrap.appendChild(softList);
    container.appendChild(softWrap);
}

// ============================================================
// REVEAL ON SCROLL
// ============================================================
function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
        els.forEach(el => el.classList.add('in'));
        return;
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => observer.observe(el));
}

// ============================================================
// MOBILE NAVIGATION — slide-in sidebar + backdrop overlay
// ============================================================
function initMobileMenu() {
    const toggle = document.getElementById('mobile-menu');
    const menu = document.querySelector('.nav-menu');
    const overlay = document.getElementById('nav-overlay');
    if (!toggle || !menu) return;

    const setOpen = (open) => {
        menu.classList.toggle('active', open);
        toggle.classList.toggle('active', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (overlay) overlay.classList.toggle('active', open);
        document.body.style.overflow = open ? 'hidden' : '';
    };

    toggle.addEventListener('click', () => {
        setOpen(!menu.classList.contains('active'));
    });

    // Close when a link is clicked
    menu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => setOpen(false));
    });

    // Close on backdrop click
    if (overlay) {
        overlay.addEventListener('click', () => setOpen(false));
    }

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setOpen(false);
    });
}

// ============================================================
// NAVBAR SCROLL STATE
// ============================================================
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
        navbar.style.borderBottomColor =
            window.scrollY > 8 ? 'var(--line)' : 'var(--line-soft)';
    }, { passive: true });
}

// ============================================================
// NOTIFICATION TOAST
// ============================================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === 'success' ? '#1E1B16' : type === 'error' ? '#2A1410' : '#171510'};
        color: #F2EFE9;
        border: 1px solid ${type === 'success' ? 'rgba(154,219,255,0.4)' : 'rgba(255,120,90,0.4)'};
        border-radius: 0;
        padding: 14px 20px;
        z-index: 10000;
        font-size: 13px;
        letter-spacing: 0.02em;
        box-shadow: 0 10px 30px rgba(0,0,0,0.45);
        max-width: 300px;
        opacity: 0;
        transform: translateY(-8px);
        transition: opacity 0.3s ease, transform 0.3s ease;
    `;
    document.body.appendChild(notification);
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    });
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-8px)';
        setTimeout(() => notification.remove(), 350);
    }, 4500);
}

// ============================================================
// CONTACT FORM (index.html)
// ============================================================
function initContactForm() {
    const form = document.querySelector('.contact-form#contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        const submitBtn = this.querySelector('button[type="submit"]');
        const original = submitBtn ? submitBtn.textContent : '';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
        }

        fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, subject, message })
        })
            .then(r => r.json())
            .then(data => {
                if (data.ok) {
                    showNotification('Message sent! I\'ll get back to you soon.', 'success');
                    form.reset();
                } else {
                    showNotification('Something went wrong. Try again or email me directly.', 'error');
                }
            })
            .catch(() => {
                showNotification('Could not send. Check your connection or email me directly.', 'error');
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = original;
                }
            });
    });
}

// ============================================================
// CV DOWNLOAD / PRINT
// ============================================================
const CV_PDF_PATH = 'cv/Kaleab-Abduke-cv.pdf';

function initCvButtons() {
    const downloadBtn = document.getElementById('download-cv-btn');
    const printBtn = document.getElementById('print-cv-btn');

    if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            fetch(CV_PDF_PATH, { method: 'HEAD' })
                .then(res => {
                    if (res.ok) {
                        const link = document.createElement('a');
                        link.href = CV_PDF_PATH;
                        link.download = 'Kaleab-Abduke-CV.pdf';
                        link.click();
                        showNotification('CV download started!', 'success');
                    } else {
                        showNotification('CV file not found. Add your PDF to the cv folder.', 'error');
                    }
                })
                .catch(() => showNotification('CV file not found. Add your PDF to the cv folder.', 'error'));
        });
    }

    if (printBtn) {
        printBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const win = window.open(CV_PDF_PATH, '_blank', 'noopener,noreferrer');
            if (win) {
                showNotification('CV opened in a new tab. Press Ctrl/Cmd+P to print.', 'info');
            } else {
                showNotification('Allow pop-ups for this site, then try again.', 'error');
            }
        });
    }
}

// ============================================================
// MODERN INTERACTIONS — scroll progress, scrollspy, copy email,
// custom cursor, parallax, count-up, 3D tilt, view transitions
// ============================================================

const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Skill dots: stagger-fill when the row scrolls into view
function initSkillStagger() {
    const rows = [...document.querySelectorAll('.skill-row')];
    if (!rows.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const dots = entry.target.querySelectorAll('.skill-dots i');
            dots.forEach((dot, i) => {
                if (dot.dataset.fill === '1') {
                    setTimeout(() => dot.classList.add('on'), i * 40);
                }
            });
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.4 });
    rows.forEach(r => observer.observe(r));
}

// Hairline scroll progress bar
function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    const update = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        bar.style.transform = `scaleX(${p})`;
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
}

// Scrollspy — highlight the active nav link while scrolling
function initScrollspy() {
    const links = [...document.querySelectorAll('.nav-link[href^="#"]')];
    if (!links.length) return;
    const sections = links
        .map(l => document.querySelector(l.getAttribute('href')))
        .filter(Boolean);
    if (!sections.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const id = '#' + entry.target.id;
            links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => observer.observe(s));
}

// Copy email to clipboard
function initCopyEmail() {
    const btn = document.getElementById('copy-email-btn');
    if (!btn) return;
    btn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText('kalabduke@gmail.com');
            showNotification('Email copied to clipboard', 'success');
        } catch (err) {
            showNotification('Could not copy. Email me directly instead.', 'error');
        }
    });
}

// Custom cursor — dot + ring, only on desktop hover-capable pointers
function initCustomCursor() {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!canHover || prefersReducedMotion()) return;

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.documentElement.classList.add('has-cursor');

    let mx = -100, my = -100, rx = -100, ry = -100, raf = null;
    const interactive = 'a, button, .project-row, .skill-row, .soft-chip, .proj-links a, .contact-method, .copy-email-btn, .watch-btn, .btn-sharp';

    const loop = () => {
        rx += (mx - rx) * 0.16;
        ry += (my - ry) * 0.16;
        dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
        raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });

    document.addEventListener('mouseover', (e) => {
        ring.classList.toggle('is-hover', !!e.target.closest(interactive));
    });
}

// Hero parallax — title lines + background drift on scroll
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero || prefersReducedMotion()) return;
    const lines = hero.querySelectorAll('.hero-title .line');
    const bg = hero.querySelector('.hero-bg');
    if (!lines.length && !bg) return;
    let ticking = false;

    const update = () => {
        const rect = hero.getBoundingClientRect();
        const progress = Math.min(Math.max(-rect.top, 0), rect.height);
        lines.forEach((line, i) => {
            line.style.transform = `translateY(${progress * (0.08 + i * 0.06)}px)`;
        });
        if (bg) {
            bg.style.transform = `translateY(${progress * 0.12}px) scale(1.02)`;
        }
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    }, { passive: true });
    update();
}

// Count-up stats
function initCountUp() {
    const nums = [...document.querySelectorAll('[data-count]')];
    if (!nums.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.count, 10);
            observer.unobserve(el);
            if (prefersReducedMotion()) {
                el.textContent = target;
                return;
            }
            const duration = 1200;
            const start = performance.now();
            const step = (now) => {
                const t = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - t, 3);
                el.textContent = Math.round(target * eased);
                if (t < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        });
    }, { threshold: 0.4 });
    nums.forEach(n => observer.observe(n));
}

// Subtle 3D tilt on [data-tilt] targets
function initTilt() {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!canHover || prefersReducedMotion()) return;
    document.querySelectorAll('[data-tilt]').forEach(el => {
        const max = 3;
        el.addEventListener('mousemove', (e) => {
            const r = el.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
        });
    });
}

// View Transitions API — cross-page fade between internal pages
function initViewTransitions() {
    if (!document.startViewTransition || prefersReducedMotion()) return;
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        if (!link) return;
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') return;
        const url = new URL(href, location.href);
        if (url.origin !== location.origin) return;
        e.preventDefault();
        document.startViewTransition(() => { location.href = url.href; });
    });
}

// ============================================================
// THEME LAMP — light / dark mode toggle
// Tap, click or pull the lamp to switch themes
// ============================================================
function initThemeToggle() {
    const lamp = document.getElementById('theme-toggle');
    if (!lamp) return;

    let isOn = document.documentElement.classList.contains('light-mode');
    let isDragging = false;
    let startY = 0;

    const sync = () => {
        lamp.classList.toggle('on', isOn);
        lamp.setAttribute('aria-pressed', String(isOn));
    };

    const toggleLight = () => {
        isOn = !isOn;
        document.documentElement.classList.toggle('light-mode', isOn);
        try {
            localStorage.setItem('theme', isOn ? 'light' : 'dark');
        } catch (e) {}
        // Keep the browser chrome theme in sync with the lamp
        document.querySelectorAll('meta[name="theme-color"]').forEach(m => {
            m.setAttribute('content', isOn ? '#F5F2EC' : '#0E0D0B');
        });
        sync();
    };

    const pullThenToggle = () => {
        lamp.classList.add('pulling');
        setTimeout(() => {
            lamp.classList.remove('pulling');
            toggleLight();
        }, 300);
    };

    // Click / tap
    lamp.addEventListener('click', (e) => {
        if (!isDragging) pullThenToggle();
    });

    // Keyboard (role="button")
    lamp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            pullThenToggle();
        }
    });

    // Mouse drag (pull down)
    lamp.addEventListener('mousedown', (e) => {
        isDragging = false;
        startY = e.clientY;
    });

    lamp.addEventListener('mousemove', (e) => {
        if (e.buttons === 1 && Math.abs(e.clientY - startY) > 8) {
            isDragging = true;
            lamp.classList.add('pulling');
        }
    });

    lamp.addEventListener('mouseup', (e) => {
        if (isDragging) {
            lamp.classList.remove('pulling');
            toggleLight();
            setTimeout(() => { isDragging = false; }, 100);
        }
    });

    // Touch drag
    lamp.addEventListener('touchstart', (e) => {
        isDragging = false;
        startY = e.touches[0].clientY;
    }, { passive: true });

    lamp.addEventListener('touchmove', (e) => {
        if (Math.abs(e.touches[0].clientY - startY) > 8) {
            isDragging = true;
            lamp.classList.add('pulling');
        }
    }, { passive: true });

    lamp.addEventListener('touchend', () => {
        if (isDragging) {
            lamp.classList.remove('pulling');
            toggleLight();
            setTimeout(() => { isDragging = false; }, 100);
        }
    });

    sync();
}

// ============================================================
// BOOT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    renderSkillDots();
    initReveal();
    initMobileMenu();
    initNavbar();
    initThemeToggle();
    initContactForm();
    initCvButtons();
    initScrollProgress();
    initSkillStagger();
    initScrollspy();
    initCopyEmail();
    initCustomCursor();
    initParallax();
    initCountUp();
    initTilt();
    initViewTransitions();

    const year = document.getElementById('current-year');
    if (year) year.textContent = new Date().getFullYear();
});
