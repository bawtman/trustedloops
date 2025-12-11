/**
 * Trusted Loops - Main JavaScript
 * A Manifesto for Ethical, Relational AI
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initSmoothScroll();
    initPageModal();
    initScrollAnimations();
});

/**
 * Navigation functionality
 */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
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
 * Track PDF download (optional analytics hook)
 */
document.querySelectorAll('a[download]').forEach(link => {
    link.addEventListener('click', function() {
        // Analytics tracking could be added here
        console.log('PDF Download initiated');
    });
});
