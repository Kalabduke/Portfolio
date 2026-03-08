// ============================================================
// CONFIGURATION — update these before deploying
// ============================================================

// Formspree: sign up at https://formspree.io → New form → copy the ID
// e.g. if your endpoint is https://formspree.io/f/xyzabcde, set 'xyzabcde'
const FORMSPREE_FORM_ID = 'mwvrprgw';
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/' + FORMSPREE_FORM_ID;
window.FORMSPREE_ENDPOINT = FORMSPREE_ENDPOINT;

// ============================================================
// SKILLS DATA — single source of truth (used to render dots)
// ============================================================
const SKILLS_DATA = [
    { name: 'HTML',           level: 8, total: 10 },
    { name: 'CSS',            level: 7, total: 10 },
    { name: 'JavaScript',     level: 7, total: 10 },
    { name: 'React',          level: 4, total: 10 },
    { name: 'Kotlin',         level: 5, total: 10 },
    { name: 'Jetpack Compose',level: 4, total: 10 },
    { name: 'Python',         level: 6, total: 10 },
    { name: 'Linux (Ubuntu)', level: 6, total: 10 },
];

// ============================================================
// RENDER SKILL PROFICIENCY DOTS
// ============================================================
function renderSkillDots() {
    const container = document.getElementById('skill-dots-container');
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    SKILLS_DATA.forEach(skill => {
        const item = document.createElement('div');
        item.className = 'skill-dot-item';
        
        const header = document.createElement('div');
        header.className = 'skill-dot-header';
        
        const name = document.createElement('span');
        name.textContent = skill.name;
        
        header.appendChild(name);
        
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'skill-dots-container';
        
        // Create dots
        for (let i = 0; i < skill.total; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (i < skill.level) {
                dot.classList.add('filled');
            }
            dotsContainer.appendChild(dot);
        }
        
        item.appendChild(header);
        item.appendChild(dotsContainer);
        container.appendChild(item);
    });
}

// ============================================================
// ANIMATED BACKGROUND (floating particles on canvas)
// ============================================================
function initBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function particleColor(alpha) {
        return `rgba(124, 58, 237, ${alpha * 0.6})`;
    }

    function createParticles() {
        particles = [];
        const count = Math.floor(window.innerWidth / 20);
        
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.1
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particleColor(particle.opacity);
            ctx.fill();
            
            // Move particles
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap around screen
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.y > canvas.height) particle.y = 0;
            if (particle.y < 0) particle.y = canvas.height;
        });
        
        animationId = requestAnimationFrame(drawParticles);
    }

    function init() {
        resize();
        createParticles();
        drawParticles();
    }

    // Handle theme changes
    window.addEventListener('themeChange', () => {
        // Recreate particles with new colors
        createParticles();
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        cancelAnimationFrame(animationId);
        resize();
        createParticles();
        drawParticles();
    });

    init();
}

// Initialize background when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initBackground();
    renderSkillDots();
});

// Mobile Navigation Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 11, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 10, 11, 0.9)';
        navbar.style.boxShadow = 'none';
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Form submission handling (sends to your email via Formspree)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
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
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        }

        fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, subject, message })
        })
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data.ok) {
                    showNotification('Message sent! I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    showNotification('Something went wrong. Try again or email me directly.', 'error');
                }
            })
            .catch(function() {
                showNotification('Could not send. Check your connection or email me directly.', 'error');
            })
            .finally(function() {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
            });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.project-card, .skill-category, .about-text');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Typing effect for hero title (optional - commented out to preserve HTML structure)
// Uncomment if you want typing animation
/*
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 50);
        }, 500);
    }
});
*/

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add hover effect to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Skill bars animation (if you want to add skill bars later)
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 200);
    });
}

// Performance optimization - Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll events
const debouncedScroll = debounce(() => {
    // Your scroll-related functions here
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Performance optimization - Throttle resize events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Throttle resize for canvas
window.addEventListener('resize', throttle(() => {
    // Handle resize efficiently
}, 100));

// Lazy loading for images (if needed)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
lazyLoadImages();

// Troubleshooting accordion functionality
function toggleTroubleItem(header) {
    const troubleItem = header.parentElement;
    const allTroubleItems = document.querySelectorAll('.trouble-item');
    
    // Close all other items
    allTroubleItems.forEach(item => {
        if (item !== troubleItem) {
            item.classList.remove('active');
        }
    });
    
    // Toggle current item
    troubleItem.classList.toggle('active');
}

// CV Download and Print functionality (PDF in cv folder)
const CV_PDF_PATH = 'cv/Kaleab-Abduke-cv.pdf';

document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('download-cv-btn');
    const printBtn = document.getElementById('print-cv-btn');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            fetch(CV_PDF_PATH, { method: 'HEAD' })
                .then(function(res) {
                    if (res.ok) {
                        const link = document.createElement('a');
                        link.href = CV_PDF_PATH;
                        link.download = 'Kaleab-Abduke-CV.pdf';
                        link.click();
                        showNotification('CV download started! Check your downloads folder.', 'success');
                    } else {
                        showNotification('CV file not found. Add your PDF to the cv folder.', 'error');
                    }
                })
                .catch(function() {
                    showNotification('CV file not found. Add your PDF to the cv folder.', 'error');
                });
        });
    }
    
    if (printBtn) {
        printBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const printWindow = window.open(CV_PDF_PATH, '_blank', 'noopener,noreferrer');
            if (printWindow) {
                printWindow.addEventListener('load', function() {
                    setTimeout(function() { printWindow.print(); }, 500);
                });
                showNotification('CV opened in new tab. Print dialog will open—or press Ctrl+P there to print the PDF.', 'info');
            } else {
                showNotification('Allow pop-ups for this site, then click Print again. Or download the CV and print it from your downloads.', 'error');
            }
        });
    }
    
    // Update copyright year
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Animate skill dots when in viewport
    const skillDotsContainers = document.querySelectorAll('.skill-dots-container');
    const dotsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                dotsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    skillDotsContainers.forEach(container => {
        dotsObserver.observe(container);
    });
    
    // Animate skill bars when CV section is visible
    const cvSection = document.getElementById('cv');
    if (cvSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkillBars();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(cvSection);
    }
    
    // Initialize troubleshooting items
    const troubleHeaders = document.querySelectorAll('.trouble-header');
    troubleHeaders.forEach(header => {
        header.addEventListener('click', () => toggleTroubleItem(header));
    });
});

// Enhanced print styles for CV
const printStyles = `
    @media print {
        body * {
            visibility: hidden;
        }
        #cv, #cv * {
            visibility: visible;
        }
        #cv {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
        }
        .cv-actions, .navbar, .footer, .troubleshooting, .contact, .projects, .skills, .about, .hero {
            display: none !important;
        }
        .cv-grid {
            grid-template-columns: 2fr 1fr !important;
            gap: 2rem !important;
        }
        .cv-main, .cv-sidebar {
            box-shadow: none !important;
            border: 1px solid #ccc !important;
        }
    }
`;

// Add print styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = printStyles;
document.head.appendChild(styleSheet);

// Search functionality for troubleshooting
function addTroubleshootingSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search troubleshooting issues...';
    searchInput.className = 'trouble-search';
    
    const troubleshootingSection = document.querySelector('.troubleshooting-content');
    if (troubleshootingSection) {
        troubleshootingSection.insertBefore(searchInput, troubleshootingSection.firstChild);
        
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const troubleItems = document.querySelectorAll('.trouble-item');
            
            troubleItems.forEach(item => {
                const title = item.querySelector('h4').textContent.toLowerCase();
                const content = item.querySelector('.trouble-content').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || content.includes(searchTerm)) {
                    item.style.display = 'block';
                    // Auto-expand matching items
                    if (searchTerm.length > 2) {
                        item.classList.add('active');
                    }
                } else {
                    item.style.display = 'none';
                    item.classList.remove('active');
                }
            });
        });
    }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', addTroubleshootingSearch);

// Add search styles
const searchStyles = `
    .trouble-search {
        width: 100%;
        padding: 1rem;
        margin-bottom: 2rem;
        border: 2px solid var(--border-color);
        border-radius: var(--radius-md);
        font-size: var(--font-size-lg);
        transition: border-color 0.3s ease;
    }
    
    .trouble-search:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
    }
`;

const searchStyleSheet = document.createElement('style');
searchStyleSheet.textContent = searchStyles;
document.head.appendChild(searchStyleSheet);

// Copy code functionality
document.addEventListener('click', function(e) {
    if (e.target.closest('.trouble-code')) {
        const codeBlock = e.target.closest('.trouble-code');
        const code = codeBlock.querySelector('code').textContent;
        
        navigator.clipboard.writeText(code).then(() => {
            showNotification('Code copied to clipboard!', 'success');
        }).catch(() => {
            showNotification('Failed to copy code', 'error');
        });
    }
});

// Add copy button styling
const copyStyles = `
    .trouble-code {
        position: relative;
        cursor: pointer;
    }
    
    .trouble-code:hover::after {
        content: 'Click to copy';
        position: absolute;
        top: 5px;
        right: 10px;
        background: var(--primary-color);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
    }
`;

const copyStyleSheet = document.createElement('style');
copyStyleSheet.textContent = copyStyles;
document.head.appendChild(copyStyleSheet);

console.log('Portfolio script loaded successfully!');

// Theme-aware canvas animation
document.addEventListener('DOMContentLoaded', () => {
    const html = document.documentElement;
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                initBackground();
            }
        });
    });
    
    observer.observe(html, { attributes: true });
});
