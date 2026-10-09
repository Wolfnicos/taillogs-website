# PetNudge redesign audit

Audit started 9 October 2026. This is an implementation audit for the visual
redesign; it does not verify editorial medical, insurance, or legal claims.

## Coverage and baseline

- All **193 HTML files** inventoried: **192 content pages** and one Google
  verification file. Content comprises 11 root pages and 181 blog pages
  (132 directory articles, 48 flat articles, one index).
- A read-only HTTP HEAD crawl of all 193 corresponding live routes returned
  **193 HTTP 200 responses**, checked 9 October 2026 around 16:09 UTC.
- Initial static scan found **zero missing local assets, zero broken local page
  links, and zero broken fragment links** at their normal route paths.
- Baseline script parsing passed for all **14 distinct script bodies**. Syntax
  validation does not establish runtime correctness.
- All 109 existing static App Store anchors pointed to
  `https://apps.apple.com/app/id6756539814`. The live URL resolves to PetNudge's
  App Store page.
- 94 content pages lacked a static App Store link, including 89 blog pages.
- The blog contained 188 external R2 image references. Those references require
  a visual editorial decision; their presence alone does not establish quality.
- 28 blog pages contained two H1 headings. Five root pages lacked a `main`
  landmark: `404.html`, `pet.html`, `shop.html`, `success.html`, `tag-codes.html`.
- 47 of the 48 generated flat blog articles declared `lang="en"` while displaying
  French content. Most had no common stylesheet, header, or application CTA.
- The blog index displayed only the 48 flat articles, including truncated
  titles and off-topic SEO/generic articles. The 132 directory articles needed
  a coherent discovery surface.
- The sitemap has 57 entries, fewer than the number of content routes. Sitemap
  maintenance is separate from a visual redesign; existing routes must remain.

## Integration risks to preserve or resolve

1. **Translations rewrite markup.** `script.js` and the homepage/shop extension
   scripts assign `textContent` to `[data-i18n]` elements. Put icons and styled
   child elements outside the translated text node, or explicitly update the
   translation mechanism. Otherwise the new design disappears after load.
2. **Article language must remain accurate.** The shared language script sets
   `<html lang>` to the saved/browser language, including on fixed-language
   articles. A redesigned article should preserve its actual content language.
   The old blog filter also used `petnudge_lang`, while the shared language
   picker saves `petnudge-lang`.
3. **Homepage hooks differ.** The old sticky CTA watches `.hero`, while the
   homepage hero used `.pn-hero`; newly named hero sections need matching hooks.
4. **Motion and keyboard navigation need explicit support.** Existing smooth
   scroll ignores reduced-motion preferences and assumes `.header` exists.
   The mobile menu lacks Escape handling, focus containment, and return focus.
   Shared enhancements should degrade cleanly when these components are absent.
5. **404 is also a router.** Its inline `/p/<id>` and `/t/<CODE>` redirects serve
   existing physical pet tags. Preserve them. Relative CSS/logo references in
   the old error page fail when the document is served at a nested missing URL;
   use root-relative resources.
6. **Finder flow is functional, not a demo.** `pet.html` resolves direct profile
   IDs and activated tag codes through CloudKit, renders the owner's call
   action, and displays loading/error/lost states. Preserve those hooks and
   keep primary rescue actions prominent.
7. **Shop checkout is real.** Preserve the existing Stripe destination and the
   product/gallery behavior. Test links without submitting orders.
8. **Utility routes are different.** `tag-codes.html` is an internal noindex
   generator with CSV export; the Google verification file must stay exact.

## Reusable validation

Run from the repository root:

```sh
python3 scripts/audit-site.py
python3 scripts/audit-site.py --json
python3 scripts/audit-site.py --strict
```

The script reads every HTML route and local CSS file. It checks local page and
asset references, in-document and cross-document anchors, H1/main counts,
duplicate IDs, missing image alt attributes, and nested-route-safe 404 assets.
JSON output includes a complete per-route inventory of titles, language,
stylesheets, scripts, image counts, and static app links. It performs no writes
and uses only the Python standard library.

`--strict` fails on any broken local reference or listed structural issue.
Missing app links and external image counts are informational because internal
utilities and finder states have different needs. The static parser does not
execute JavaScript or validate remote services, accessibility contrast,
responsive geometry, animation smoothness, or editorial claims.

Browser regression coverage should include homepage, shop, all three feature
pages, blog index/search/category/language controls, each blog template and
language family, privacy, terms, success, nested 404, pet loading/error/finder
states, and tag generation/CSV. Check desktop and narrow mobile widths,
keyboard navigation, reduced motion, and application CTA destinations.

## Final verification

Verified locally on 9 October 2026 after the shared, homepage, secondary-page,
and blog assets were present:

- `python3 scripts/audit-site.py --strict` **passes** across all 193 HTML files.
  No broken local assets, page links, fragments, duplicate IDs, heading/main
  issues, missing image alt attributes, or relative 404 assets were found.
- **All 192 content routes rendered in isolated headless Chrome at 1440px and
  390px: 384 route/viewport checks.** Every route returned HTTP 200, contained
  one H1 and one main landmark, and produced zero JavaScript runtime errors,
  missing local HTTP resources, or horizontal document overflow.
- Five initial image-decode flags in the concurrent crawl cleared during
  sequential network-idle rechecks. No reproducible broken image remained.
- Additional checks of all 11 root content pages at **320px** found no document
  overflow. A separate check measures the actual logo image/text against header
  actions, because flex items can visually collide without document overflow.
- That header check covered nine homepage languages at 320px and 390px. It
  identified collisions in the long Romanian/German CTA labels at 390px;
  hiding the secondary header CTA below 421px resolved both on recheck. The
  primary hero download action remains visible, with zero document overflow.
- All **14 distinct current JavaScript bodies** (seven external files and seven
  unique inline scripts, excluding JSON-LD) parsed cleanly after the redesign.
- Every public content page now contains the same valid App Store destination;
  the internal noindex tag generator intentionally has none. The finder page's
  application promo is part of the successful-profile state; missing-profile
  states prioritize the error message and home link.
- The initial 188 external R2 blog image references were removed for the
  text-led editorial redesign. The subsequent audit of all 228 unique upstream
  images confirmed many irrelevant illustrations and synthetic artifacts.
  Browser-user-agent requests returned 200, so an earlier automated 403 result
  is not evidence that these images are broken. See `blog-seo-audit.md`.
  The only remaining external image is Apple's official App Store badge.
- All 28 duplicate-H1 issues and five missing-main issues were resolved; the
  47 French article language declarations were corrected.
- The homepage's nine language variants were checked for desktop overflow.
  Reduced-motion verification found no active animation, automatic scroll
  behavior, no hidden reveal content, and no horizontal overflow. The normal
  and lost profile-demo states, screenshot selector, and mobile Escape action
  were also verified by the primary implementation agent.

The following **13 functional checks passed** in a fresh, isolated browser:

1. Blog default French results and pagination from 12 to 24 items.
2. Romanian results, empty search, and reset.
3. Blog category selection and matching visible articles.
4. Accent-insensitive search (`sante`).
5. Mobile menu opening, keyboard focus containment, Escape, and return focus.
6. English directory-article language and collapsible mobile contents links.
7. French flat-article language, single H1, and application link.
8. Shop gallery changes, unchanged Stripe destination, and fixed mobile width.
9. Homepage application preview screen switching and pressed-state updates.
10. FAQ opening and closing with correct expanded state.
11. Homepage Romanian language selection with application CTA icons retained.
12. Finder missing-ID loading-to-error transition.
13. Five unique tag codes generated and a CSV containing five data rows exported.

The crawl checks every route's browser DOM and geometry; it is not a manual
screenshot review of all 384 variants or a field performance measurement.
Valid private pet records, real checkout submission, production deployment,
and editorial claim verification were outside these checks.
