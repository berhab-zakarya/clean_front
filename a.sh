#!/bin/bash

ICON_DIR="public/assets/icons"
OUTPUT_FILE="lib/icons/index.ts"

mkdir -p "$(dirname "$OUTPUT_FILE")"
echo "// Auto-generated icon index\n" > "$OUTPUT_FILE"

for icon_path in "$ICON_DIR"/*.svg; do
  [ -e "$icon_path" ] || continue

  # Get the icon filename without extension
  filename=$(basename -- "$icon_path")
  icon_name="${filename%.*}"

  # Convert kebab-case or snake_case to camelCase
  export_name=$(echo "$icon_name" | sed -E 's/[-_](.)/\U\1/g')

  echo "export const $export_name = '/$icon_path';" >> "$OUTPUT_FILE"
done

echo "✅ index.ts generated at $OUTPUT_FILE"
