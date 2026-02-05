/**
 * PetNudge Shop - Stripe Integration
 *
 * ============================================
 * INSTRUCȚIUNI PENTRU CONFIGURARE STRIPE:
 * ============================================
 *
 * 1. Creează cont pe https://dashboard.stripe.com
 *
 * 2. Creează 4 produse în Stripe Dashboard:
 *    - Dashboard → Products → Add product
 *    - Nume: "Tag NFC Premium - Patte (30mm)" - Preț: 14.99 EUR
 *    - Nume: "Tag NFC Premium - Os (35mm)" - Preț: 14.99 EUR
 *    - Nume: "Tag NFC Premium - Coeur (28mm)" - Preț: 14.99 EUR
 *    - Nume: "Tag NFC Premium - Classique (32mm)" - Preț: 14.99 EUR
 *
 * 3. Pentru fiecare produs, copiază Price ID:
 *    - Click pe produs → Pricing → Copy price ID (începe cu "price_")
 *
 * 4. Copiază Publishable Key:
 *    - Dashboard → Developers → API Keys → Publishable key (începe cu "pk_")
 *
 * 5. Înlocuiește valorile PLACEHOLDER de mai jos cu cheile tale reale
 *
 * 6. Prețul include livrarea pentru Franța (all-in)
 *    - Pentru restul Europei, configurează Shipping în Stripe: 3€
 *
 * ============================================
 */

// ============================================
// ⚠️ CONFIGURARE STRIPE - ÎNLOCUIEȘTE ACESTE VALORI
// ============================================
const STRIPE_CONFIG = {
    // Înlocuiește cu Publishable Key din Stripe Dashboard
    // Format: pk_live_XXXXXXXXXXXXXXXXXXXX sau pk_test_XXXXXXXXXXXXXXXXXXXX
    publishableKey: 'pk_live_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',

    // Înlocuiește cu Price IDs din Stripe Dashboard
    // Format: price_XXXXXXXXXXXXXXXXXXXXXXXX
    priceIds: {
        paw: 'price_XXXXXXXXXXXXXXXXXXXXXXXX',     // Tag Patte 30mm - 14.99€
        bone: 'price_XXXXXXXXXXXXXXXXXXXXXXXX',    // Tag Os 35mm - 14.99€
        heart: 'price_XXXXXXXXXXXXXXXXXXXXXXXX',   // Tag Coeur 28mm - 14.99€
        round: 'price_XXXXXXXXXXXXXXXXXXXXXXXX'    // Tag Classique 32mm - 14.99€
    },

    // URLs pentru redirect după plată
    successUrl: 'https://petnudge.fr/success.html?session_id={CHECKOUT_SESSION_ID}',
    cancelUrl: 'https://petnudge.fr/shop.html?cancelled=true',

    // Țări pentru livrare (coduri ISO)
    shippingCountries: [
        'FR', // France
        'DE', // Germany
        'BE', // Belgium
        'ES', // Spain
        'IT', // Italy
        'NL', // Netherlands
        'PT', // Portugal
        'AT', // Austria
        'CH', // Switzerland
        'LU', // Luxembourg
        'IE', // Ireland
        'RO', // Romania
        'PL', // Poland
        'CZ', // Czech Republic
        'SK', // Slovakia
        'HU', // Hungary
        'SI', // Slovenia
        'HR', // Croatia
        'BG', // Bulgaria
        'GR', // Greece
        'SE', // Sweden
        'DK', // Denmark
        'FI'  // Finland
    ]
};
// ============================================

// Variabilă globală Stripe
let stripe = null;

/**
 * Inițializează Stripe
 */
function initStripe() {
    // Verifică dacă cheia este configurată
    if (STRIPE_CONFIG.publishableKey.includes('XXXX')) {
        console.warn('⚠️ Stripe nu este configurat încă.');
        console.info('📝 Urmează instrucțiunile din shop-stripe.js pentru configurare.');
        return false;
    }

    try {
        stripe = Stripe(STRIPE_CONFIG.publishableKey);
        console.log('✅ Stripe inițializat cu succes');
        return true;
    } catch (error) {
        console.error('❌ Eroare la inițializarea Stripe:', error);
        return false;
    }
}

/**
 * Configurează butoanele de cumpărare
 */
function setupBuyButtons() {
    const buttons = document.querySelectorAll('.buy-button');

    buttons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();

            const product = button.dataset.product;
            const priceId = STRIPE_CONFIG.priceIds[product];

            // Verifică configurarea Stripe
            if (!stripe) {
                if (!initStripe()) {
                    // Fallback la email dacă Stripe nu e configurat
                    fallbackToEmail(product);
                    return;
                }
            }

            // Verifică Price ID
            if (!priceId || priceId.includes('XXXX')) {
                console.warn('⚠️ Price ID nu este configurat pentru:', product);
                fallbackToEmail(product);
                return;
            }

            // Arată loading state
            setButtonLoading(button, true);

            try {
                // Redirect la Stripe Checkout
                const { error } = await stripe.redirectToCheckout({
                    lineItems: [{
                        price: priceId,
                        quantity: 1
                    }],
                    mode: 'payment',
                    successUrl: STRIPE_CONFIG.successUrl,
                    cancelUrl: STRIPE_CONFIG.cancelUrl,
                    shippingAddressCollection: {
                        allowedCountries: STRIPE_CONFIG.shippingCountries
                    },
                    billingAddressCollection: 'required',
                    locale: getStripeLocale()
                });

                if (error) {
                    throw error;
                }
            } catch (error) {
                console.error('Erreur Stripe:', error);
                showToast(getErrorMessage(error), 'error');
                setButtonLoading(button, false);
            }
        });
    });
}

/**
 * Fallback la comandă prin email
 */
function fallbackToEmail(product) {
    const productNames = {
        paw: 'Tag NFC Premium - Patte (30mm) - 14.99€',
        bone: 'Tag NFC Premium - Os (35mm) - 14.99€',
        heart: 'Tag NFC Premium - Coeur (28mm) - 14.99€',
        round: 'Tag NFC Premium - Classique (32mm) - 14.99€'
    };

    const subject = encodeURIComponent(`Commande: ${productNames[product] || product}`);
    const body = encodeURIComponent(`Bonjour,\n\nJe souhaite commander:\n${productNames[product] || product}\n\nMerci de me contacter pour finaliser ma commande.\n\nCordialement`);

    window.location.href = `mailto:contact@petnudge.fr?subject=${subject}&body=${body}`;
}

/**
 * Setează starea de loading pe buton
 */
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.dataset.originalHtml = button.innerHTML;
        button.innerHTML = '<span class="loading-spinner"></span> <span>Chargement...</span>';
        button.disabled = true;
        button.classList.add('loading');
    } else {
        button.innerHTML = button.dataset.originalHtml || button.innerHTML;
        button.disabled = false;
        button.classList.remove('loading');
    }
}

/**
 * Obține locale-ul pentru Stripe bazat pe limba curentă
 */
function getStripeLocale() {
    const lang = document.documentElement.lang ||
                 localStorage.getItem('petnudge-lang') ||
                 navigator.language.split('-')[0] ||
                 'fr';

    // Stripe supported locales
    const stripeLocales = ['bg', 'cs', 'da', 'de', 'el', 'en', 'es', 'et', 'fi', 'fr', 'hr', 'hu', 'it', 'ja', 'lt', 'lv', 'ms', 'mt', 'nb', 'nl', 'pl', 'pt', 'ro', 'sk', 'sl', 'sv', 'zh'];

    return stripeLocales.includes(lang) ? lang : 'auto';
}

/**
 * Obține mesajul de eroare localizat
 */
function getErrorMessage(error) {
    const lang = document.documentElement.lang || 'fr';

    const messages = {
        fr: "Une erreur est survenue. Veuillez réessayer ou nous contacter.",
        en: "An error occurred. Please try again or contact us.",
        de: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns.",
        es: "Se produjo un error. Por favor, inténtelo de nuevo o contáctenos.",
        it: "Si è verificato un errore. Riprova o contattaci.",
        pt: "Ocorreu um erro. Por favor, tente novamente ou entre em contato.",
        ro: "A apărut o eroare. Vă rugăm să încercați din nou sau să ne contactați.",
        ja: "エラーが発生しました。もう一度お試しいただくか、お問い合わせください。",
        zh: "发生错误。请重试或联系我们。"
    };

    return messages[lang] || messages.fr;
}

/**
 * Afișează toast notification
 */
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container') || createToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icon = type === 'error' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️';

    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()" aria-label="Close">&times;</button>
    `;

    container.appendChild(toast);

    // Auto-remove după 6 secunde
    setTimeout(() => {
        toast.classList.add('toast-fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 6000);
}

/**
 * Creează containerul pentru toast-uri dacă nu există
 */
function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
    return container;
}

/**
 * Verifică dacă user-ul a anulat comanda
 */
function checkCancelledOrder() {
    const params = new URLSearchParams(window.location.search);

    if (params.get('cancelled') === 'true') {
        const lang = document.documentElement.lang || 'fr';

        const messages = {
            fr: "Votre commande a été annulée. N'hésitez pas à réessayer!",
            en: "Your order was cancelled. Feel free to try again!",
            de: "Ihre Bestellung wurde storniert. Versuchen Sie es gerne erneut!",
            es: "Su pedido fue cancelado. ¡No dude en intentarlo de nuevo!",
            it: "Il tuo ordine è stato annullato. Non esitare a riprovare!",
            pt: "Seu pedido foi cancelado. Sinta-se à vontade para tentar novamente!",
            ro: "Comanda dvs. a fost anulată. Nu ezitați să încercați din nou!",
            ja: "ご注文はキャンセルされました。もう一度お試しください！",
            zh: "您的订单已取消。请随时重试！"
        };

        showToast(messages[lang] || messages.fr, 'info');

        // Curăță URL-ul
        window.history.replaceState({}, '', window.location.pathname);
    }
}

/**
 * Mobile menu toggle
 */
function setupMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const nav = document.querySelector('.shop-nav');

    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }
}

/**
 * Smooth scroll pentru link-uri interne
 */
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
}

// ============================================
// INIȚIALIZARE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Inițializează Stripe
    initStripe();

    // Configurează butoanele de cumpărare
    setupBuyButtons();

    // Verifică comenzi anulate
    checkCancelledOrder();

    // Configurează meniul mobil
    setupMobileMenu();

    // Configurează smooth scroll
    setupSmoothScroll();

    console.log('🛒 PetNudge Shop loaded');
});
