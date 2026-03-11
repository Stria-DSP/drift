#!/usr/bin/env python3
"""
Fetch Max 8 object reference pages from Cycling '74 and save as markdown.
Use these for RAG; one file per object. Run from repo root.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

import requests
import html2text

REPO_ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = REPO_ROOT / "research" / "max8_docs" / "refpages"
BASE_URL = "https://docs.cycling74.com/max8/refpages"

# Objects we care about (from research/max8_reference.md + common M4L)
OBJECTS = [
    "coll",
    "phasor~",
    "thispatcher",
    "snapshot~",
    "iter",
    "multislider",
    "change~",
    "change",
    "trigger",
    "pack",
    "unpack",
    "prepend",
    "makenote",
    "midiout",
    "loadbang",
    "trunc~",
    "line",
    "line~",
    "cycle~",
    "plugout~",
    "newobj",
    "pattr",
    "pattrstorage",
    "live.grid",
    "live.object",
]

# URL-encode object name for path (~ -> %7E, etc.)
def refpage_url(name: str) -> str:
    encoded = name.replace("~", "%7E")
    return f"{BASE_URL}/{encoded}"

def slug(name: str) -> str:
    return name.replace("~", "_tilde")

def fetch_refpage(object_name: str) -> str | None:
    url = refpage_url(object_name)
    try:
        r = requests.get(url, timeout=30)
        r.raise_for_status()
        return r.text
    except requests.RequestException as e:
        print(f"  fetch error: {e}", file=sys.stderr)
        return None

def html_to_markdown(html: str) -> str:
    h = html2text.HTML2Text()
    h.ignore_links = False
    h.body_width = 0
    return h.handle(html)

def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for obj in OBJECTS:
        print(f"Fetching {obj}...")
        raw = fetch_refpage(obj)
        if not raw:
            continue
        md = html_to_markdown(raw)
        # Trim "Reference - Max 8 Documentation" and similar header noise
        md = re.sub(r"^#\s*\[.*?\]\(.*?\).*\n+#\s*", "# ", md, count=1, flags=re.DOTALL)
        out_file = OUT_DIR / f"{slug(obj)}.md"
        out_file.write_text(md, encoding="utf-8")
        print(f"  -> {out_file}")
    print("Done.")

if __name__ == "__main__":
    main()
