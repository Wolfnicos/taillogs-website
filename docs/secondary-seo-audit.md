# Secondary-page search readiness

Reviewed 2026-10-09: `shop.html`, `vaccination-tracker.html`, `medication-reminder.html`, `ai-pet-assistant.html`, `privacy.html`, `terms.html`, `success.html`, `404.html`, `pet.html`, and `tag-codes.html`.

## Changes

- The six public indexable pages have unique titles/descriptions, one absolute self-canonical, explicit index/follow directives, and consistent Open Graph/Twitter metadata. Search descriptions are 138–153 characters; titles are 23–50 characters. These lengths are editorial choices, not Google ranking requirements.
- App and legal social cards use the site's new `/images/social-preview.jpg` (1200 × 630). Product sharing and product schema use existing photographs of the physical tag, including `/images/medal-black-bone.webp` (600 × 600), without representing an app promotional image as a physical product.
- The three app landing pages identify the same `https://petnudge.fr/#app` entity, link the actual App Store destination, use the verified free-download offer (`price: 0`), and clarify optional in-app purchases in both schema and visible copy. No fabricated reviews or ratings were added.
- Product schema retains the advertised €19.99 price and free shipping in France. Removed unverified `InStock` availability and an invalid `businessDays` delivery-time object. The schema no longer promises an inventory state or structured delivery estimate unsupported by a stock feed.
- Removed redundant `FAQPage` schema while preserving visible FAQs. Updated FAQ copy to remove unsupported AI accuracy guarantees, automatic veterinary scheduling, official-document acceptance and shared-account notification claims. Added page and breadcrumb entities for indexable pages.
- `pet.html` now explicitly uses `noindex, nofollow, noimageindex`; success, 404 and internal tag-code pages explicitly use `noindex`. Utility pages intentionally have no canonical that could collapse separate pet identifiers or missing URLs into a public profile URL. Sharing metadata is generic and contains no owner details.
- No video elements, YouTube/Vimeo embeds or `VideoObject` markup exist on the reviewed pages. No video schema was invented.

## Verification

All ten pages have exactly one title, description and robots directive. All six indexable pages have exactly one canonical. Every JSON-LD block parses. No secondary schema contains `FAQPage`, reviews, ratings or an unverified availability claim. The three software offers use price zero. Product photos exist locally and their dimensions were inspected.

The shared social-card asset is created by the root task; the final whole-site validator must confirm it exists before deployment. Functional routing scripts, CloudKit configuration, Stripe destination and translation logic are unchanged by this SEO pass.

## Google guidance and limits

Google requires a zero offer price when an app can be downloaded without payment. Its app rich-result documentation also requires a genuine rating or review; descriptive application markup without one must not be presented as guaranteed rich-result eligibility. [Software application documentation](https://developers.google.com/search/docs/appearance/structured-data/software-app)

Google's June 15, 2026 documentation update states that FAQ rich results are no longer displayed. Keeping a readable FAQ is still useful to visitors, but its schema must not be sold as a current rich-result feature. [Google Search documentation updates](https://developers.google.com/search/updates)

A crawler must be able to fetch a page to read its `noindex` directive. The root robots.txt update should therefore allow fetching the utility HTML routes rather than hiding them behind Disallow rules. `noindex` controls search appearance; it is not access control. [Google noindex guidance](https://developers.google.com/search/docs/crawling-indexing/block-indexing)

Product snippets can use an honest Offer without a fabricated review or rating. Recommended fields may produce warnings when omitted, and no schema change guarantees indexing or rich results. [Product snippet documentation](https://developers.google.com/search/docs/appearance/structured-data/product-snippet)
