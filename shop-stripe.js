/**
 * PetNudge Shop - Stripe Payment Links Integration
 *
 * ============================================
 * INSTRUCȚIUNI PENTRU CONFIGURARE:
 * ============================================
 *
 * 1. Creează cont pe https://dashboard.stripe.com
 *
 * 2. Creează 2 Payment Links în Stripe Dashboard:
 *    - Dashboard → Payment Links → + New
 *
 *    Link 1: "1 Médaille NFC Personnalisée 34mm"
 *      - Preț: 19.99 EUR (one-time)
 *      - Shipping: activa "Collect shipping address"
 *        → Allowed countries: FR, DE, BE, ES, IT, NL, PT, AT, CH, LU, IE, RO, PL, etc.
 *      - Custom fields (Settings → After payment):
 *        → Add custom field 1: "Nom de l'animal" (text, required)
 *        → Add custom field 2: "Couleur (Noir/Bleu)" (text, required)
 *        → Add custom field 3: "Icône (Coeur/Os/Étoile/Patte)" (text, required)
 *      - After payment → Redirect: https://petnudge.fr/success.html
 *      - Copiază link-ul generat (ex: https://buy.stripe.com/XXXXX)
 *
 *    Link 2: "Pack 2 Médailles NFC Personnalisées 34mm"
 *      - Preț: 34.99 EUR (one-time)
 *      - Aceleași setări ca Link 1
 *      - Copiază link-ul generat
 *
 * 3. Înlocuiește URL-urile PLACEHOLDER de mai jos cu link-urile tale reale
 *
 * ============================================
 */

// ============================================
// ⚠️ CONFIGURARE - ÎNLOCUIEȘTE CU LINK-URILE TALE
// ============================================
const STRIPE_CONFIG = {
    paymentLinks: {
        // Înlocuiește cu Payment Link-urile tale din Stripe Dashboard
        // Format: https://buy.stripe.com/XXXXX
        single: 'https://buy.stripe.com/test_eVq9AN0fC8NXbER9u877O04',  // 1 Médaille - 19.99€
        pack2: 'https://buy.stripe.com/test_fZu4gt5zWaW5dMZ9u877O05'   // Pack 2 - 34.99€
    },

    cancelUrl: 'https://petnudge.fr/shop.html?cancelled=true'
};
// ============================================

// Selecții personalizare
const customization = {
    color: null,
    icon: null
};

/**
 * Selectează o opțiune din formularul de personalizare
 */
function selectOption(element, type) {
    const group = element.closest('.custom-options');
    group.querySelectorAll('.custom-option').forEach(opt => {
        opt.classList.remove('selected');
        opt.classList.remove('error');
    });

    element.classList.add('selected');
    customization[type] = element.dataset.value;
}

/**
 * Validează formularul de personalizare
 */
function validateCustomization() {
    let valid = true;
    const petNameInput = document.getElementById('pet-name');
    const petName = petNameInput ? petNameInput.value.trim() : '';

    if (!petName) {
        if (petNameInput) {
            petNameInput.classList.add('error');
            petNameInput.focus();
        }
        valid = false;
    } else {
        if (petNameInput) petNameInput.classList.remove('error');
    }

    if (!customization.color) {
        document.querySelectorAll('.custom-colors .custom-option').forEach(opt => opt.classList.add('error'));
        valid = false;
    }

    if (!customization.icon) {
        document.querySelectorAll('.custom-icons .custom-option').forEach(opt => opt.classList.add('error'));
        valid = false;
    }

    if (!valid) {
        const lang = document.documentElement.lang || 'fr';
        const messages = {
            fr: "Veuillez remplir tous les champs de personnalisation.",
            en: "Please fill in all customization fields.",
            de: "Bitte füllen Sie alle Personalisierungsfelder aus.",
            es: "Por favor, complete todos los campos de personalización.",
            it: "Si prega di compilare tutti i campi di personalizzazione.",
            pt: "Por favor, preencha todos os campos de personalização.",
            ro: "Vă rugăm să completați toate câmpurile de personalizare.",
            ja: "すべてのカスタマイズフィールドに入力してください。",
            zh: "请填写所有定制字段。"
        };
        showToast(messages[lang] || messages.fr, 'error');
        return null;
    }

    return {
        petName: petName,
        color: customization.color,
        icon: customization.icon
    };
}

/**
 * Configurează butoanele de cumpărare cu Payment Links
 */
function setupBuyButtons() {
    const buttons = document.querySelectorAll('.buy-button');

    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            // Validare personalizare
            const custom = validateCustomization();
            if (!custom) return;

            const product = button.dataset.product;
            const paymentLink = STRIPE_CONFIG.paymentLinks[product];

            // Verifică dacă link-ul e configurat
            if (!paymentLink || paymentLink.includes('PLACEHOLDER')) {
                console.warn('⚠️ Payment Link nu este configurat pentru:', product);
                fallbackToEmail(product, custom);
                return;
            }

            // Salvează personalizarea în localStorage pentru success page
            localStorage.setItem('petnudge-custom', JSON.stringify(custom));

            // Construiește URL-ul cu parametri pentru pre-fill
            // client_reference_id permite identificarea comenzii
            const colorNames = { noir: 'Noir', bleu: 'Bleu' };
            const iconNames = { 'coeur-rouge': 'Coeur Rouge', 'os-blanc': 'Os Blanc', 'etoile-jaune': 'Étoile Jaune' };

            const ref = `${custom.petName}|${colorNames[custom.color] || custom.color}|${iconNames[custom.icon] || custom.icon}`;
            const url = new URL(paymentLink);
            url.searchParams.set('client_reference_id', ref);
            url.searchParams.set('locale', getStripeLocale());

            // Redirect la Stripe Payment Link
            window.location.href = url.toString();
        });
    });
}

/**
 * Fallback la comandă prin email
 */
function fallbackToEmail(product, custom) {
    const productNames = {
        single: 'Médaille NFC Personnalisée 34mm - 19.99€',
        pack2: 'Pack 2 Médailles NFC Personnalisées 34mm - 34.99€'
    };

    const colorNames = { noir: 'Noir', bleu: 'Bleu' };
    const iconNames = { 'coeur-rouge': 'Coeur Rouge', 'os-blanc': 'Os Blanc', 'etoile-jaune': 'Étoile Jaune' };

    const petName = custom ? custom.petName : '';
    const color = custom ? (colorNames[custom.color] || '') : '';
    const icon = custom ? (iconNames[custom.icon] || '') : '';

    const subject = encodeURIComponent(`Commande: ${productNames[product] || product}`);
    const body = encodeURIComponent(`Bonjour,\n\nJe souhaite commander:\n${productNames[product] || product}\n\nPersonnalisation:\n- Nom de l'animal: ${petName}\n- Couleur: ${color}\n- Icône: ${icon}\n\nAdresse de livraison:\n\n\nMerci!\n\nCordialement`);

    window.location.href = `mailto:contactpetnudge@gmail.com?subject=${subject}&body=${body}`;
}

/**
 * Obține locale-ul pentru Stripe
 */
function getStripeLocale() {
    const lang = document.documentElement.lang ||
                 localStorage.getItem('petnudge-lang') ||
                 navigator.language.split('-')[0] ||
                 'fr';

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

    setTimeout(() => {
        toast.classList.add('toast-fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 6000);
}

/**
 * Creează containerul pentru toast-uri
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
        window.history.replaceState({}, '', window.location.pathname);
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
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ============================================
// INIȚIALIZARE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    setupBuyButtons();
    checkCancelledOrder();
    setupSmoothScroll();

    const petNameInput = document.getElementById('pet-name');
    if (petNameInput) {
        petNameInput.addEventListener('input', () => {
            petNameInput.classList.remove('error');
        });
    }

    console.log('🛒 PetNudge Shop loaded');
});
