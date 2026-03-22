#!/usr/bin/env bash
set -u

echo "---- Mojibake Scan Report ----"
echo ""

TOTAL_MATCHES=0
AFFECTED_TMP="$(mktemp)"

PATTERN='Â|Ã|â€|â€™|â€œ|â€˜|â€"|â†|â€¦|â€“'

while IFS= read -r -d '' FILE; do
  MATCHES="$(grep -nI -E "$PATTERN" "$FILE" || true)"

  if [ -n "$MATCHES" ]; then
    echo "$FILE" >> "$AFFECTED_TMP"
    echo "file: $FILE"

    while IFS= read -r MATCH; do
      [ -z "$MATCH" ] && continue
      LINE_NUM="${MATCH%%:*}"
      CONTENT="${MATCH#*:}"
      echo "line: $LINE_NUM"
      echo "content: $CONTENT"
      TOTAL_MATCHES=$((TOTAL_MATCHES + 1))
    done <<< "$MATCHES"

    echo "--------------------------------"
    echo ""
  fi
done < <(
  find . \
    \( -path './.git' -o -path './node_modules' -o -path './build' -o -path './dist' -o -path './.next' \) -prune \
    -o -type f \
    \( -name '*.html' -o -name '*.js' -o -name '*.css' -o -name '*.md' -o -name '*.json' \) \
    -print0
)

TOTAL_FILES="$(sort -u "$AFFECTED_TMP" | wc -l | tr -d ' ')"
rm -f "$AFFECTED_TMP"

echo "Summary:"
echo "Total files affected: $TOTAL_FILES"
echo "Total matches found: $TOTAL_MATCHES"
