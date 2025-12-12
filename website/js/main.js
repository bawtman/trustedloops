/**
 * Trusted Loops - Main JavaScript
 * A Manifesto for Ethical, Relational AI
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initThemeToggle();
    initNavigation();
    initSmoothScroll();
    initPageModal();
    initScrollAnimations();
    initShareMenu();
    initProgressBar();
    initSubstackFeed();
    initFeedbackForm();
});

/**
 * Dark mode toggle functionality
 */
function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Check for saved preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        html.setAttribute('data-theme', 'dark');
    }
    
    if (toggle) {
        toggle.addEventListener('click', function() {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            if (newTheme === 'dark') {
                html.setAttribute('data-theme', 'dark');
            } else {
                html.removeAttribute('data-theme');
            }
            
            localStorage.setItem('theme', newTheme);
        });
    }
    
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                html.setAttribute('data-theme', 'dark');
            } else {
                html.removeAttribute('data-theme');
            }
        }
    });
}

/**
 * Navigation functionality
 */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link (but not the language selector)
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Prevent language selector from closing the menu
    const langSelect = document.getElementById('language-select');
    const langSelector = document.querySelector('.lang-selector');
    
    if (langSelector) {
        // Stop all events from bubbling up from the language selector
        ['click', 'touchstart', 'touchend', 'mousedown'].forEach(eventType => {
            langSelector.addEventListener(eventType, function(e) {
                e.stopPropagation();
            });
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
    
    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add shadow on scroll
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Page modal for viewing manifesto pages
 */
function initPageModal() {
    const modal = document.getElementById('page-modal');
    const modalImage = document.getElementById('modal-image');
    const modalPageNumber = document.getElementById('modal-page-number');
    const closeBtn = document.querySelector('.modal-close');
    const prevBtn = document.querySelector('.modal-prev');
    const nextBtn = document.querySelector('.modal-next');
    const pageCards = document.querySelectorAll('.page-card');
    
    let currentPage = 1;
    const totalPages = pageCards.length;
    
    // Open modal when clicking a page card
    pageCards.forEach(card => {
        card.addEventListener('click', function() {
            currentPage = parseInt(this.dataset.page);
            openModal(currentPage);
        });
    });
    
    // Close modal
    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Navigation
    prevBtn.addEventListener('click', function() {
        currentPage = currentPage > 1 ? currentPage - 1 : totalPages;
        updateModal(currentPage);
    });
    
    nextBtn.addEventListener('click', function() {
        currentPage = currentPage < totalPages ? currentPage + 1 : 1;
        updateModal(currentPage);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!modal.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                currentPage = currentPage > 1 ? currentPage - 1 : totalPages;
                updateModal(currentPage);
                break;
            case 'ArrowRight':
                currentPage = currentPage < totalPages ? currentPage + 1 : 1;
                updateModal(currentPage);
                break;
        }
    });
    
    function openModal(page) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateModal(page);
    }
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function updateModal(page) {
        modalImage.src = `assets/images/page_${page}.png`;
        modalImage.alt = `Page ${page}`;
        modalPageNumber.textContent = `Page ${page} of ${totalPages}`;
    }
}

/**
 * Scroll-triggered animations
 */
function initScrollAnimations() {
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll(
        '.pillar, .use-case-item, .missing-item, .creator-item, .page-card, .about-grid > div'
    );
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Add initial hidden state and observe
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
    
    // Add CSS for animated state
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Share menu toggle functionality
 */
function initShareMenu() {
    const shareWrapper = document.querySelector('.share-wrapper');
    const shareToggle = document.querySelector('.share-toggle');
    const copyBtn = document.querySelector('.share-copy');
    
    if (!shareToggle || !shareWrapper) return;
    
    // Toggle menu on button click
    shareToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        shareWrapper.classList.toggle('active');
    });
    
    // Close when clicking outside
    document.addEventListener('click', function(e) {
        if (!shareWrapper.contains(e.target)) {
            shareWrapper.classList.remove('active');
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            shareWrapper.classList.remove('active');
        }
    });
    
    // Copy link functionality
    if (copyBtn) {
        copyBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const url = 'https://trustedloops.com';
            
            // Try modern clipboard API first, fallback to execCommand
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url).then(() => {
                    showCopiedFeedback();
                }).catch(() => {
                    fallbackCopy(url);
                });
            } else {
                fallbackCopy(url);
            }
            
            function fallbackCopy(text) {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                    showCopiedFeedback();
                } catch (err) {
                    console.error('Copy failed:', err);
                }
                document.body.removeChild(textarea);
            }
            
            function showCopiedFeedback() {
                copyBtn.classList.add('copied');
                copyBtn.querySelector('span').textContent = 'Copied!';
                
                // Close menu after short delay to show feedback
                setTimeout(() => {
                    shareWrapper.classList.remove('active');
                    // Reset button text after menu closes
                    setTimeout(() => {
                        copyBtn.classList.remove('copied');
                        copyBtn.querySelector('span').textContent = 'Copy link';
                    }, 300);
                }, 600);
            }
        });
    }
}

/**
 * Reading progress bar
 */
function initProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    if (!progressBar) return;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

/**
 * Substack Feed
 */
function initSubstackFeed() {
    const feedContainer = document.getElementById('substack-feed');
    if (!feedContainer) return;
    
    const FEED_URL = 'https://trustedloops-feed.bawtman.workers.dev';
    
    fetch(FEED_URL)
        .then(response => {
            if (!response.ok) throw new Error('Feed unavailable');
            return response.json();
        })
        .then(data => {
            if (!data.posts || data.posts.length === 0) {
                feedContainer.innerHTML = '<div class="feed-error"><p>No posts found. Check back soon!</p></div>';
                return;
            }
            
            feedContainer.innerHTML = data.posts.map(post => `
                <article class="substack-post">
                    <div class="post-content">
                        <time class="post-date">${post.date}</time>
                        <h3 class="post-title">
                            <a href="${post.link}" target="_blank" rel="noopener">${post.title}</a>
                        </h3>
                        <p class="post-excerpt">${post.description}</p>
                        <a href="${post.link}" target="_blank" rel="noopener" class="post-link">
                            Read more
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M7 17l9.2-9.2M17 17V7H7"/>
                            </svg>
                        </a>
                    </div>
                </article>
            `).join('');
        })
        .catch(error => {
            console.error('Error loading Substack feed:', error);
            feedContainer.innerHTML = `
                <div class="feed-error">
                    <p>Unable to load posts right now.</p>
                    <p><a href="https://carolynhammondart.substack.com" target="_blank" rel="noopener">Visit Carolyn's Substack directly →</a></p>
                </div>
            `;
        });
}

/**
 * Feedback Form
 */
function initFeedbackForm() {
    const form = document.getElementById('feedback-form');
    if (!form) return;
    
    const FEEDBACK_URL = 'https://trustedloops-feedback.bawtman.workers.dev';
    const statusDiv = document.getElementById('form-status');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('feedback-name').value.trim();
        const email = document.getElementById('feedback-email').value.trim();
        const message = document.getElementById('feedback-message').value.trim();
        
        // Validate
        if (!name || !email || !message) {
            showStatus('Please fill in all fields.', 'error');
            return;
        }
        
        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span>';
        statusDiv.className = 'form-status';
        statusDiv.textContent = '';
        
        try {
            const response = await fetch(FEEDBACK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showButtonSuccess();
                form.reset();
            } else {
                showStatus(data.error || 'Failed to send message. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showStatus('Failed to send message. Please try again later.', 'error');
        } finally {
            submitBtn.disabled = false;
        }
    });
    
    function showButtonSuccess() {
        submitBtn.innerHTML = '<span>✓ Message Sent!</span>';
        submitBtn.classList.add('btn-success');
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.classList.remove('btn-success');
        }, 3000);
    }
    
    function showStatus(message, type) {
        const icon = type === 'success' ? '✓ ' : '⚠ ';
        statusDiv.textContent = icon + message;
        statusDiv.className = `form-status ${type}`;
    }
}

/**
 * Track PDF download (optional analytics hook)
 */
document.querySelectorAll('a[download]').forEach(link => {
    link.addEventListener('click', function() {
        // Analytics tracking could be added here
        console.log('PDF Download initiated');
    });
});
