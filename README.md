# Hyc! — landing (otwarta beta)

Statyczny landing pod otwartą betę. Jedna strona, self-hosted fonty (bez Google CDN → RODO-clean),
zero trackerów, zero zależności runtime. Design dopracowujemy na bieżąco.

## Struktura

```
landing/
  index.html        # strona
  styles.css        # style (tokeny 1:1 z lib/shared/theme.dart)
  main.js           # zachowanie (przyciski sklepów) — zewnętrzne pod CSP
  config.js         # ← JEDYNE miejsce do edycji: publiczne linki bety
  favicon.svg  robots.txt
  _headers          # nagłówki edge (CSP, cache) — Netlify / Cloudflare Pages
  netlify.toml      # config dla git-connected deployu (opcjonalne)
  build.sh          # składa dist/ (host-agnostyczny, realne legal zamiast symlinku)
  legal/            # symlink → ../legal (kanoniczne pliki prawne, NIE kopia)
  assets/           # hero, og-image.jpg, logo, fonty WOFF2, logotypy sklepów
```

## 1. Wklej linki (to wszystko, czego trzeba, by ruszyć)

Edytuj **`config.js`**:

```js
window.HYC_CONFIG = {
  testflight: "https://testflight.apple.com/join/XXXXXXXX",
  googlePlay: "https://play.google.com/apps/testing/pl.hycdobudy.hyc_do_budy",
};
```

Puste `""` → przycisk pokazuje „Wkrótce" i jest nieklikalny. Strona sama podświetla
przycisk pasujący do systemu odwiedzającego (iOS/Android).

## 2. Skąd wziąć linki

### iOS — publiczny link TestFlight
1. App Store Connect → Twoja apka → **TestFlight**.
2. Zbuduj i wyślij build (Xcode/Transporter), poczekaj na „Ready to test".
3. Sekcja **External Testing** → grupa testerów → włącz **Public Link**.
4. Skopiuj `https://testflight.apple.com/join/XXXXXXXX` → `config.js`.
   (Limit 10 000 testerów. Każdy build wymaga krótkiego review Apple.)

### Android — testy otwarte (open testing)
1. Play Console → Twoja apka → **Testowanie → Testy otwarte**.
2. Wgraj wersję, uzupełnij formularze (opis, ikona, zrzuty, polityka prywatności).
3. Opublikuj do testów otwartych, skopiuj link **„Adres URL do testów"**.
   Zwykle `https://play.google.com/apps/testing/pl.hycdobudy.hyc_do_budy`.
   (Nowe konta deweloperskie: Google może wymagać min. liczby testerów przed produkcją —
   testy otwarte to spełniają.)

## 3. Deploy

Zbuduj host-agnostyczny bundel (realne pliki prawne zamiast symlinku):

```bash
cd landing && ./build.sh      # → landing/dist/
```

Potem, najprościej: **przeciągnij `landing/dist/` do Cloudflare Pages / Netlify**
(darmowe, HTTPS + domena z automatu, `_headers` łapane same). Bez build-commanda na hoście.

Git-connected (Netlify): `netlify.toml` już ustawia `base=landing`, `command=bash build.sh`,
`publish=landing/dist`.

`dist/` jest w `.gitignore` (artefakt buildu — nie commitujemy).

### 3a. Własna domena na GitHub Pages (`gethyc.com`) — WPIĘTE 2026-07-29

Domena kupiona (Spaceship), DNS ustawiony, HTTPS wymuszony, certyfikat ważny do
2026-10-27. Landing stoi pod **https://gethyc.com**, `www` przekierowuje na apeks.
Poniższa procedura zostaje jako zapis tego, co zrobiono (i przepis na kolejną domenę).

**Kolejność jest istotna: najpierw DNS, dopiero potem `SITE_DOMAIN`.** GitHub Pages
po zobaczeniu pliku `CNAME` przekierowuje adres `github.io` na domenę własną —
jeśli DNS jeszcze nie działa, strona przestaje się otwierać pod OBOMA adresami.

1. Kup domenę u dowolnego rejestratora.
2. W DNS rejestratora ustaw dla **apeksu** (`gethyc.com`, rekord `@`) cztery rekordy `A`:
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   (i opcjonalnie `AAAA`: `2606:50c0:8000::153`, `…8001::153`, `…8002::153`, `…8003::153`).
   Dla `www` → rekord `CNAME` na `dinin92-del.github.io.`
3. Poczekaj, aż propagacja zadziała: `dig +short gethyc.com` ma zwrócić powyższe IP.
4. Dopiero teraz deploy z domeną:

   ```bash
   cd landing && SITE_DOMAIN=gethyc.com ./deploy-ghpages.sh
   ```

   Skrypt dokłada plik `CNAME` do publikowanego katalogu i wstawia absolutne URL-e OG
   na `https://gethyc.com`.
5. W repo `dinin92-del/hyc-landing` → Settings → Pages zaznacz **Enforce HTTPS**
   (certyfikat Let's Encrypt wystawia się kilka–kilkanaście minut po wpięciu domeny).

Bez `SITE_DOMAIN` skrypt publikuje po staremu pod `dinin92-del.github.io/hyc-landing`.

## Dobre praktyki już wpięte
- responsywność mobile-first, semantyczny HTML, `lang="pl"`
- Open Graph + Twitter Card + dedykowany `assets/og-image.jpg` 1200×630
- widoczny focus klawiatury, kontrast AA, `prefers-reduced-motion`
- self-hosted fonty **WOFF2** z licencją OFL: Figtree variable (oś wght 300–900, 27 KB —
  font DS, ten sam co w apce) + Fredoka wyłącznie na wordmarku „Hyc!"
- JS zewnętrzny (nie inline), więc strona **da się** podać z twardym CSP `script-src 'self'`
  — ale ⚠️ `_headers` czyta **tylko Netlify / Cloudflare Pages**. Na GitHub Pages, gdzie
  landing stoi dzisiaj, `deploy-ghpages.sh` ten plik kasuje i produkcja leci **bez CSP,
  bez `X-Content-Type-Options`, bez `Referrer-Policy` i bez `Permissions-Policy`**
  (GH Pages nie pozwala ustawiać własnych nagłówków). Chcesz je realnie mieć → hosting
  musi przenieść się na Cloudflare Pages albo Netlify.
- brak zewnętrznych żądań i trackerów (RODO-clean)

## TODO (opcjonalne)
- [x] ~~kupić `gethyc.com` i wpiąć wg §3a~~ — zrobione 2026-07-29
- [ ] `assets/demo.mp4` — nagranie z apki do ramki telefonu w hero (teraz leci sam
      poster `hero.png`; podmiana to jeden `<source>`). ⚠️ `hero.png` ma proporcję
      9:16, a ramka 9:19.5 — przy `object-fit: cover` poster gubi ~18% szerokości.
      Nagranie z telefonu/symulatora będzie miało 9:19.5 i problem zniknie samo.
