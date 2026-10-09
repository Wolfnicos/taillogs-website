# Blog SEO audit — 2026-10-09

## Coverage and upstream preservation

- Audited all 190 blog HTML pages: 189 articles and the journal index, in seven languages.
- Imported the nine new articles and nine byte-identical Markdown mirrors from `origin/main` at `0afd206`.
- Refreshed the bodies of the four upstream-updated articles while retaining the new editorial template. A paragraph comparison preserved all 333 paragraphs across the 13 imported/refreshed articles.
- The index includes ordinary static HTML links to all 187 indexable articles. Search and pagination only enhance that existing HTML; article content does not depend on JavaScript.
- Two unrelated posts remain available by URL with `noindex, follow` and are omitted from discovery and the sitemap:
  - `/blog/guide-complet-maitriser-le-seo-pour-votre-site-en-2026.html`
  - `/blog/comprendre-le-concept-de-generic-guide-strategique-2026.html`

## Metadata and structured data

All 190 pages have unique titles and descriptions, a self-canonical URL, language-correct Open Graph locale, Open Graph and Twitter metadata, and explicit crawler preview directives. Thirteen truncated or overstated descriptions were rewritten as complete, factual summaries. All 189 articles have valid Article and BreadcrumbList JSON-LD, matching headline, description, canonical URL, language, publisher, and main-entity URL.

Existing publication dates were retained from the source schema or original publication meta tag and explicitly labelled as publication dates on the page. No dates were assigned from the redesign date. There are 166 retained source modification dates; 20 conflicting modification values were omitted, and three articles never supplied one. The conflicting source editorial dates are recorded below for publisher verification.

The original source explicitly named PetNudge as organization author on 129 articles; those declarations were retained and linked to the organization homepage. Sixty articles (57 generated flat articles and three older directory articles) did not identify an author. Their schema records PetNudge as publisher without inventing an author; the visible generic team byline was changed to the publisher brand. A real editor can later add verified attribution.

The 22 existing multilingual groups, covering 114 pages, have valid language codes, resolvable canonical destinations, self-references and reciprocal links. Ten self-only alternate declarations were removed. Similar but independently written French and English articles were not labelled as translations. The one old FAQPage schema was removed; its visible content remains.

## Images and video: verified limits

Article imagery was removed in the editorial redesign. The first automated check returned HTTP 403 for 188 remote image URLs with Python's default user agent. A later check of the current upstream content returned HTTP 200 for all 228 unique image URLs with a browser user agent. Therefore, these images must **not** be described as definitively broken or unavailable to ordinary visitors. The current implementation deliberately uses the text-led editorial layout, with no external article image references.

A contact-sheet review inspected all 228 upstream images. The set contains widespread subject mismatches: factory workers in cat sterilization articles, horses and office meetings in puppy education, dogs in cat-food articles, a computer power supply in a dog-nutrition article, sports medals standing in for NFC tags, and payment terminals or unrelated street scenes in NFC guides. Some synthetic pictures also have implausible animal/clothing combinations. These are concrete editorial reasons to remove those illustrations.

Not every source photograph is poor. Several dog portraits are acceptable generic covers. Two potentially reusable images were identified: the veterinarian examining a cat in `soins-veterinaires-francais.html` (source image ID `b256c7c0-e136-4640-9e66-9db3c7dab881`) and the cat being petted in `meilleurs-produits-pour-animaux-de-compagnie-france.html` (cover ID `07ef5b75-ebf7-49c8-8254-436639b6a22a`). They were not restored in this release because the chosen editorial system is consistently text-led. They remain candidates for a deliberate future image selection; the veterinarian photo must not be presented as a named clinic or named expert without evidence.

Every blog page supplies the existing 1024 × 1024 PetNudge logo as an explicitly labelled brand icon for a Twitter `summary` card and Open Graph sharing. It is not declared as an article content image. `Article.image` is omitted because no representative editorial images remain in those articles. Google recommends relevant article images and specifically advises against using logos as the Article image. The absence of representative images is a genuine enhancement opportunity, not something to hide with unrelated stock images or invented media.

There are no video elements in the blog, and no VideoObject schema was invented. No blog video indexing eligibility is claimed.

## Validation

- `python3 scripts/audit-seo.py --strict`: zero errors after sitemap regeneration.
- The validator reports 272 optional Article-property gaps: 189 absent representative images, 60 unknown authors, and 23 absent modification dates. These intentional omissions avoid unsupported metadata.
- `python3 scripts/audit-site.py`: zero broken assets, page links or fragment links, and no document-structure errors.
- Static index coverage: 187 distinct links for 187 indexable articles; no orphaned indexable article.
- JSON-LD parses successfully; canonical URLs, declared languages, publication dates and hreflang destinations match their pages.

## Remaining editorial work

Technical markup cannot verify the original article claims. Some inherited insurance/nutrition/health articles contain unsourced statistics, outdated year references, or anonymous comparison products such as “Mutuelle A”. This pass preserved the publisher's current prose. Such material needs a substantive editorial and source review before any claim of medical or financial authority, and before presenting missing author or review credentials as established.

The original publication dates and the source's internal editorial dates cannot be independently certified from HTML alone. Conflicting modification metadata was omitted rather than inventing a corrected date. Search Console URL Inspection and the Rich Results Test should be run against deployed URLs; crawlability and valid metadata do not guarantee indexing, rich results, image placement or rankings.

## Source date conflicts

| Article | Source publication | Omitted schema modification | Visible editorial update |
| --- | --- | --- | --- |
| `blog/alternatives-gratuites-a-petnudge-pour-l-education-canine.html` | 2026-08-06 | 2026-08-06 | 2026-07-24 |
| `blog/assurance-animaux-belgique-2026-prix-meilleures-offres.html` | 2026-08-06 | 2026-08-06 | 2026-06-12 |
| `blog/assurance-animaux-domestiques-prix-belgique-2026.html` | 2026-08-06 | 2026-08-06 | 2026-05-27 |
| `blog/assurance-animaux-pas-chere-belgique-2026-guide-petnudge.html` | 2026-08-06 | 2026-08-06 | 2026-06-19 |
| `blog/assurance-sante-chien-france-2026-guide-complet-petnudge.html` | 2026-08-21 | 2026-08-21 | 2026-06-17 |
| `blog/avis-assurances-sante-chien-2026-guide-complet-petnudge.html` | 2026-08-06 | 2026-08-06 | 2026-06-15 |
| `blog/avis-assurances-sante-chien-france-2026-les-plus-performantes.html` | 2026-08-06 | 2026-08-06 | 2026-07-06 |
| `blog/choisir-assurance-sante-chien-france-2026-guide-complet.html` | 2026-08-06 | 2026-08-06 | 2026-06-29 |
| `blog/choisir-assurance-sante-chien-france-2026-guide-petnudge.html` | 2026-08-06 | 2026-08-06 | 2026-06-22 |
| `blog/commandes-chiot-en-appartement-tutoriels-efficaces-2026.html` | 2026-08-14 | 2026-08-14 | 2026-08-03 |
| `blog/comparatif-assurances-chien-france-2026-votre-guide.html` | 2026-08-06 | 2026-08-06 | 2026-07-01 |
| `blog/comparatif-croquettes-sans-cereales-chat-2026.html` | 2026-08-28 | 2026-08-28 | 2026-05-25 |
| `blog/croquettes-sans-cereales-chat-comparatif-prix-qualite-2026.html` | 2026-08-28 | 2026-08-28 | 2026-07-03 |
| `blog/dresser-un-chiot-en-appartement-guide-complet-2026.html` | 2026-08-06 | 2026-08-06 | 2026-06-26 |
| `blog/education-du-chiot-en-milieu-urbain-guide-detaille-2026.html` | 2026-08-06 | 2026-08-06 | 2026-07-17 |
| `blog/eduquer-un-chiot-en-appartement-proprete-obeissance-2026.html` | 2026-08-06 | 2026-08-06 | 2026-07-29 |
| `blog/meilleure-assurance-sante-chien-france-2026-le-comparatif.html` | 2026-08-06 | 2026-08-06 | 2026-07-31 |
| `blog/meilleures-croquettes-chien-livrees-belgique-2026.html` | 2026-08-06 | 2026-08-06 | 2026-05-27 |
| `blog/prix-croquettes-chien-belgique-2026-evolution-analyse.html` | 2026-08-06 | 2026-08-06 | 2026-07-22 |
| `blog/sterilisation-chat-2026-couts-avantages-avec-petnudge.html` | 2026-08-06 | 2026-08-06 | 2026-05-25 |

## Primary references

- [Google Search Central: Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article) — only applicable, truthful properties; representative Article images; organization author URLs.
- [Google Search Central: localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions) — self-reference and return links for equivalent language versions.
- [Google Search Central: publication dates](https://developers.google.com/search/docs/appearance/publication-dates) — consistent, meaningful visible and structured dates.
- [Google Search Central: image SEO](https://developers.google.com/search/docs/appearance/google-images) — discoverable, relevant image content.
- [Google Search Central: noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing) — keep pages crawlable so the exclusion directive can be read.
