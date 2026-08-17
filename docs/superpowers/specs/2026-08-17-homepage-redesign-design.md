# PetNudge Homepage Redesign — Design Spec (2026-08-17)

## Decisions (user-approved)
- Medal is **always sold separately at 19,99 €** — never included in any subscription plan. Pricing cards must stop claiming "Tag NFC personnalisé" as an included feature.
- Stack: **static in place** — no build step, GitHub Pages unchanged.
- Scope: **homepage only** (`index.html`). Shop/blog restyle deferred to a later session.

## Goal
A visitor understands in under 8 seconds that they are buying (1) a physical NFC medal, 19,99 € one-time, made in France, and (2) an optional app subscription (7-day trial → 4,99 €/mois or 39,99 €/an) — and what keeps working if they cancel.

## Files
| File | Change |
|---|---|
| `index.html` | Full body rewrite (new sections). Head kept: favicons, JSON-LD (+1 FAQ entry), analytics, preload. Title/description switched to FR (primary market). |
| `home.css` | NEW — homepage-only stylesheet loaded after `styles.css`. All new classes prefixed `pn-`. `styles.css` untouched (shared by all pages). |
| `home-translations.js` | NEW — `home.*` i18n keys for all 9 languages, merged into shared `translations` (same pattern as shop). |
| `home.js` | NEW — scroll-reveal observer + Lost Mode phone demo toggle (~60 lines, reduced-motion aware). |
| `script.js` | One additive line: `window.translations = translations;` — enables the merge pattern and fixes the dormant shop-translations bug. |

## Compatibility contract (things that must keep working)
- Keep classes/ids consumed by shared `script.js`: `.hero` (sticky CTA observer), `.header`, `#lang-toggle`, `#lang-text`, `#menu-btn`, `#mobile-menu`, `.mobile-menu__link`, `.faq__item/__question/__answer`, `.sticky-cta`, footer lang toggle ids.
- Keep LCP preload image `images/hero-heart-wood.webp` as the hero visual.
- Keep all existing i18n keys where copy is unchanged (`nav.*`, `how.*`, `lost.feature.*`, `lost.demo.*`, `features.1–3`, `faq.1–9`, `blog.preview.*`, `footer.*`, `sticky.*`, `pricing.plan/period/cta`). New copy gets new `home.*` keys — never repurpose an old key with new meaning.

## Information architecture (9 sections)
1. **Hero** — H1 « La médaille qui ramène votre animal à la maison. » Sub names the object + price. Dual CTA: `Commander la médaille — 19,99 €` → shop.html, `Essayer l'app gratuitement` → App Store. Trust strip: Fabriquée en France · Étanche (ASA) · Sans app pour celui qui trouve.
2. **Ce que vous achetez** — split: medal card (achat unique, à vous pour toujours) vs app card (abonnement). Includes explicit "sans abonnement / avec abonnement" checklist. Facts from FAQ 7: direct call + profile keep working after cancel; Lost Mode & advanced features need subscription.
3. **Comment ça marche** — 3 steps, reuses `how.*` keys, real product photos.
4. **Mode Perdu** — CSS phone mockup of the exact finder screen with a Normal ⇄ Perdu interactive toggle. Reuses `lost.demo.*` + `lost.feature.*` keys.
5. **Compagnon santé** — calm single section, 3 cards linking to feature pages (reuses `features.1–3`), privacy note (local-first).
6. **Tarifs transparents** — medal one-time card + monthly/annual app cards (corrected features) + « Si vous annulez » box + explicit "médaille jamais incluse" note.
7. **Boutique teaser** — 4 medal designs, Meshy personalization tease ("Bientôt : médaille unique générée depuis la photo de votre animal" — per brief).
8. **FAQ** — new first question « La médaille est-elle incluse dans l'abonnement ? » + existing 9 (reused keys). JSON-LD FAQPage updated.
9. **Blog preview** (kept for SEO) + footer/sticky CTA/cookie banner unchanged.

## Design system (home.css)
- Tokens prefixed `--pn-*`, structured so a dark theme is a small follow-up (not activated in this phase).
- Color: warm paper `#FAF9F7` bg, ink `#17171A`, secondary `#55555C`, hairline `#E9E7E2`, brand orange `#FF6B35` reserved for primary CTAs, `#C7400F` for orange text (WCAG AA), red `#FF3B30` only for Lost Mode.
- Type: system stack (perf rule kept), fluid `clamp()` display sizes, −0.03em tracking on display, 1.6 body leading.
- Depth: layered soft shadows `0 1px 2px rgba(20,16,12,.04), 0 8px 24px rgba(20,16,12,.06)`; 20–28px radii.
- Motion: CSS transitions + `.pn-reveal → .is-in` scroll reveal; hover lifts; all gated behind `prefers-reduced-motion`.

## Out of scope (explicit)
- Dark mode activation (tokens ready only). Shop/blog/feature-page restyle. Medal configurator. Any change to `styles.css`.

## Risks
- Homepage `<title>`/description switch EN→FR may shift SERP snippets (reversible, aligned with FR-primary strategy).
- Old homepage-only CSS in `styles.css` becomes dead weight for index.html (kept to protect other pages that share it).
