#!/usr/bin/env bash
# Publish landing/ to GitHub Pages (repo: $REPO, default dinin92-del/hyc-landing).
# One command to update the live site after editing landing/ (e.g. config.js).
# Uses the already-authenticated `gh`/git — no passwords entered here.
# macOS only: `sed -i ''` to składnia BSD (na GNU/Linux trzeba `sed -i`).
#
#   cd landing && ./deploy-ghpages.sh                              # prod (gethyc.com repo)
#   REPO=dinin92-del/hyc-landing-preview ./deploy-ghpages.sh        # WIP preview, osobny repo
#   (albo krócej: ./deploy-preview.sh)
#
# ⛔ REPO dobrany świadomie — inny repo niż gethyc.com, żeby zwykły deploy WIP-a
# NIE nadpisywał CNAME/treści produkcji (0916: dokładnie to się stało — plain
# deploy bez SITE_DOMAIN skasował CNAME na dinin92-del/hyc-landing i gethyc.com
# padło na 404, bo oba linki dzieliły jeden branch jednego repo).
#
# Live URL: https://dinin92-del.github.io/<REPO-name>/
set -euo pipefail
cd "$(dirname "$0")"

REPO="${REPO:-dinin92-del/hyc-landing}"
REPO_NAME="${REPO#*/}"
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
  BASE="https://dinin92-del.github.io/$REPO_NAME"
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
# OG needs absolute URLs (scrapers don't resolve relative). Każda strona
# główna ma własne og:url i canonical (index.html = katalog główny);
# pobierz.html ma noindex, więc canonical tam nie trafia.
OG_IMG="assets/og-image.jpg?v=20261029"
for PAGE in index.html o-aplikacji.html kontakt.html pobierz.html; do
  URL="$BASE/$PAGE"; [[ "$PAGE" == index.html ]] && URL="$BASE/"
  sed -i '' "s#content=\"$OG_IMG\"#content=\"$BASE/$OG_IMG\"#g" "$PAGE"
  sed -i '' "s#<meta property=\"og:type\" content=\"website\">#<meta property=\"og:type\" content=\"website\">\n  <meta property=\"og:url\" content=\"$URL\">#" "$PAGE"
  [[ "$PAGE" == pobierz.html ]] || sed -i '' "s#<meta name=\"description\"#<link rel=\"canonical\" href=\"$URL\">\n  <meta name=\"description\"#" "$PAGE"
  # Podstawienia dopasowują DOKŁADNE stringi z HTML-a; zmiana formatowania
  # metatagów sprawiłaby, że sed po cichu nic nie robi i podgląd linku na
  # socialach traci obrazek/URL. Dlatego sprawdzamy wynik.
  grep -q "content=\"$BASE/$OG_IMG\"" "$PAGE" \
    || { echo "BŁĄD: og:image w $PAGE nie został przepisany na absolutny URL" >&2; exit 1; }
  [[ $(grep -c 'property="og:url"' "$PAGE") == 1 ]] \
    || { echo "BŁĄD: $PAGE nie ma dokładnie jednego og:url" >&2; exit 1; }
done

# 3) Push to the Pages repo (force — the repo mirrors dist, no history to keep)
git init -q -b main
git add -A
# Autor commita: adres noreply GitHuba, NIE prywatny e-mail. Repo Pages jest
# PUBLICZNE, a `git log` / API wystawiają adres autora każdemu — prywatna
# skrzynka wyciekłaby tam przy pierwszym deployu.
git -c user.name="dinin92-del" \
    -c user.email="284271549+dinin92-del@users.noreply.github.com" \
    commit -q -m "Deploy landing $(date +%Y-%m-%d\ %H:%M)"
git remote add origin "https://github.com/$REPO.git"
git push -q --force origin main

echo "Deployed → $BASE/  (GH Pages build ~30s–2min)"
