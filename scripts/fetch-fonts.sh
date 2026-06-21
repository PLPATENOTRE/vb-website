#!/usr/bin/env bash
# Récupère Cormorant Garamond + Mulish (OFL) en .woff2 self-hosted dans public/fonts/
# et génère src/styles/fonts.css. AUCUNE requête CDN au runtime — tout est servi en local.
# Re-jouable : régénère fonts + CSS à l'identique. Provenance = Google Fonts (sous-ensembles woff2).
set -euo pipefail
cd "$(dirname "$0")/.."

UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
URL='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Mulish:wght@300;400;500;600;700&display=swap'

mkdir -p public/fonts
tmp="$(mktemp)"
curl -fsS -A "$UA" "$URL" -o "$tmp"

# Télécharge chaque sous-ensemble woff2 (nom = hash gstatic, unique)
grep -oE 'https://fonts.gstatic.com/[^)]+\.woff2' "$tmp" | sort -u | while read -r u; do
  curl -fsS "$u" -o "public/fonts/$(basename "$u")"
done

# Réécrit les URLs gstatic -> /fonts/<hash>.woff2 (servi en local)
{
  echo "/* Généré par scripts/fetch-fonts.sh — Cormorant Garamond + Mulish (OFL), self-hosted. */"
  sed -E 's#https://fonts.gstatic.com/[^)]*/([^/)]+\.woff2)#/fonts/\1#g' "$tmp"
} > src/styles/fonts.css

rm -f "$tmp"
echo "OK : $(ls public/fonts/*.woff2 | wc -l | tr -d ' ') woff2 -> public/fonts/, fonts.css régénéré"
