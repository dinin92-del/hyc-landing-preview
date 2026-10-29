#!/usr/bin/env bash
# Hyc! landing — build a host-agnostic static bundle in ./dist.
# Resolves the legal/ symlink into REAL files so any host serves them
# (some hosts don't follow symlinks). Run from the landing/ dir.
set -euo pipefail
cd "$(dirname "$0")"

DIST="dist"
rm -rf "$DIST"
mkdir -p "$DIST"

# Pages + behaviour + config
cp index.html o-aplikacji.html kontakt.html pobierz.html \
   styles.css scroll-lock.js nav.js main.js config.js \
   favicon.svg robots.txt sitemap.xml "$DIST/"

# Weryfikacja Google Search Console (konto hyc.kontakt@gmail.com). Plik musi
# zostać na stronie na stałe, inaczej Google cofnie weryfikację.
cp google*.html "$DIST/"

# TDM reservation (machine-readable opt-out, art. 26³ ust. 2 pr. aut.)
mkdir -p "$DIST/.well-known"
cp .well-known/tdmrep.json "$DIST/.well-known/"

# Static assets (fonts, hero, og-image, store logos, licenses)
cp -R assets "$DIST/assets"

# Legal: copy the REAL files behind the symlink (not the link itself)
mkdir -p "$DIST/legal"
cp -RL legal/. "$DIST/legal/"

# Edge headers (security + caching) — Netlify / Cloudflare Pages format
cp _headers "$DIST/_headers"

echo "Built $DIST/ ($(find "$DIST" -type f | wc -l | tr -d ' ') files)"
echo "Deploy: drag-drop $DIST/ to Cloudflare Pages / Netlify, or point the host's publish dir at it."
