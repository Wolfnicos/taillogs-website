#!/usr/bin/env python3
"""Read-only static audit of every published HTML route; no dependencies required.

Usage: python3 scripts/audit-site.py [--json] [--strict]
Asset references include HTML src/href/poster/srcset and CSS url(). Local link
fragments are checked across documents. External services and JS-created DOM
require browser checks and are deliberately not treated as validated here.
"""

import argparse
from collections import Counter
from html.parser import HTMLParser
import json
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
LOCAL_HOSTS = {"petnudge.fr", "www.petnudge.fr", "lupudragos.github.io"}
SKIP_DIRS = {".git", ".playwright-mcp", "node_modules", "graphify-out"}
CSS_URL = re.compile(r"url\(\s*['\"]?([^)'\"]+)['\"]?\s*\)", re.I)


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.ids = Counter()
        self.refs = []
        self.lang = ""
        self.h1 = 0
        self.main = 0
        self.title = ""
        self.in_title = False
        self.in_style = False
        self.stylesheets = []
        self.scripts = []
        self.images = []
        self.app_links = []
        self.issues = []
        self.feed(path.read_text(encoding="utf-8"))

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        line = self.getpos()[0]
        if a.get("id"):
            self.ids[a["id"]] += 1
        if tag == "a" and a.get("name"):
            self.ids[a["name"]] += 1
        if tag == "html":
            self.lang = a.get("lang", "")
        if tag == "h1":
            self.h1 += 1
        if tag == "main" or a.get("role") == "main":
            self.main += 1
        if tag == "title":
            self.in_title = True
        if tag == "style":
            self.in_style = True
        if tag == "link" and "stylesheet" in a.get("rel", "").split():
            self.stylesheets.append(a.get("href", ""))
        if tag == "script" and a.get("src"):
            self.scripts.append(a["src"])
        if tag == "img":
            self.images.append(a.get("src", ""))
            if "alt" not in a:
                self.issues.append({"kind": "image_missing_alt", "line": line})
        for attr in ("src", "href", "poster"):
            if attr not in a:
                continue
            url = a[attr]
            kind = "link" if tag == "a" and attr == "href" else "asset"
            # Canonical, hreflang, DNS hints and preconnects are metadata.
            if tag == "link" and not set(a.get("rel", "").split()) & {"stylesheet", "icon", "apple-touch-icon", "manifest", "preload"}:
                continue
            self.refs.append((url, kind, line))
            if tag == "a" and "apps.apple.com/" in url:
                self.app_links.append(url)
        for candidate in a.get("srcset", "").split(","):
            if candidate.strip():
                self.refs.append((candidate.strip().split()[0], "asset", line))
        for url in CSS_URL.findall(a.get("style", "")):
            self.refs.append((url, "asset", line))

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        if tag == "style":
            self.in_style = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if self.in_style:
            for match in CSS_URL.finditer(data):
                self.refs.append((match.group(1), "asset", self.getpos()[0] + data.count("\n", 0, match.start())))


def local_target(source, url):
    parsed = urlsplit(url)
    if parsed.scheme and parsed.scheme not in {"http", "https"}:
        return None
    if parsed.netloc and parsed.hostname not in LOCAL_HOSTS:
        return None
    raw = unquote(parsed.path)
    if not raw:
        path = source
    elif raw.startswith("/") or parsed.netloc:
        path = ROOT / raw.lstrip("/")
    else:
        path = source.parent / raw
    path = path.resolve()
    if path.is_dir():
        path /= "index.html"
    # GitHub Pages serves extensionless HTML routes, too.
    if not path.exists() and not path.suffix and path.with_suffix(".html").is_file():
        path = path.with_suffix(".html")
    return path, unquote(parsed.fragment)


def family(path):
    relative = path.relative_to(ROOT)
    if relative.parts[0] != "blog":
        return "root"
    return "blog-directory" if path.name == "index.html" and len(relative.parts) > 2 else "blog-flat"


def audit():
    paths = sorted(p for p in ROOT.rglob("*.html") if not SKIP_DIRS.intersection(p.relative_to(ROOT).parts))
    pages = {p.resolve(): Page(p.resolve()) for p in paths}
    issues = []
    broken_assets = []
    broken_links = []
    broken_fragments = []
    css_refs = []
    for path in sorted(ROOT.rglob("*.css")):
        if SKIP_DIRS.intersection(path.relative_to(ROOT).parts):
            continue
        content = path.read_text(encoding="utf-8")
        for match in CSS_URL.finditer(content):
            line = content.count("\n", 0, match.start()) + 1
            css_refs.append((path, match.group(1), "asset", line))
    refs = [(path, url, kind, line) for path, page in pages.items() for url, kind, line in page.refs] + css_refs
    for path, url, kind, line in refs:
        target = local_target(path, url)
        if target is None:
            continue
        target_path, fragment = target
        detail = {"page": str(path.relative_to(ROOT)), "line": line, "url": url}
        if not target_path.exists():
            (broken_links if kind == "link" else broken_assets).append(detail)
        elif kind == "link" and fragment and target_path in pages and fragment not in pages[target_path].ids:
            broken_fragments.append(detail)
    for path, page in pages.items():
        if path.name.startswith("google"):
            continue  # Search Console verification is intentionally not an HTML document.
        relative = str(path.relative_to(ROOT))
        for issue in page.issues:
            issues.append({"page": relative, **issue})
        for kind, value in (("h1_count", page.h1), ("main_count", page.main)):
            if value != 1:
                issues.append({"page": relative, "kind": kind, "value": value})
        if not page.lang:
            issues.append({"page": relative, "kind": "missing_lang"})
        if not page.title.strip():
            issues.append({"page": relative, "kind": "missing_title"})
        for ident, count in page.ids.items():
            if count > 1:
                issues.append({"page": relative, "kind": "duplicate_id", "id": ident, "count": count})
        if relative == "404.html":
            for url, kind, line in page.refs:
                parsed = urlsplit(url)
                if kind == "asset" and not parsed.scheme and not parsed.netloc and parsed.path and not parsed.path.startswith("/"):
                    issues.append({"page": relative, "kind": "404_relative_asset", "line": line, "url": url})
    return {
        "summary": {
            "html_files": len(pages),
            "content_pages": sum(not p.name.startswith("google") for p in pages),
            "families": dict(Counter(family(p) for p in pages)),
            "languages": dict(Counter(p.lang or "missing" for p in pages.values())),
            "broken_asset_references": len(broken_assets),
            "broken_page_links": len(broken_links),
            "broken_fragments": len(broken_fragments),
            "structure_issues": dict(Counter(i["kind"] for i in issues)),
            "app_destinations": dict(Counter(url for p in pages.values() for url in p.app_links)),
            "pages_without_static_app_link": sum(not p.app_links for path, p in pages.items() if not path.name.startswith("google")),
            "external_image_references": sum(url.startswith(("https://", "http://", "//")) for p in pages.values() for url in p.images),
        },
        "broken_assets": broken_assets,
        "broken_links": broken_links,
        "broken_fragments": broken_fragments,
        "structure_issues": issues,
        "routes": [{
            "path": str(path.relative_to(ROOT)), "family": family(path),
            "lang": p.lang, "title": p.title, "h1": p.h1, "main": p.main,
            "stylesheets": p.stylesheets, "scripts": p.scripts,
            "image_count": len(p.images), "app_links": len(p.app_links),
        } for path, p in pages.items()],
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--json", action="store_true", help="Print full machine-readable route inventory and findings.")
    parser.add_argument("--strict", action="store_true", help="Exit 1 if local links/assets/fragments are broken or content structure has issues.")
    args = parser.parse_args()
    result = audit()
    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(json.dumps(result["summary"], ensure_ascii=False, indent=2))
        for label in ("broken_assets", "broken_links", "broken_fragments", "structure_issues"):
            findings = result[label]
            if findings:
                print(f"\n{label}: {len(findings)} (first 12; use --json for all)")
                for finding in findings[:12]:
                    print(json.dumps(finding, ensure_ascii=False))
    if args.strict and any(result[k] for k in ("broken_assets", "broken_links", "broken_fragments", "structure_issues")):
        raise SystemExit(1)


if __name__ == "__main__":
    main()
