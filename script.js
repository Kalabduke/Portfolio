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
    { name: 'Odoo ERP',    level: 7, total: 10 },
    { name: 'Python',      level: 6, total: 10 },
    { name: 'JavaScript',  level: 7, total: 10 },
    { name: 'Next.js',     level: 6, total: 10 },
    { name: 'HTML / CSS',  level: 8, total: 10 },
    { name: 'PostgreSQL',  level: 6, total: 10 },
    { name: 'Linux (Ubuntu)', level: 6, total: 10 },
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

    SKILLS_DATA.forEach(skill => {
        const row = document.createElement('div');
        row.className = 'skill-row';

        const name = document.createElement('span');
        name.className = 'skill-name';
        name.textContent = skill.name;

        const dots = document.createElement('div');
        dots.className = 'skill-dots';
        for (let i = 0; i < skill.total; i++) {
            const dot = document.createElement('i');
            if (i < skill.level) dot.classList.add('on');
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
// MOBILE NAVIGATION
// ============================================================
function initMobileMenu() {
    const toggle = document.getElementById('mobile-menu');
    const menu = document.querySelector('.nav-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        const open = menu.classList.toggle('active');
        toggle.classList.toggle('active', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close when a link is clicked
    menu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !toggle.contains(e.target)) {
            menu.classList.remove('active');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        }
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
// THEME TOGGLE — light / dark mode
// ============================================================
function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const sync = () => {
        const isLight = document.documentElement.classList.contains('light-mode');
        toggle.setAttribute('aria-pressed', String(isLight));
    };

    toggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-mode');
        const isLight = document.documentElement.classList.contains('light-mode');
        try {
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        } catch (e) {}
        sync();
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

    const year = document.getElementById('current-year');
    if (year) year.textContent = new Date().getFullYear();
});
