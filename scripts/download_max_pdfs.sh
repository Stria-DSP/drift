#!/usr/bin/env bash
# Download Max documentation PDFs from Cycling '74, and optionally copy Gen-related
# PDFs from the Max application directory if present.
# Source: https://docs.cycling74.com/pdfs
# We're on Max 8; the site only offers Max 9 PDFs, which are largely applicable.
# Gen: There is no separate "Gen guide" or "Gen object reference" PDF on the site;
# the User Guide includes Gen content. This script also tries optional Gen slugs
# and can copy Gen-related PDFs from /Applications/Max*.app if you have Max installed.

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
OUT_DIR="${REPO_ROOT}/research/max8_pdfs"
BASE_URL="https://docs.cycling74.com/api/pdfs"

mkdir -p "$OUT_DIR"

# Required PDFs: slug name (from docs.cycling74.com/pdfs)
PDFS="Max9-UserGuide Max9-UserGuide
Max9-LOM Max9-LiveObjectModel
Max9-JS-API Max9-JS-API
Max9-NodeForMax-API Max9-NodeForMax-API"

# Optional: Gen-related slugs (may 404 if not published)
GEN_SLUGS="Max9-Gen Max9-GenReference Max8-Gen"

download_one() {
  local slug="$1"
  local name="$2"
  local url="${BASE_URL}/${slug}/?locale=en"
  local out="${OUT_DIR}/${name}.pdf"
  echo "Downloading ${name}..."
  if curl -sSfL -o "$out" --max-time 120 "$url" 2>/dev/null; then
    if head -c 4 "$out" | grep -q '%PDF'; then
      echo "  -> Saved ${out}"
      return 0
    else
      echo "  -> WARNING: Response may not be a PDF. Check ${out}"
      return 1
    fi
  else
    echo "  -> Failed or not found: ${url}"
    rm -f "$out"
    return 1
  fi
}

echo "$PDFS" | while read -r slug name; do
  [[ -z "$slug" ]] && continue
  download_one "$slug" "$name" || true
done

for slug in $GEN_SLUGS; do
  download_one "$slug" "$slug" || true
done

# Copy Gen-related PDFs from Max application directory (macOS)
echo ""
echo "Checking Max application directory for Gen PDFs..."
MAX_APPS=()
for app in "/Applications/Max 8.app" "/Applications/Max 9.app"; do
  if [[ -d "$app" ]]; then
    MAX_APPS+=("$app")
  fi
done

if [[ ${#MAX_APPS[@]} -eq 0 ]]; then
  echo "  No Max app found in /Applications (Max 8.app or Max 9.app). Skipping copy from app."
else
  for app in "${MAX_APPS[@]}"; do
    echo "  Searching ${app}..."
    while IFS= read -r -d '' pdf; do
      base=$(basename "$pdf")
      if [[ "$base" =~ [Gg]en ]]; then
        dest="${OUT_DIR}/${base}"
        if [[ ! -f "$dest" || "$pdf" -nt "$dest" ]]; then
          cp "$pdf" "$dest"
          echo "  -> Copied ${base} to ${OUT_DIR}"
        fi
      fi
    done < <(find "$app" -name "*.pdf" -print0 2>/dev/null || true)
  done
fi

echo ""
echo "Done. PDFs in ${OUT_DIR}"
