#!/usr/bin/env python3
"""Generate canonical page/image sitemap and an accurate llms.txt index.

Only local, indexable, self-canonical HTML pages enter the sitemap. Excludes
verification, private/utility/noindex routes, supports image discovery, and
uses real Git modification dates. Uncommitted changes receive today's date.
No third-party packages or network required. Run before publishing.
"""
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
import subprocess
from urllib.parse import urljoin, urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://petnudge.fr/'
EXCLUDED = {'404.html','pet.html','success.html','tag-codes.html','google6470ab0c57e10f5e.html'}
NS = 'http://www.sitemaps.org/schemas/sitemap/0.9'
IMG = 'http://www.google.com/schemas/sitemap-image/1.1'
ET.register_namespace('', NS)
ET.register_namespace('image', IMG)

class Document(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.canonical=''; self.noindex=False; self.images=[]; self.title=''; self.in_title=False
        self.feed(text)
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='title': self.in_title=True
        if tag=='link' and 'canonical' in a.get('rel','').split(): self.canonical=a.get('href','')
        if tag=='meta' and a.get('name','').lower() in {'robots','googlebot'} and 'noindex' in a.get('content','').lower(): self.noindex=True
        if tag=='img' and a.get('src') and a.get('alt','').strip(): self.images.append(a['src'])
    def handle_endtag(self,tag):
        if tag=='title': self.in_title=False
    def handle_data(self,data):
        if self.in_title:self.title+=data

def run(*args):
    return subprocess.check_output(['git',*args],cwd=ROOT,text=True).strip()

def main():
    changed=set(run('diff','--name-only','HEAD').splitlines())|set(run('ls-files','--others','--exclude-standard').splitlines())
    today=datetime.now(timezone.utc).date().isoformat()
    tree=ET.Element(f'{{{NS}}}urlset'); records=[]; image_count=0
    for p in sorted(ROOT.rglob('*.html')):
        relative=p.relative_to(ROOT)
        if any(part.startswith('.') or part in {'node_modules'} for part in relative.parts) or relative.as_posix() in EXCLUDED:continue
        doc=Document(p.read_text())
        if doc.noindex or not doc.canonical.startswith(BASE):continue
        route=relative.as_posix()
        expected=BASE+(route[:-10] if route.endswith('index.html') else route)
        if doc.canonical!=expected:continue
        stamp=today if route in changed else run('log','-1','--format=%cs','--',route) or today
        url=ET.SubElement(tree,f'{{{NS}}}url');ET.SubElement(url,f'{{{NS}}}loc').text=doc.canonical;ET.SubElement(url,f'{{{NS}}}lastmod').text=stamp
        seen=set()
        for src in doc.images:
            absolute=urljoin(doc.canonical,src)
            parsed=urlsplit(absolute)
            if parsed.hostname!='petnudge.fr' or 'logo' in parsed.path or 'icon' in parsed.path:continue
            absolute=parsed._replace(query='',fragment='').geturl()
            if absolute in seen or not (ROOT/parsed.path.lstrip('/')).is_file():continue
            seen.add(absolute); image_count+=1
            entry=ET.SubElement(url,f'{{{IMG}}}image');ET.SubElement(entry,f'{{{IMG}}}loc').text=absolute
        records.append((doc.canonical,' '.join(doc.title.split()),p))
    ET.indent(tree,space='  ')
    ET.ElementTree(tree).write(ROOT/'sitemap.xml',encoding='UTF-8',xml_declaration=True)
    with (ROOT/'sitemap.xml').open('a') as f:f.write('\n')
    lines=['# PetNudge','','> PetNudge is an iPhone app for pet health records, reminders and NFC identification, with an optional personalized physical medal.','','## Official pages','']
    for url,title,path in records:
        if '/blog/' not in url:lines.append(f'- [{title}]({url})')
    lines+=['- [PetNudge on the App Store](https://apps.apple.com/app/id6756539814)','','## Journal','']
    for url,title,path in records:
        if '/blog/' not in url:continue
        mirror=path.with_suffix('.md')
        suffix=f' — [Markdown]({BASE+mirror.relative_to(ROOT).as_posix()})' if path.name!='index.html' and mirror.exists() else ''
        lines.append(f'- [{title}]({url}){suffix}')
    (ROOT/'llms.txt').write_text('\n'.join(lines)+'\n')
    print(f'Sitemap: {len(records)} canonical pages, {image_count} image references. llms.txt refreshed.')

if __name__=='__main__':main()
