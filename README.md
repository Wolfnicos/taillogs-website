# PetNudge Website

Official website for [PetNudge](https://petnudge.fr) - Smart Pet ID + Lost Pet Recovery iOS App.

## Features

- **Multilingual**: English (EN) and French (FR) with language toggle
- **Mobile-first**: Responsive design optimized for all devices
- **Accessible**: WCAG-compliant, screen reader friendly
- **Fast**: No heavy frameworks, optimized for Lighthouse scores
- **Premium**: Apple-like aesthetic matching the iOS app

## File Structure

```
taillogs-website/
├── index.html          # Main landing page
├── styles.css          # All styles (CSS custom properties)
├── script.js           # Language toggle, FAQ, sticky CTA
├── privacy.html        # Privacy Policy
├── terms.html          # Terms of Use
├── logo.png            # App logo
├── CNAME               # Custom domain (petnudge.fr)
├── README.md           # This file
└── assets/
    └── README.md       # Instructions for adding screenshots
```

## Information Architecture

1. **Hero**: Smart Pet ID + Lost Pet Recovery + 2 CTAs
2. **Problem**: Why microchips and engraved tags fail
3. **Solution**: QR + NFC + Lost Mode (3 benefits)
4. **How It Works**: 3 simple steps
5. **Lost Mode**: The differentiator (demo card + features)
6. **Privacy**: Local-first, no public health data
7. **Features**: Health + Reminders + AI (secondary)
8. **Pricing**: 7-day free trial (no prices shown)
9. **FAQ**: 7 common questions
10. **Footer**: Legal links + contact
11. **Smart Tags**: Waitlist section (Coming Soon)

## Local Development

Open `index.html` in a browser. No build step required.

For live reload during development:
```bash
# Using Python
python3 -m http.server 8000

# Using Node.js (npx)
npx serve .
```

Then open http://localhost:8000

## GitHub Pages Deployment

### Initial Setup (Already Done)

1. Repository Settings > Pages
2. Source: Deploy from branch
3. Branch: `main` / `/ (root)`
4. Save

### Custom Domain Setup (Already Done)

**CNAME file contains:** `petnudge.fr`

**DNS Records at domain registrar:**
```
A     @     185.199.108.153
A     @     185.199.109.153
A     @     185.199.110.153
A     @     185.199.111.153
CNAME www   lupudragos.github.io
```

**In GitHub Settings > Pages:**
- Custom domain: `petnudge.fr`
- Enforce HTTPS: Enabled

### Deploy Changes

```bash
cd /Users/lupudragos/Desktop/Taillogs/taillogs-website

# Check status
git status

# Add all changes
git add -A

# Commit
git commit -m "Update website with new design"

# Push to GitHub
git push

# Changes will be live within 1-2 minutes
```

## Adding Screenshots (Optional)

See `assets/README.md` for instructions on adding app screenshots.

## Customization

### Colors

Edit CSS custom properties in `styles.css`:
```css
:root {
  --color-primary: #FF6B35;      /* Orange */
  --color-secondary: #4ECDC4;    /* Teal */
  --color-gray-900: #0A0A0A;     /* Near black */
}
```

### Translations

Edit translations in `script.js`:
```javascript
const translations = {
  en: { ... },
  fr: { ... }
};
```

### Adding a New Language

1. Add language object to `translations` in `script.js`
2. Update `currentLang` detection logic
3. Add language option to toggle button

## Tech Stack

- HTML5 (semantic markup)
- CSS3 (custom properties, flexbox, grid)
- Vanilla JavaScript (no dependencies)
- GitHub Pages (hosting)

## Performance

- No external fonts (uses system font stack)
- No heavy frameworks
- Minimal JavaScript
- Optimized for Core Web Vitals

## Contact

support@petnudge.fr
