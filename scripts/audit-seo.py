#!/usr/bin/env python3
"""Read-only SEO checks for all static routes, with optional deployed HTTP checks.

python3 scripts/audit-seo.py [--json] [--strict] [--live]
Uses only the Python standard library. Missing recommended article/social
fields are warnings; broken canonical, crawl, schema and sitemap contracts
are errors. This is not Google's Rich Results Test or an indexing guarantee.
"""

import argparse
from collections import Counter, defaultdict
from concurrent.futures import ThreadPoolExecutor
from datetime import date, datetime
from html.parser import HTMLParser
import json
from pathlib import Path
import re
from urllib.parse import unquote, urljoin, urlsplit
from urllib.request import Request, urlopen
from urllib.error import HTTPError
from urllib.robotparser import RobotFileParser
import xml.etree.ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "https://petnudge.fr"
EXCLUDE = {".git", ".playwright-mcp", "node_modules", "graphify-out"}
PRIVATE = {"404.html", "pet.html", "success.html", "tag-codes.html"}
ARTICLE_TYPES = {"Article", "BlogPosting", "NewsArticle"}
IMAGE_KEYS = {"image", "logo", "thumbnailUrl", "screenshot"}


def expected_url(path):
    relative = path.relative_to(ROOT).as_posix()
    if relative.endswith("index.html"):
        relative = relative[:-10]
    return ORIGIN + "/" + relative


def local_file(url, source=None):
    parts = urlsplit(url)
    if parts.scheme and parts.scheme not in {"http", "https"}:
        return None
    if parts.netloc and parts.hostname not in {"petnudge.fr", "www.petnudge.fr"}:
        return None
    path = unquote(parts.path)
    target = ROOT / path.lstrip("/") if path.startswith("/") or parts.netloc else (source.parent if source else ROOT) / path
    target = target.resolve()
    if target.is_dir():
        target /= "index.html"
    if not target.exists() and not target.suffix and target.with_suffix(".html").exists():
        target = target.with_suffix(".html")
    return target


class Page(HTMLParser):
    def __init__(self, path, source=None):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.source = source if source is not None else path.read_text(encoding="utf-8")
        self.lang = ""
        self.titles = []
        self.meta = defaultdict(list)
        self.canonicals = []
        self.alternates = []
        self.images = []
        self.jsonld = []
        self.videos = 0
        self._capture = None
        self._chunks = []
        self.feed(self.source)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html":
            self.lang = a.get("lang", "")
        if tag == "title":
            self._capture, self._chunks = "title", []
        if tag == "script" and a.get("type", "").lower() == "application/ld+json":
            self._capture, self._chunks = "jsonld", []
        if tag == "meta":
            self.meta[(a.get("name") or a.get("property") or "").lower()].append(a.get("content", ""))
        if tag == "link":
            rel = a.get("rel", "").lower().split()
            if "canonical" in rel:
                self.canonicals.append(a.get("href", ""))
            if "alternate" in rel and a.get("hreflang"):
                self.alternates.append((a["hreflang"], a.get("href", "")))
        if tag == "img":
            self.images.append(a)
        if tag == "video":
            self.videos += 1

    def handle_endtag(self, tag):
        if (tag, self._capture) in {("title", "title"), ("script", "jsonld")}:
            (self.titles if self._capture == "title" else self.jsonld).append("".join(self._chunks).strip())
            self._capture = None

    def handle_data(self, value):
        if self._capture:
            self._chunks.append(value)

    @property
    def noindex(self):
        return any(re.search(r"\b(noindex|none)\b", value.lower()) for key in ("robots", "googlebot") for value in self.meta[key])

    @property
    def canonical(self):
        return self.canonicals[0] if self.canonicals else ""


def nodes(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from nodes(child)
    elif isinstance(value, list):
        for child in value:
            yield from nodes(child)


def types(node):
    value = node.get("@type", [])
    return {value} if isinstance(value, str) else set(value)


def image_urls(value):
    if isinstance(value, str):
        yield value
    elif isinstance(value, list):
        for item in value:
            yield from image_urls(item)
    elif isinstance(value, dict):
        for key in ("url", "contentUrl", "thumbnailUrl"):
            if value.get(key):
                yield from image_urls(value[key])


def run_audit():
    paths = sorted(p.resolve() for p in ROOT.rglob("*.html") if not EXCLUDE.intersection(p.relative_to(ROOT).parts))
    pages = {p: Page(p) for p in paths if not p.name.startswith("google")}
    findings = []
    media = set()
    schema_types = Counter()
    article_count = 0
    robots_text = (ROOT / "robots.txt").read_text() if (ROOT / "robots.txt").exists() else ""
    robots = RobotFileParser()
    robots.parse(robots_text.splitlines())

    def issue(kind, path, detail="", level="error"):
        findings.append({"level": level, "kind": kind, "page": str(path.relative_to(ROOT)) if isinstance(path, Path) else path, "detail": detail})

    def image_check(url, path, context):
        if not url or url.startswith("data:"):
            return
        if "r2.dev" in url:
            issue("retired_r2_image", path, {"context": context, "url": url})
        target = local_file(url, path)
        if target is None:
            return
        if not target.is_file():
            issue("missing_image", path, {"context": context, "url": url})
            return
        absolute = urljoin(expected_url(path), url)
        media.add(absolute)
        if not robots.can_fetch("Googlebot-Image", absolute):
            issue("image_blocked_robots", path, absolute)
        if context != "img" and not url.startswith(ORIGIN + "/"):
            issue("metadata_image_not_absolute", path, {"context": context, "url": url}, "warning")

    public = {path: page for path, page in pages.items() if not page.noindex}
    for path, page in pages.items():
        url = expected_url(path)
        if path.name in PRIVATE and not page.noindex:
            issue("private_page_missing_noindex", path)
        if not page.noindex:
            if len(page.canonicals) != 1:
                issue("canonical_count", path, len(page.canonicals))
            elif page.canonical != url:
                issue("canonical_not_self", path, {"actual": page.canonical, "expected": url})
            if len(page.titles) != 1 or not page.titles[0]:
                issue("title_missing_or_multiple", path, page.titles)
            if len(page.meta["description"]) != 1 or not page.meta["description"][0].strip():
                issue("description_missing_or_multiple", path, page.meta["description"])
            if not robots.can_fetch("Googlebot", url):
                issue("indexable_page_blocked_robots", path, url)
            for key in ("og:title", "og:description", "og:url", "og:image", "twitter:card", "twitter:image"):
                if not any(page.meta[key]):
                    issue("social_metadata_missing", path, key, "warning")
            if page.meta["og:url"] and page.meta["og:url"][0] != page.canonical:
                issue("og_url_not_canonical", path, page.meta["og:url"][0], "warning")
        elif not robots.can_fetch("Googlebot", url):
            issue("noindex_not_crawlable", path, "robots.txt prevents Google from reading the noindex directive", "warning")
        for key in ("og:image", "og:image:url", "twitter:image", "twitter:image:src"):
            for image in page.meta[key]:
                image_check(image, path, key)
        for image in page.images:
            if "alt" not in image:
                issue("image_missing_alt", path, image.get("src", ""))
            if image.get("src"):
                image_check(image["src"], path, "img")
        article_nodes = []
        for block in page.jsonld:
            try:
                data = json.loads(block)
            except (ValueError, TypeError) as error:
                issue("jsonld_parse", path, str(error))
                continue
            for node in nodes(data):
                node_types = types(node)
                schema_types.update(node_types)
                for key in IMAGE_KEYS:
                    for image in image_urls(node.get(key)):
                        image_check(image, path, "JSON-LD " + key)
                if node_types & ARTICLE_TYPES:
                    article_count += 1
                    article_nodes.append(node)
                    for key in ("headline", "author", "publisher", "image", "datePublished", "dateModified", "mainEntityOfPage", "inLanguage"):
                        if not node.get(key):
                            issue("article_property_missing", path, key, "warning")
                    if node.get("inLanguage") and node["inLanguage"].lower() != page.lang.lower():
                        issue("schema_language_mismatch", path, {"schema": node["inLanguage"], "html": page.lang})
                    entity = node.get("mainEntityOfPage")
                    entity_url = entity.get("@id") or entity.get("url") if isinstance(entity, dict) else entity
                    if entity_url and entity_url != page.canonical:
                        issue("article_url_not_canonical", path, entity_url)
                    for image in image_urls(node.get("image")):
                        if urlsplit(image).path in {"/logo.webp", "/logo.png", "/favicon.ico", "/apple-touch-icon.png"}:
                            issue("article_image_is_logo", path, image, "warning")
                for key in ("datePublished", "dateModified", "uploadDate"):
                    if not node.get(key):
                        continue
                    try:
                        value = datetime.fromisoformat(str(node[key]).replace("Z", "+00:00")).date()
                        if value > date.today():
                            issue("schema_date_in_future", path, {key: node[key]})
                    except ValueError:
                        issue("schema_invalid_date", path, {key: node[key]})
                if node.get("dateModified") and node.get("datePublished") and str(node["dateModified"])[:10] < str(node["datePublished"])[:10]:
                    issue("schema_modified_before_published", path, node.get("dateModified"))
                for key in ("aggregateRating", "review"):
                    if key in node:
                        issue("review_claim_requires_evidence", path, key, "warning")
        if path.relative_to(ROOT).parts[0] == "blog" and path != ROOT / "blog/index.html" and not article_nodes and not page.noindex:
            issue("article_schema_missing", path, "No Article, BlogPosting or NewsArticle node", "warning")
        if page.alternates:
            alt_codes = Counter(code.lower() for code, _ in page.alternates)
            for code, count in alt_codes.items():
                if count > 1:
                    issue("hreflang_duplicate_code", path, code)
            if not any(code.lower() == page.lang.lower() and target == page.canonical for code, target in page.alternates):
                issue("hreflang_missing_self", path, page.lang)
            for code, target_url in page.alternates:
                if not re.fullmatch(r"[a-zA-Z]{2}(?:-[a-zA-Z]{2,4}){0,2}|x-default", code):
                    issue("hreflang_invalid_format", path, code)
                if not target_url.startswith("https://"):
                    issue("hreflang_not_absolute_https", path, target_url)
                target = local_file(target_url, path)
                if target is None:
                    continue
                other = pages.get(target)
                if other is None:
                    issue("hreflang_missing_target", path, target_url)
                    continue
                if other.noindex:
                    issue("hreflang_target_noindex", path, target_url)
                if other.canonical != target_url:
                    issue("hreflang_target_not_canonical", path, target_url)
                if code != "x-default" and code.lower() != other.lang.lower():
                    issue("hreflang_target_language_mismatch", path, {"hreflang": code, "target_lang": other.lang, "url": target_url})
                if not any(back == page.canonical and back_code.lower() == page.lang.lower() for back_code, back in other.alternates):
                    issue("hreflang_missing_reciprocal", path, target_url)
    for label, getter in (("canonical", lambda p: p.canonical), ("title", lambda p: p.titles[0] if p.titles else ""), ("description", lambda p: p.meta["description"][0] if p.meta["description"] else "")):
        groups = defaultdict(list)
        for path, page in public.items():
            value = getter(page).strip()
            if value:
                groups[value].append(path.relative_to(ROOT).as_posix())
        for value, group in groups.items():
            if len(group) > 1:
                issue("duplicate_" + label, group[0], {"value": value, "pages": group}, "error" if label == "canonical" else "warning")

    sitemap_urls = []
    seen_maps = set()
    queue = [ROOT / "sitemap.xml"]
    while queue:
        sitemap = queue.pop()
        if sitemap in seen_maps:
            continue
        seen_maps.add(sitemap)
        try:
            tree = ET.parse(sitemap).getroot()
        except (ET.ParseError, OSError) as error:
            issue("sitemap_parse", sitemap, str(error))
            continue
        for node in tree:
            local = node.tag.split("}")[-1]
            if local not in {"url", "sitemap"}:
                continue
            loc = next((child.text.strip() for child in node if child.tag.split("}")[-1] == "loc" and child.text), "")
            if local == "sitemap":
                target = local_file(loc)
                if target:
                    queue.append(target)
                else:
                    issue("sitemap_external_child", sitemap, loc)
                continue
            sitemap_urls.append(loc)
            target = local_file(loc)
            page = pages.get(target)
            if not page:
                issue("sitemap_missing_page", sitemap, loc)
            elif page.noindex or target.name in PRIVATE:
                issue("sitemap_private_or_noindex", sitemap, loc)
            elif loc != page.canonical:
                issue("sitemap_noncanonical", sitemap, {"url": loc, "canonical": page.canonical})
            for child in node.iter():
                if "sitemap-image" in child.tag and child.tag.endswith("}loc") and child.text:
                    image_check(child.text.strip(), target or sitemap, "image sitemap")
    canonical_set = {p.canonical for p in public.values() if p.canonical}
    for url in sorted(canonical_set - set(sitemap_urls)):
        issue("sitemap_missing_canonical", local_file(url) or "sitemap.xml", url)
    for url, count in Counter(sitemap_urls).items():
        if count > 1:
            issue("sitemap_duplicate_url", "sitemap.xml", url)
    if not any(line.lower().startswith("sitemap:") and ORIGIN + "/sitemap.xml" in line for line in robots_text.splitlines()):
        issue("robots_missing_sitemap", "robots.txt")
    if not robots_text:
        issue("robots_missing", "robots.txt")
    return {
        "summary": {
            "html_files": len(paths), "content_pages": len(pages), "indexable_pages": len(public),
            "noindex_pages": len(pages) - len(public), "sitemap_urls": len(sitemap_urls),
            "article_schemas": article_count, "schema_types": dict(schema_types),
            "pages_with_hreflang": sum(bool(p.alternates) for p in pages.values()),
            "unique_local_images": len(media), "video_elements": sum(p.videos for p in pages.values()),
            "errors": sum(i["level"] == "error" for i in findings),
            "warnings": sum(i["level"] == "warning" for i in findings),
            "finding_counts": dict(Counter(i["kind"] for i in findings)),
        },
        "findings": findings,
        "routes": [{"path": path.relative_to(ROOT).as_posix(), "url": expected_url(path), "canonical": page.canonical,
                    "noindex": page.noindex, "title": page.titles[0] if page.titles else "", "lang": page.lang,
                    "hreflang": page.alternates} for path, page in pages.items()],
        "local_images": sorted(media), "sitemap_urls": sitemap_urls,
    }


def live_audit(result):
    jobs = [(route["url"], "page", route) for route in result["routes"]]
    jobs += [(url, "image", None) for url in result["local_images"]]
    jobs += [(ORIGIN + "/robots.txt", "robots", None), (ORIGIN + "/sitemap.xml", "sitemap", None)]
    jobs += [(url, "redirect", None) for url in ("http://petnudge.fr/", "http://www.petnudge.fr/", "https://www.petnudge.fr/")]

    def fetch(job):
        url, kind, route = job
        row = {"url": url, "kind": kind, "errors": []}
        try:
            request = Request(url, headers={"User-Agent": "PetNudge-SEO-Audit/1.0", "Cache-Control": "no-cache"})
            with urlopen(request, timeout=20) as response:
                body = response.read()
                row.update(status=response.status, final_url=response.url, content_type=response.headers.get("Content-Type", ""))
                if response.status != 200:
                    row["errors"].append("HTTP status is not 200")
                if kind == "redirect" and response.url != ORIGIN + "/":
                    row["errors"].append("Domain/protocol variant did not resolve to the HTTPS canonical origin")
                if kind == "image" and not row["content_type"].startswith("image/"):
                    row["errors"].append("Image URL did not return an image content type")
                if kind == "page":
                    page = Page(ROOT / route["path"], body.decode("utf-8", errors="replace"))
                    if page.canonical != route["canonical"]:
                        row["errors"].append("Deployed canonical differs from local")
                    if page.noindex != route["noindex"]:
                        row["errors"].append("Deployed robots directive differs from local")
                    if not page.titles or page.titles[0] != route["title"]:
                        row["errors"].append("Deployed title differs from local")
                    if not route["noindex"] and "noindex" in response.headers.get("X-Robots-Tag", "").lower():
                        row["errors"].append("Indexable page receives X-Robots-Tag noindex")
                    for block in page.jsonld:
                        try:
                            json.loads(block)
                        except ValueError:
                            row["errors"].append("Deployed JSON-LD fails parsing")
                if kind == "sitemap":
                    tree = ET.fromstring(body)
                    deployed = {child.text.strip() for node in tree if node.tag.endswith("}url") for child in node if child.tag.endswith("}loc") and child.text}
                    if deployed != set(result["sitemap_urls"]):
                        row["errors"].append("Deployed sitemap URL coverage differs from local")
                if kind == "robots":
                    parser = RobotFileParser()
                    parser.parse(body.decode("utf-8").splitlines())
                    for expected in result["routes"]:
                        if not expected["noindex"] and not parser.can_fetch("Googlebot", expected["url"]):
                            row["errors"].append("Live robots blocks " + expected["url"])
        except HTTPError as error:
            row.update(status=error.code)
            row["errors"].append(str(error))
        except Exception as error:
            row["errors"].append(type(error).__name__ + ": " + str(error))
        return row

    with ThreadPoolExecutor(max_workers=6) as pool:
        checks = list(pool.map(fetch, jobs))
    return {"checked": len(checks), "failures": sum(bool(c["errors"]) for c in checks), "checks": checks}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--json", action="store_true")
    parser.add_argument("--strict", action="store_true", help="Exit 1 for errors; recommendations remain warnings.")
    parser.add_argument("--live", action="store_true", help="GET deployed pages, media, robots, and sitemap, and compare metadata to this checkout.")
    args = parser.parse_args()
    result = run_audit()
    if args.live:
        result["live"] = live_audit(result)
    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(json.dumps(result["summary"], ensure_ascii=False, indent=2))
        for level in ("error", "warning"):
            findings = [i for i in result["findings"] if i["level"] == level]
            if findings:
                print(f"\n{level.upper()} findings (first 20 of {len(findings)}; --json lists all):")
                for finding in findings[:20]:
                    print(json.dumps(finding, ensure_ascii=False))
        if args.live:
            print("\nLive checks: " + json.dumps({k: v for k, v in result["live"].items() if k != "checks"}))
            for check in result["live"]["checks"]:
                if check["errors"]:
                    print(json.dumps(check, ensure_ascii=False))
    if args.strict and (result["summary"]["errors"] or result.get("live", {}).get("failures")):
        raise SystemExit(1)


if __name__ == "__main__":
    main()
