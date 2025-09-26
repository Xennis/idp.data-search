#!/bin/bash
set -euo pipefail

DEST="public/data"
FILES=(
  "ipd-data-sheet.json"
  "mainLangs.json"
  "materials.json"
  "terms.json"
)
BASE_URL="https://raw.githubusercontent.com/Xennis/idp.data-search/web-data/data"

for file in "${FILES[@]}"; do
    echo "Downloading $file..."
    curl -L -o "$DEST/$file" "$BASE_URL/$file"
done

echo "All files downloaded to $DEST"
