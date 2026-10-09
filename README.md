# PetNudge website

Static, multilingual website for [PetNudge](https://petnudge.fr), the iPhone pet health and NFC identification app. Hosted on GitHub Pages; no framework, package installation or build step.

## Preview

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. Serve from the repository root because shared assets use absolute paths.

## Design and page structure

The site uses a warm ivory and olive palette, locally hosted DM Sans and Instrument Serif, actual App Store screenshots, CSS 3D perspective, pointer interaction and scroll reveals. Motion respects the operating system's reduced-motion preference; content remains readable without JavaScript.

- `index.html`, `home.css`, `home-premium.css`, `home.js`: application-first homepage, interactive app previews, Lost Mode demonstration, plans, medal collection, FAQ and journal.
- `premium.css`, `premium.js`: shared design tokens, fonts, navigation, keyboard menu handling and progressive motion.
- `styles.css`, `script.js`: retained base components and language/FAQ behavior.
- `home-translations.js`, `premium-translations.js`: homepage translations in nine languages. Merge additions into the shared translation dictionary before subsequent language selection.
- `secondary.css`: feature pages, shop, legal pages and utility surfaces. Static English pages declare `data-page-language="en"` so a saved preference cannot mislabel their content.
- `shop.html`, `shop-styles.css`, `shop-translations.js`: product gallery, existing checkout links and localized product information.
- `blog/index.html`, `blog-design.css`, `blog/journal.js`: searchable journal with language and topic filters, progressive pagination and reading navigation. All 189 article URLs are preserved; 187 on-topic articles appear in discovery. Article bodies keep their own language.
- `pet.html`, `404.html`: existing public pet profile and short-link recovery flow.
- `tag-codes.html`: tag-generation utility.
- `privacy.html`, `terms.html`, `success.html`: supporting pages.

## Verification

```sh
python3 scripts/build-sitemap.py
python3 scripts/audit-site.py --strict
python3 scripts/audit-seo.py --strict
```

The audit walks every HTML file and checks local links, fragments, assets, page structure and App Store destinations. Use `--json` for the complete route inventory. See `docs/redesign-audit.md` for desktop/mobile browser coverage and functional checks.

## Assets

Application screenshots and fonts are hosted locally. Sources and font licenses are recorded in [assets/SOURCES.md](assets/SOURCES.md). Existing physical-product photographs remain in `images/`. The blog uses a text-led layout after a visual review identified many irrelevant remote illustrations.

## Publication

The existing GitHub Pages setup publishes the repository root on the configured branch to `petnudge.fr` (`CNAME`). Local edits do not update the public site until committed and pushed to that branch.
