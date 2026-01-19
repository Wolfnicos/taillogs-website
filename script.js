/**
 * PetNudge Website - Interactive Features
 * Language toggle, FAQ accordion, sticky CTA, mobile menu
 */

(function() {
  'use strict';

  // ==========================================
  // Translations (EN + FR)
  // ==========================================
  const translations = {
    en: {
      // Header
      'nav.features': 'Features',
      'nav.how': 'How It Works',
      'nav.pricing': 'Pricing',
      'nav.faq': 'FAQ',
      'nav.privacy': 'Privacy',

      // Hero
      'hero.badge': 'Pet Safety Reimagined',
      'hero.title1': 'Smart Pet ID +',
      'hero.title2': 'Lost Pet Recovery',
      'hero.subtitle': 'QR codes and NFC tags that help anyone who finds your pet contact you instantly. No app needed for finders.',
      'hero.cta1': 'Download on App Store',
      'hero.cta2': 'See How It Works',

      // Problem
      'problem.label': 'The Problem',
      'problem.title': 'Traditional pet ID has failed',
      'problem.subtitle': 'Microchips and engraved tags aren\'t enough when your pet goes missing.',
      'problem.1.title': 'Microchips require a vet visit',
      'problem.1.desc': 'If someone finds your pet, they need to take it to a vet or shelter with a scanner. Most people don\'t know this or won\'t do it.',
      'problem.2.title': 'Engraved tags get outdated',
      'problem.2.desc': 'Phone numbers change. Tags get worn and unreadable. You can\'t update them remotely.',

      // Solution
      'solution.label': 'The Solution',
      'solution.title': 'Modern pet ID that actually works',
      'solution.subtitle': 'Instant contact through technology everyone already has.',
      'solution.1.title': 'QR Code',
      'solution.1.desc': 'Any smartphone camera can scan it. No app required.',
      'solution.2.title': 'NFC Tag',
      'solution.2.desc': 'Tap to call. Works on all modern phones instantly.',
      'solution.3.title': 'Lost Mode',
      'solution.3.desc': 'Activate remotely. Finders see urgent alert with reward info.',

      // How It Works
      'how.label': 'How It Works',
      'how.title': '3 simple steps to protect your pet',
      'how.1.title': 'Create your pet\'s profile',
      'how.1.desc': 'Add your pet with photo, name, and your contact phone number.',
      'how.2.title': 'Generate & attach tag',
      'how.2.desc': 'Print the QR code or write to an NFC tag. Attach it to the collar.',
      'how.3.title': 'If lost, enable Lost Mode',
      'how.3.desc': 'One tap shows finders an urgent alert with reward info. Track scan locations.',

      // Lost Mode
      'lost.label': 'The Differentiator',
      'lost.title': 'Lost Mode changes everything',
      'lost.subtitle': 'When your pet goes missing, activate Lost Mode. Here\'s what finders see:',
      'lost.demo.alert': 'LOST PET',
      'lost.demo.alert.sub': 'This pet is reported missing',
      'lost.demo.name': 'Max',
      'lost.demo.contact': 'Tap to call owner',
      'lost.demo.phone': '+33 6 12 34 56 78',
      'lost.demo.reward': 'Reward offered for safe return',
      'lost.feature.1.title': 'Instant contact',
      'lost.feature.1.desc': 'One tap to call. No app download, no registration.',
      'lost.feature.2.title': 'Scan tracking',
      'lost.feature.2.desc': 'See when and where your tag was scanned (city-level only).',
      'lost.feature.3.title': 'Reward display',
      'lost.feature.3.desc': 'Motivate finders with optional reward message.',
      'lost.feature.4.title': 'Remote activation',
      'lost.feature.4.desc': 'Turn Lost Mode on/off from anywhere in the app.',

      // Privacy
      'privacy.label': 'Privacy First',
      'privacy.title': 'Your data stays yours',
      'privacy.subtitle': 'We built PetNudge with privacy as a core principle.',
      'privacy.1.title': 'Local-first storage',
      'privacy.1.desc': 'Health records stay on your device. No cloud required.',
      'privacy.2.title': 'No public profiles',
      'privacy.2.desc': 'Finders only see contact info. No health data ever shared.',
      'privacy.3.title': 'City-level tracking',
      'privacy.3.desc': 'Scan history shows city only, not precise coordinates.',

      // Features
      'features.label': 'More Than ID Tags',
      'features.title': 'Complete pet health companion',
      'features.subtitle': 'Beyond lost pet recovery, track your pet\'s complete health.',
      'features.1.title': 'Health Records',
      'features.1.desc': 'Track vaccinations, medications, weight, and vet visits.',
      'features.2.title': 'Smart Reminders',
      'features.2.desc': 'Never miss a medication dose or vaccination date.',
      'features.3.title': 'AI Assistant',
      'features.3.desc': 'Get instant guidance on symptoms and food safety.',
      'features.4.title': 'PDF Export',
      'features.4.desc': 'Generate health reports for vet visits or travel.',
      'features.5.title': 'Find Vet Clinics',
      'features.5.desc': 'Locate nearby veterinarians and emergency hospitals.',
      'features.6.title': 'Multiple Pets',
      'features.6.desc': 'Manage all your pets in one secure app.',

      // Pricing
      'pricing.label': 'Pricing',
      'pricing.title': 'Start with 7 days free',
      'pricing.subtitle': 'Try everything. No commitment. Cancel anytime.',
      'pricing.badge': '7-Day Free Trial',
      'pricing.card.title': 'PetNudge Pro',
      'pricing.card.subtitle': 'Full access to all features',
      'pricing.feature.1': 'QR Code & NFC tag generation',
      'pricing.feature.2': 'Lost Mode with scan tracking',
      'pricing.feature.3': 'AI health assistant',
      'pricing.feature.4': 'Unlimited pets',
      'pricing.feature.5': 'PDF health reports',
      'pricing.feature.6': 'Smart reminders',
      'pricing.plan.monthly': 'Monthly plan',
      'pricing.plan.yearly': 'Yearly plan',
      'pricing.plan.save': 'Save with annual',
      'pricing.cta': 'Start Free Trial',

      // FAQ
      'faq.label': 'Questions',
      'faq.title': 'Frequently asked questions',
      'faq.1.q': 'Do finders need the PetNudge app?',
      'faq.1.a': 'No. Finders just scan the QR code with any smartphone camera or tap the NFC tag. No app download or registration required. They\'ll see your contact info and can call you directly.',
      'faq.2.q': 'Which phones support NFC tags?',
      'faq.2.a': 'All iPhones from iPhone 7 and later, plus most Android phones from 2015 onwards. For QR codes, any smartphone with a camera works.',
      'faq.3.q': 'Does it work without internet?',
      'faq.3.a': 'The NFC tag triggers a phone call, which works without internet. QR codes open a contact card that may need data to load, but the phone number still appears.',
      'faq.4.q': 'What happens when someone scans my pet\'s tag?',
      'faq.4.a': 'They see your pet\'s name and a button to call you. If Lost Mode is active, they also see an urgent alert and any reward message you\'ve set.',
      'faq.5.q': 'Can I use my existing microchip?',
      'faq.5.a': 'Yes! PetNudge complements microchips. You can store your microchip number in the app. We recommend using both: microchip for permanent ID, NFC/QR for instant contact.',
      'faq.6.q': 'Are the tags waterproof?',
      'faq.6.a': 'NFC stickers are water-resistant. We recommend placing them inside a protective tag holder or using a laminated QR code for outdoor durability.',
      'faq.7.q': 'What if I cancel my subscription?',
      'faq.7.a': 'Your basic pet profiles remain accessible. QR codes and NFC tags you\'ve already created continue working. Lost Mode and advanced features require an active subscription.',

      // Waitlist
      'waitlist.label': 'Coming Soon',
      'waitlist.title': 'Custom NFC Pet Tags',
      'waitlist.subtitle': 'Pre-programmed NFC tags designed for pet collars. Join the waitlist.',
      'waitlist.placeholder': 'Enter your email',
      'waitlist.btn': 'Notify Me',
      'waitlist.note': 'We\'ll email you when tags are available. No spam.',

      // Footer
      'footer.tagline': 'Smart pet ID and health companion for modern pet owners.',
      'footer.legal': 'Legal',
      'footer.support': 'Support',
      'footer.contact': 'Contact Us',
      'footer.copyright': '2025 PetNudge. All rights reserved.',

      // Sticky CTA
      'sticky.title': 'Protect your pet today',
      'sticky.subtitle': '7-day free trial, cancel anytime',
      'sticky.cta': 'Download Free'
    },

    fr: {
      // Header
      'nav.features': 'Fonctionnalités',
      'nav.how': 'Comment ça marche',
      'nav.pricing': 'Tarifs',
      'nav.faq': 'FAQ',
      'nav.privacy': 'Confidentialité',

      // Hero
      'hero.badge': 'Sécurité animale réinventée',
      'hero.title1': 'Identification Intelligente +',
      'hero.title2': 'Récupération d\'Animaux Perdus',
      'hero.subtitle': 'QR codes et tags NFC permettant à quiconque trouve votre animal de vous contacter instantanément. Aucune app requise.',
      'hero.cta1': 'Télécharger sur l\'App Store',
      'hero.cta2': 'Voir comment ça marche',

      // Problem
      'problem.label': 'Le Problème',
      'problem.title': 'L\'identification traditionnelle a échoué',
      'problem.subtitle': 'Les puces et médailles gravées ne suffisent pas quand votre animal disparaît.',
      'problem.1.title': 'Les puces nécessitent un vétérinaire',
      'problem.1.desc': 'Si quelqu\'un trouve votre animal, il doit l\'emmener chez un vétérinaire avec un lecteur. La plupart des gens ne le savent pas ou ne le font pas.',
      'problem.2.title': 'Les médailles gravées deviennent obsolètes',
      'problem.2.desc': 'Les numéros changent. Les médailles s\'usent. Impossible de les mettre à jour à distance.',

      // Solution
      'solution.label': 'La Solution',
      'solution.title': 'Identification moderne qui fonctionne',
      'solution.subtitle': 'Contact instantané grâce à la technologie que tout le monde possède déjà.',
      'solution.1.title': 'QR Code',
      'solution.1.desc': 'N\'importe quel smartphone peut le scanner. Aucune app requise.',
      'solution.2.title': 'Tag NFC',
      'solution.2.desc': 'Touchez pour appeler. Fonctionne sur tous les téléphones modernes.',
      'solution.3.title': 'Mode Perdu',
      'solution.3.desc': 'Activez à distance. L\'alerte urgente s\'affiche avec la récompense.',

      // How It Works
      'how.label': 'Comment ça marche',
      'how.title': '3 étapes simples pour protéger votre animal',
      'how.1.title': 'Créez le profil de votre animal',
      'how.1.desc': 'Ajoutez votre animal avec photo, nom et votre numéro de téléphone.',
      'how.2.title': 'Générez et attachez le tag',
      'how.2.desc': 'Imprimez le QR code ou programmez un tag NFC. Attachez-le au collier.',
      'how.3.title': 'Si perdu, activez le Mode Perdu',
      'how.3.desc': 'Un tap affiche une alerte urgente avec récompense. Suivez les scans.',

      // Lost Mode
      'lost.label': 'Le Différenciateur',
      'lost.title': 'Le Mode Perdu change tout',
      'lost.subtitle': 'Quand votre animal disparaît, activez le Mode Perdu. Voici ce que voient les personnes :',
      'lost.demo.alert': 'ANIMAL PERDU',
      'lost.demo.alert.sub': 'Cet animal est signalé disparu',
      'lost.demo.name': 'Max',
      'lost.demo.contact': 'Appuyer pour appeler',
      'lost.demo.phone': '+33 6 12 34 56 78',
      'lost.demo.reward': 'Récompense offerte pour retour sain et sauf',
      'lost.feature.1.title': 'Contact instantané',
      'lost.feature.1.desc': 'Un tap pour appeler. Aucune app, aucune inscription.',
      'lost.feature.2.title': 'Suivi des scans',
      'lost.feature.2.desc': 'Voyez quand et où votre tag a été scanné (ville uniquement).',
      'lost.feature.3.title': 'Affichage récompense',
      'lost.feature.3.desc': 'Motivez les personnes avec un message de récompense optionnel.',
      'lost.feature.4.title': 'Activation à distance',
      'lost.feature.4.desc': 'Activez/désactivez le Mode Perdu depuis n\'importe où.',

      // Privacy
      'privacy.label': 'Confidentialité d\'abord',
      'privacy.title': 'Vos données vous appartiennent',
      'privacy.subtitle': 'PetNudge est construit avec la confidentialité comme principe fondamental.',
      'privacy.1.title': 'Stockage local',
      'privacy.1.desc': 'Les dossiers de santé restent sur votre appareil. Aucun cloud requis.',
      'privacy.2.title': 'Pas de profils publics',
      'privacy.2.desc': 'Les personnes ne voient que vos coordonnées. Jamais de données de santé.',
      'privacy.3.title': 'Localisation par ville',
      'privacy.3.desc': 'L\'historique des scans montre la ville uniquement, pas les coordonnées.',

      // Features
      'features.label': 'Plus que des tags',
      'features.title': 'Compagnon santé complet',
      'features.subtitle': 'Au-delà de la récupération d\'animaux perdus, suivez la santé complète de votre animal.',
      'features.1.title': 'Dossiers de santé',
      'features.1.desc': 'Suivez vaccinations, médicaments, poids et visites vétérinaires.',
      'features.2.title': 'Rappels intelligents',
      'features.2.desc': 'Ne manquez jamais une dose de médicament ou une vaccination.',
      'features.3.title': 'Assistant IA',
      'features.3.desc': 'Obtenez des conseils sur les symptômes et la sécurité alimentaire.',
      'features.4.title': 'Export PDF',
      'features.4.desc': 'Générez des rapports de santé pour les visites vétérinaires.',
      'features.5.title': 'Trouver des cliniques',
      'features.5.desc': 'Localisez les vétérinaires et urgences à proximité.',
      'features.6.title': 'Plusieurs animaux',
      'features.6.desc': 'Gérez tous vos animaux dans une seule app sécurisée.',

      // Pricing
      'pricing.label': 'Tarifs',
      'pricing.title': 'Commencez avec 7 jours gratuits',
      'pricing.subtitle': 'Essayez tout. Sans engagement. Annulez à tout moment.',
      'pricing.badge': 'Essai gratuit 7 jours',
      'pricing.card.title': 'PetNudge Pro',
      'pricing.card.subtitle': 'Accès complet à toutes les fonctionnalités',
      'pricing.feature.1': 'Génération QR Code & tag NFC',
      'pricing.feature.2': 'Mode Perdu avec suivi des scans',
      'pricing.feature.3': 'Assistant santé IA',
      'pricing.feature.4': 'Animaux illimités',
      'pricing.feature.5': 'Rapports de santé PDF',
      'pricing.feature.6': 'Rappels intelligents',
      'pricing.plan.monthly': 'Forfait mensuel',
      'pricing.plan.yearly': 'Forfait annuel',
      'pricing.plan.save': 'Économisez avec l\'annuel',
      'pricing.cta': 'Commencer l\'essai gratuit',

      // FAQ
      'faq.label': 'Questions',
      'faq.title': 'Questions fréquentes',
      'faq.1.q': 'Les personnes qui trouvent l\'animal ont-elles besoin de l\'app ?',
      'faq.1.a': 'Non. Elles scannent simplement le QR code avec n\'importe quel smartphone ou touchent le tag NFC. Aucun téléchargement d\'app ni inscription requis. Elles verront vos coordonnées et pourront vous appeler directement.',
      'faq.2.q': 'Quels téléphones supportent les tags NFC ?',
      'faq.2.a': 'Tous les iPhones à partir de l\'iPhone 7, ainsi que la plupart des téléphones Android depuis 2015. Pour les QR codes, tout smartphone avec appareil photo fonctionne.',
      'faq.3.q': 'Ça fonctionne sans internet ?',
      'faq.3.a': 'Le tag NFC déclenche un appel téléphonique, qui fonctionne sans internet. Les QR codes ouvrent une fiche contact qui peut nécessiter des données, mais le numéro de téléphone s\'affiche quand même.',
      'faq.4.q': 'Que se passe-t-il quand quelqu\'un scanne le tag de mon animal ?',
      'faq.4.a': 'La personne voit le nom de votre animal et un bouton pour vous appeler. Si le Mode Perdu est actif, elle voit aussi une alerte urgente et votre message de récompense.',
      'faq.5.q': 'Puis-je utiliser ma puce existante ?',
      'faq.5.a': 'Oui ! PetNudge complète les puces. Vous pouvez stocker votre numéro de puce dans l\'app. Nous recommandons les deux : puce pour l\'ID permanent, NFC/QR pour le contact instantané.',
      'faq.6.q': 'Les tags sont-ils étanches ?',
      'faq.6.a': 'Les autocollants NFC sont résistants à l\'eau. Nous recommandons de les placer dans un support de protection ou d\'utiliser un QR code plastifié pour une durabilité extérieure.',
      'faq.7.q': 'Que se passe-t-il si j\'annule mon abonnement ?',
      'faq.7.a': 'Vos profils d\'animaux restent accessibles. Les QR codes et tags NFC créés continuent de fonctionner. Le Mode Perdu et les fonctionnalités avancées nécessitent un abonnement actif.',

      // Waitlist
      'waitlist.label': 'Bientôt disponible',
      'waitlist.title': 'Tags NFC personnalisés',
      'waitlist.subtitle': 'Tags NFC pré-programmés conçus pour les colliers. Rejoignez la liste d\'attente.',
      'waitlist.placeholder': 'Entrez votre email',
      'waitlist.btn': 'Me notifier',
      'waitlist.note': 'Nous vous enverrons un email quand les tags seront disponibles. Pas de spam.',

      // Footer
      'footer.tagline': 'Identification intelligente et compagnon santé pour propriétaires d\'animaux modernes.',
      'footer.legal': 'Légal',
      'footer.support': 'Support',
      'footer.contact': 'Nous contacter',
      'footer.copyright': '2025 PetNudge. Tous droits réservés.',

      // Sticky CTA
      'sticky.title': 'Protégez votre animal aujourd\'hui',
      'sticky.subtitle': 'Essai gratuit 7 jours, annulez à tout moment',
      'sticky.cta': 'Télécharger gratuit'
    }
  };

  // ==========================================
  // State
  // ==========================================
  let currentLang = localStorage.getItem('petnudge-lang') ||
                    (navigator.language.startsWith('fr') ? 'fr' : 'en');

  // ==========================================
  // DOM Ready
  // ==========================================
  document.addEventListener('DOMContentLoaded', function() {
    initLanguage();
    initFAQ();
    initStickyCTA();
    initMobileMenu();
    initSmoothScroll();
  });

  // ==========================================
  // Language Toggle
  // ==========================================
  function initLanguage() {
    // Set initial language
    setLanguage(currentLang);

    // Update toggle button text
    updateLangToggle();

    // Add click handler
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
      langToggle.addEventListener('click', function() {
        currentLang = currentLang === 'en' ? 'fr' : 'en';
        localStorage.setItem('petnudge-lang', currentLang);
        setLanguage(currentLang);
        updateLangToggle();
      });
    }
  }

  function setLanguage(lang) {
    document.documentElement.lang = lang;

    // Update all translatable elements
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[lang] && translations[lang][key]) {
        el.placeholder = translations[lang][key];
      }
    });
  }

  function updateLangToggle() {
    const langText = document.getElementById('lang-text');
    if (langText) {
      langText.textContent = currentLang.toUpperCase();
    }
  }

  // ==========================================
  // FAQ Accordion
  // ==========================================
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq__item');

    faqItems.forEach(function(item) {
      const question = item.querySelector('.faq__question');

      question.addEventListener('click', function() {
        const isOpen = item.classList.contains('is-open');

        // Close all other items
        faqItems.forEach(function(otherItem) {
          otherItem.classList.remove('is-open');
        });

        // Toggle current item
        if (!isOpen) {
          item.classList.add('is-open');
        }
      });
    });
  }

  // ==========================================
  // Sticky CTA
  // ==========================================
  function initStickyCTA() {
    const stickyCTA = document.querySelector('.sticky-cta');
    const hero = document.querySelector('.hero');

    if (!stickyCTA || !hero) return;

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          stickyCTA.classList.remove('is-visible');
        } else {
          stickyCTA.classList.add('is-visible');
        }
      });
    }, {
      threshold: 0,
      rootMargin: '-100px 0px 0px 0px'
    });

    observer.observe(hero);
  }

  // ==========================================
  // Mobile Menu
  // ==========================================
  function initMobileMenu() {
    const menuBtn = document.getElementById('menu-btn');
    const menuClose = document.getElementById('menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu__link');

    if (!menuBtn || !mobileMenu) return;

    menuBtn.addEventListener('click', function() {
      mobileMenu.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });

    if (menuClose) {
      menuClose.addEventListener('click', closeMenu);
    }

    mobileLinks.forEach(function(link) {
      link.addEventListener('click', closeMenu);
    });

    function closeMenu() {
      mobileMenu.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  // ==========================================
  // Smooth Scroll
  // ==========================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerHeight = document.querySelector('.header').offsetHeight;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ==========================================
  // Waitlist Form (basic - no backend)
  // ==========================================
  window.handleWaitlist = function(e) {
    e.preventDefault();
    const email = document.getElementById('waitlist-email').value;
    if (email) {
      // In production, this would submit to a backend
      // For now, open mailto with pre-filled subject
      window.location.href = 'mailto:tags@petnudge.fr?subject=NFC Tag Waitlist&body=Please add me to the NFC tag waitlist. Email: ' + encodeURIComponent(email);
    }
  };

})();
