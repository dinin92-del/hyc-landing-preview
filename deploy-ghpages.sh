#!/usr/bin/env bash
# Publish landing/ to GitHub Pages (repo: dinin92-del/hyc-landing).
# One command to update the live site after editing landing/ (e.g. config.js).
# Uses the already-authenticated `gh`/git — no passwords entered here.
#
#   cd landing && ./deploy-ghpages.sh
#
# Live URL: https://dinin92-del.github.io/hyc-landing/
set -euo pipefail
cd "$(dirname "$0")"

REPO="dinin92-del/hyc-landing"
# Własna domena: ustaw SITE_DOMAIN, gdy DNS JUŻ wskazuje na GitHub Pages.
#   SITE_DOMAIN=gethyc.com ./deploy-ghpages.sh
# Wtedy skrypt dokłada plik CNAME (GH Pages tego wymaga) i wstawia absolutne
# URL-e OG na tej domenie. Bez zmiennej publikuje pod adresem github.io —
# ustawienie CNAME PRZED wpięciem DNS przekierowuje github.io na martwą
# domenę i strona przestaje się otwierać, dlatego to jawny przełącznik.
SITE_DOMAIN="${SITE_DOMAIN:-}"
if [[ -n "$SITE_DOMAIN" ]]; then
  BASE="https://$SITE_DOMAIN"
else
  BASE="https://dinin92-del.github.io/hyc-landing"
fi
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

# 1) Build the host-agnostic bundle (real legal, woff2, og-image)
./build.sh >/dev/null

# 2) GitHub Pages adjustments on a copy
cp -R dist "$WORK/site"
cd "$WORK/site"
rm -f _headers                 # GH Pages ignores _headers (CSP only on Cloudflare/Netlify)
touch .nojekyll                # serve files verbatim, don't skip _-prefixed
if [[ -n "$SITE_DOMAIN" ]]; then printf '%s\n' "$SITE_DOMAIN" > CNAME; fi
# OG needs absolute URLs (scrapers don't resolve relative)
sed -i '' "s#content=\"assets/og-image.jpg\"#content=\"$BASE/assets/og-image.jpg\"#g" index.html
sed -i '' "s#<meta property=\"og:type\" content=\"website\">#<meta property=\"og:type\" content=\"website\">\n  <meta property=\"og:url\" content=\"$BASE/\">#" index.html

# 3) Push to the Pages repo (force — the repo mirrors dist, no history to keep)
git init -q -b main
git add -A
git -c user.name="dinin92-del" -c user.email="dinin92@gmail.com" \
    commit -q -m "Deploy landing $(date +%Y-%m-%d\ %H:%M)"
git remote add origin "https://github.com/$REPO.git"
git push -q --force origin main

echo "Deployed → $BASE/  (GH Pages build ~30s–2min)"
