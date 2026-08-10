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

## Dwa znaki — nie mylić (0731)
- **`favicon.svg` = ikona aplikacji**: pole `#2D5016` + biały wordmark „Hyc!", geometria
  jak w masterze sklepowym (83,33 % szerokości, środek 2,78 % poniżej). Karta przeglądarki
  ma pokazywać to samo, co ekran telefonu i listing.
- **`assets/mark-rings.svg` = sygnet nagłówka**: trzy kręgi z HycButtona na kremowym tle.
  ⛔ W nagłówku obok stoi już słowo „Hyc!", więc wordmark w sygnecie czytałby się jako
  powtórzenie — dlatego tam ZOSTAJĄ kręgi. Do 0731 oba miejsca brały ten sam plik.
- **`assets/logo.png` = wordmark w hero**, 315×144 (3× wobec 105×48, na których
  się renderuje — retina). Źródło wektorowe leży obok jako **`logo-source.svg`**;
  raster powstaje z niego przez render w dużej skali, przycięcie do bounding boxa
  glifu i przeskalowanie do 315×144 (proporcje glifu 2,1878 vs 2,1875 pliku
  wydanego wcześniej — różnica niewidoczna). ⛔ Nie podmieniaj `logo.png` na
  inline `<svg>`: user porównał oba rysunki i wybrał ten.
- **`assets/apple-touch-icon.png` 180×180** — iOS nie czyta SVG i przy braku rastra robi
  za ikonę na ekranie głównym własny zrzut strony. Regeneracja: przeskalowanie mastera
  `1080x1080new.png` (LANCZOS), ten sam plik co ikona apki.

## TODO (opcjonalne)
- [x] ~~kupić `gethyc.com` i wpiąć wg §3a~~ — zrobione 2026-07-29
- [x] ~~`assets/demo.mp4` stoi placeholderem z pustym ekranem~~ — podmienione
      2026-08-07 na docelowe nagranie z apki (`?v=4`). Stan faktyczny pliku,
      zmierzony `ffprobe`: **1440x1440, 30 fps, 1620 klatek, 54,0 s, 2 731 606 B**;
      poster 37 KB. `hero.png` skasowany (był martwy), na produkcji zwraca 404.

- [ ] `assets/demo-poster.jpg` / `demo.mp4` — przepis na kolejną podmianę.
      Wymiana samych plików wystarcza, **o ile nowy render zachowa kadr 1:1**
      i telefon w tych samych proporcjach względem klatki — kadrowanie w hero
      jest policzone z tych proporcji (`.hero-art` ma `aspect-ratio: 1/1.3452`
      i przycina po 32 px z góry i z dołu przez `height: calc(100% + 64px)`).
      Ciaśniejszy render = trzeba przeliczyć te liczby, inaczej obetnie obudowę.

      Przekodowanie źródła z Rotato (źródło ma alfę; spłaszczamy je do `--cream`,
      bo Safari nie odtwarza wideo z kanałem alfa):
      ```
      ffmpeg -i rotato.mov \
        -filter_complex "[0:v]scale=1440:1440,fps=30[v];\
      color=c=0xf9f6f2:s=1440x1440:d=55:r=30,format=rgb24[bg];\
      [bg][v]overlay=shortest=1,format=yuv420p[out]" \
        -map "[out]" -c:v libx264 -preset slow -crf 24 -profile:v high \
        -movflags +faststart -an assets/demo.mp4
      ffmpeg -i assets/demo.mp4 -frames:v 1 -q:v 4 assets/demo-poster.jpg
      ```
      ⛔ `r=30` przy filtrze `color` **nie jest ozdobnikiem**: `color` domyślnie
      generuje 25 fps i przez `overlay` narzuca tę wartość CAŁEJ kompozycji —
      pierwszy render 1440 wyszedł 25-klatkowy mimo `fps=30` na wejściu wideo.
      Sprawdzaj po kodowaniu: `ffprobe … -show_entries stream=r_frame_rate`.
      ⚠️ Kolor tła w filtrze musi być równy `--cream` (`#f9f6f2`) — inny odetnie
      widoczny prostokąt na tle strony. (Zmierzone po zakodowaniu: róg klatki
      wychodzi `rgb(249,247,243)` przy tle `rgb(249,246,242)` — konwersja do
      yuv420p przesuwa o 1/255 na kanał, niewidoczne.)
      ⛔ Przy podmianie **podbij `?v=`** w `<source>`, w `poster` (`index.html`)
      i w `background-image` (`styles.css`). Na GitHub Pages `_headers` jest
      martwy (patrz niżej), ale wszystko leci z `max-age=600`, więc bez `?v=`
      podmiana dociera z opóźnieniem i niespójnie: poster może być nowy, a wideo
      jeszcze stare.

- [ ] Pauza 1 s na pierwszej klatce działa **tylko przy pierwszym odtworzeniu**
      (`main.js`). `loop` zapętla materiał wewnątrz elementu i JS tej pętli nie
      widzi. Gdyby pauza miała wracać w każdym cyklu: wypalić ją w materiale
      (`ffmpeg tpad`) albo zdjąć `loop` i restartować na zdarzeniu `ended`.
      Nie robimy tego z własnej inicjatywy — to decyzja projektowa, nie błąd.

## Podgląd siatki (narzędzie dev)
`dev-grid.html` rysuje kolumny siatki na żywej stronie: ładuje `index.html`
w `<iframe>` i nakłada kolumny w jego DOM-ie, więc przewijają się razem
z treścią. Pasek u góry przełącza siatkę hero (12 kolumn / rynna 24px, od
1100px; 8 / 16px od 760px) i siatkę kafelków (6 / 14px), obrysy elementów
oraz krycie. `index.html` zostaje przy tym nietknięty — zero kodu debugowego
w produkcji.

⛔ Plik **nie jest budowany ani deployowany**: `build.sh` kopiuje do `dist/`
wyłącznie pliki wypisane z nazwy (`index.html styles.css main.js config.js
favicon.svg robots.txt`). Nie dopisuj go do tamtej listy.
