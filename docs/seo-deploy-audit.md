# Search readiness and deployment audit

Audit date: 9 October 2026. This report separates technical indexability from
optional search presentation features and editorial evidence.

## Scope and baseline

The redesigned local site initially contained 193 HTML files. Nine additional
published articles were recovered from the remote branch before deployment,
bringing the final audit scope to **202 HTML files / 201 content pages**.
Google's verification file is preserved but is not a content page.

The initial sitemap contained 57 URLs, omitted the 132 directory articles,
listed `/blog/index.html` instead of its canonical `/blog/`, and included the
private finder utility. `pet.html` initially lacked an explicit noindex rule.
Missing social previews and incomplete article metadata were widespread;
existing canonical URLs, JSON-LD syntax, dates, and reciprocal language links
did not show defects in the initial scan.

## Validation tool

```sh
python3 scripts/audit-seo.py --strict
python3 scripts/audit-seo.py --json
python3 scripts/audit-seo.py --live --strict
```

The dependency-free, read-only validator checks:

- Canonical count, absolute self-canonical URLs, and canonical uniqueness.
- Unique titles/descriptions, required page descriptions, noindex states for
  the finder, success, 404, and internal tag tools, and Googlebot crawlability.
- JSON-LD parsing, article/main-page URL consistency, language, date validity,
  image existence, retired R2 references, and review claims requiring evidence.
- Local hreflang targets, target language, self references, canonical targets,
  reciprocal links, and noindex conflicts.
- Sitemap canonical coverage, duplicate URLs, private/noindex exclusions, XML
  parsing, image URLs, and robots.txt sitemap discovery.
- Local body/social/structured-data images and Googlebot-Image crawlability.

`--strict` fails technical errors. Missing recommended social/article fields
remain warnings. The tool does not invent author identities or representative
article images to silence these recommendations.

The optional deployed check performs read-only GET requests for every content
route, every unique referenced local image, robots.txt, and sitemap.xml. It
compares deployed titles, canonical and indexing directives with the local
checkout; checks HTTP/image content types and JSON-LD; verifies live sitemap
coverage; and tests HTTP/www variants against the HTTPS canonical origin.

## Editorial metadata policy

For equivalent translated pages, Google expects fully qualified reciprocal
hreflang references including each page itself. Actual translation clusters
are retained; unrelated articles must not be grouped merely because they have
the same language. [Google's localized-page guidance](https://developers.google.com/search/docs/specialty/international/localized-versions).

Article authors and images are recommended metadata, and must describe the
actual article. Articles without a documented source author or relevant
editorial image keep those optional fields absent. Publisher metadata can
identify PetNudge without fabricating an individual expert or author.
[Google's Article guidance](https://developers.google.com/search/docs/appearance/structured-data/article).

Local image URLs, descriptive alt text, accessible image resources, and
representative social previews are checked. A generic logo is not substituted
for a supposedly representative editorial photograph. There are no video
elements or fabricated VideoObject records.
[Google's image guidance](https://developers.google.com/search/docs/appearance/google-images).

Noindex directives must be crawlable for Google to observe them; robots.txt
blocking is not a substitute for noindex or authentication. The validator
identifies contradictory blocked/noindex states.
[Google's noindex guidance](https://developers.google.com/search/docs/crawling-indexing/block-indexing).

## Local mobile Lighthouse measurements

The official Lighthouse CLI 12.8.2 used its default mobile simulated
network/CPU profile (150 ms RTT, approximately 1.6 Mbps, 4× CPU slowdown). The
Python development server did not provide production compression or caching.

| Category / metric | Initial | After focused fixes |
| --- | ---: | ---: |
| Performance | 71 | 78 |
| Accessibility | 96 | 100 |
| Best practices | 100 | 100 |
| SEO | 100 | 100 |
| FCP | 3.0 s | 2.1 s |
| LCP | 6.6 s | 5.5 s |
| Total blocking time | 0 ms | 0 ms |
| CLS | 0.001 | 0.001 |

The LCP element was the headline text. The run identified six TTF font files,
four blocking CSS requests, and an oversized mobile dog photograph. Contrast
failures affected secondary numbering, price annotations, the lost-mode
banner, and muted footer text. WOFF2 conversion reduced the font payload by
59.7%, critical fonts were preloaded, and the contrast failures were corrected.
Exactly one focused rerun confirmed the improvement and 100 accessibility.
Remaining local performance cost includes render-blocking CSS and image
delivery. These laboratory runs are not real-user Core Web Vitals data and do
not measure INP; production compression/cache delivery warrants its own check.

## Deployment smoke plan

After the deployment is available, run the deployed validator once; retry only
specific cache/propagation failures. Confirm that all canonical pages and media
return successful responses, the new sitemap matches the final local URLs,
private routes remain noindex, HTTP/www resolve to HTTPS, and a genuinely
missing URL returns a 404 with the custom error page. Search Console sitemap
submission and the homepage indexing request are handled by the deployment
owner and must be reported as submitted only after actual confirmation.

## Final local result

`python3 scripts/audit-seo.py --strict` **passes with zero errors**:

- 202 HTML files, including 201 content pages and the unchanged verification file.
- 195 indexable pages and exactly 195 canonical sitemap URLs.
- Six explicit noindex routes: four utilities and two unrelated legacy posts.
- 189 Article schemas; 114 pages participate in actual hreflang clusters.
- 21 unique referenced local images; no video elements or VideoObject claims.
- No broken canonical, schema, language-reference, sitemap, or media contracts.
- No fabricated review/rating schema; source-missing optional article metadata
  remains absent: 189 images, 60 authors, and 23 modification dates.

`.nojekyll` makes the authored static HTML authoritative at deployment. Internal
documentation, scripts, and Markdown source mirrors are excluded from crawling.
The plain HTTP domain still needs an HTTPS redirect at the correct Cloudflare
zone; the HTTPS canonical site works, and www HTTPS already redirects. This
edge configuration is tracked separately from the deployable source changes.

Production HTTP verification, a production Lighthouse measurement, and actual
Search Console submissions follow deployment and are reported by the task
owner. Search indexing and rich-result presentation remain Google's decisions;
this audit establishes only the tested technical state.
