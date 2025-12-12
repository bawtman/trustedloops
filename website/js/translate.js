// Language Translation System
(function() {
    const languageSelect = document.getElementById('language-select');
    let currentTranslations = null;
    
    // Load saved language preference
    const savedLang = localStorage.getItem('trustedloops-lang') || 'en';
    languageSelect.value = savedLang;
    
    if (savedLang !== 'en') {
        loadTranslations(savedLang);
    }
    
    // Handle language change
    languageSelect.addEventListener('change', (e) => {
        const lang = e.target.value;
        localStorage.setItem('trustedloops-lang', lang);
        
        if (lang === 'en') {
            location.reload(); // Reload to get original English
        } else {
            loadTranslations(lang);
        }
    });
    
    async function loadTranslations(lang) {
        try {
            const response = await fetch(`translations/${lang}.json`);
            if (!response.ok) throw new Error('Translation not found');
            
            currentTranslations = await response.json();
            applyTranslations(currentTranslations);
        } catch (error) {
            console.error('Failed to load translations:', error);
        }
    }
    
    function applyTranslations(t) {
        // Navigation
        updateText('[href="#introduction"]', t.nav.introduction);
        updateText('[href="#core-premise"]', t.nav.corePremise);
        updateText('[href="#family-loop"]', t.nav.familyLoop);
        updateText('[href="#safeguard-loop"]', t.nav.safeguardLoop);
        updateText('[href="#creator-continuity"]', t.nav.creatorContinuity);
        updateText('[href="#media"]', t.nav.media);
        updateText('[href="#pages"]', t.nav.readPages);
        updateText('.btn-download', t.nav.downloadPdf);
        
        // Hero
        updateText('.hero-subtitle', t.hero.subtitle);
        updateText('.hero-title', t.hero.title);
        updateText('.hero-tagline', t.hero.tagline);
        updateText('.btn-primary', t.hero.ctaRead);
        updateText('.hero-cta .btn-secondary', t.hero.ctaDownload);
        
        // Section 01 - Introduction
        updateText('#introduction .section-number', t.introduction.number);
        updateText('#introduction h2', t.introduction.title);
        updateText('#introduction .featured-quote', `"${t.introduction.quote}"`);
        updateText('#introduction .content-main p:nth-child(2)', t.introduction.p1);
        updateText('#introduction .content-main p:nth-child(3)', t.introduction.p2);
        updateText('#introduction .content-main p:nth-child(4)', t.introduction.p3);
        updateText('#introduction .info-card:nth-child(1) h3', t.introduction.alsoServes);
        updateText('#introduction .info-card:nth-child(2) h3', t.introduction.whatsNew);
        
        // Section 02 - Core Premise
        updateText('#core-premise .section-number', t.corePremise.number);
        updateText('#core-premise h2', t.corePremise.title);
        updateText('#core-premise .featured-quote', `"${t.corePremise.quote}"`);
        updateText('#core-premise .lead-text', t.corePremise.lead);
        updateText('#core-premise .pillar:nth-child(1) h3', t.corePremise.pillar1Title);
        updateText('#core-premise .pillar:nth-child(1) p', t.corePremise.pillar1Text);
        updateText('#core-premise .pillar:nth-child(2) h3', t.corePremise.pillar2Title);
        updateText('#core-premise .pillar:nth-child(2) p', t.corePremise.pillar2Text);
        updateText('#core-premise .pillar:nth-child(3) h3', t.corePremise.pillar3Title);
        updateText('#core-premise .pillar:nth-child(3) p', t.corePremise.pillar3Text);
        updateText('#core-premise .pillar:nth-child(4) h3', t.corePremise.pillar4Title);
        updateText('#core-premise .pillar:nth-child(4) p', t.corePremise.pillar4Text);
        
        // Section 03 - Family Loop
        updateText('#family-loop .section-number', t.familyLoop.number);
        updateText('#family-loop h2', t.familyLoop.title);
        updateText('#family-loop .lead-text', t.familyLoop.lead);
        
        // Section 04 - What's Missing
        updateText('#whats-missing .section-number', t.whatsMissing.number);
        updateText('#whats-missing h2', t.whatsMissing.title);
        updateText('#whats-missing .missing-item:nth-child(1) h3', t.whatsMissing.item1Title);
        updateText('#whats-missing .missing-item:nth-child(1) p', t.whatsMissing.item1Text);
        updateText('#whats-missing .missing-item:nth-child(2) h3', t.whatsMissing.item2Title);
        updateText('#whats-missing .missing-item:nth-child(2) p', t.whatsMissing.item2Text);
        updateText('#whats-missing .missing-item:nth-child(3) h3', t.whatsMissing.item3Title);
        updateText('#whats-missing .missing-item:nth-child(3) p', t.whatsMissing.item3Text);
        updateText('#whats-missing .missing-item:nth-child(4) h3', t.whatsMissing.item4Title);
        updateText('#whats-missing .missing-item:nth-child(4) p', t.whatsMissing.item4Text);
        
        // Section 05 - Safeguard Loop
        updateText('#safeguard-loop .section-number', t.safeguardLoop.number);
        updateText('#safeguard-loop h2', t.safeguardLoop.title);
        updateText('#safeguard-loop .section-subtitle', t.safeguardLoop.subtitle);
        
        // Section 06 - Creator Continuity
        updateText('#creator-continuity .section-number', t.creatorContinuity.number);
        updateText('#creator-continuity h2', t.creatorContinuity.title);
        updateText('#creator-continuity .section-subtitle', t.creatorContinuity.subtitle);
        updateText('#creator-continuity .featured-quote', `"${t.creatorContinuity.quote}"`);
        updateText('#creator-continuity .lead-text', t.creatorContinuity.lead);
        
        // Section 07 - Reflection
        updateText('#reflection .section-number', t.reflection.number);
        updateText('#reflection h2', t.reflection.title);
        updateText('#reflection .section-subtitle', t.reflection.subtitle);
        updateText('#reflection .featured-quote', `"${t.reflection.quote}"`);
        
        // CTA Section
        updateText('#cta h2', t.cta.title);
        updateText('#cta .featured-quote', `"${t.cta.quote}"`);
        
        // Media Section
        updateText('#media h2', t.media.title);
        updateText('#media .section-subtitle', t.media.subtitle);
        updateText('.media-featured .media-label span:last-child', t.media.videoLabel);
        updateText('.media-audio .media-label span:last-child', t.media.audioLabel);
        
        // Pages Section
        updateText('#pages h2', t.pages.title);
        updateText('#pages .section-subtitle', t.pages.subtitle);
        
        // Download Section
        updateText('#download h2', t.download.title);
        updateText('#download > .container > .download-content > p:first-of-type', t.download.text);
        
        // About Section
        updateText('#about h2', t.about.title);
        updateText('#about .about-author h3', t.about.authorTitle);
        updateText('#about .about-presence h3', t.about.presenceTitle);
        updateText('#about .about-cocreation h3', t.about.cocreationTitle);
        
        // Footer
        updateText('.footer-brand p', t.footer.tagline);
        updateText('.footer-license p', t.footer.license);
        
        // Chat Widget
        updateText('.chat-label', t.chat.label);
        updateText('#chat-input', null, t.chat.placeholder);
        
        // Set page direction for RTL languages
        if (['ar', 'hi'].includes(languageSelect.value)) {
            document.documentElement.dir = 'rtl';
        } else {
            document.documentElement.dir = 'ltr';
        }
    }
    
    function updateText(selector, text, placeholder) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (text !== null && text !== undefined) {
                el.textContent = text;
            }
            if (placeholder) {
                el.placeholder = placeholder;
            }
        });
    }
})();
