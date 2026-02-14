#!/usr/bin/env python3
"""
Fetch one Max 8 ref page and save to research/max8_docs/refpages/<slug>.md.
Use when looking up an object so we accumulate local docs.
  python scripts/save_refpage.py live.grid
  python scripts/save_refpage.py "phasor~"
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = REPO_ROOT / "research" / "max8_docs" / "refpages"
BASE_URL = "https://docs.cycling74.com/max8/refpages"


def slug(name: str) -> str:
    return name.replace("~", "_tilde")


def refpage_url(name: str) -> str:
    encoded = name.replace("~", "%7E")
    return f"{BASE_URL}/{encoded}"


def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: save_refpage.py <objectname>", file=sys.stderr)
        sys.exit(1)
    obj = sys.argv[1].strip()
    if not obj:
        sys.exit(1)

    try:
        import requests
        import html2text
    except ImportError:
        print("Install: pip install requests html2text", file=sys.stderr)
        sys.exit(1)

    url = refpage_url(obj)
    try:
        r = requests.get(url, timeout=30)
        r.raise_for_status()
        html = r.text
    except Exception as e:
        print(f"Fetch error: {e}", file=sys.stderr)
        sys.exit(1)

    h = html2text.HTML2Text()
    h.ignore_links = False
    h.body_width = 0
    md = h.handle(html)
    md = re.sub(r"^#\s*\[.*?\]\(.*?\).*\n+#\s*", "# ", md, count=1, flags=re.DOTALL)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out_file = OUT_DIR / f"{slug(obj)}.md"
    out_file.write_text(md, encoding="utf-8")
    print(f"Saved {out_file}")


if __name__ == "__main__":
    main()
