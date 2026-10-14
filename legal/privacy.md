# Polityka prywatności

Hyc! · Wersja 1.4 · obowiązuje od **2 września 2026 r.**

→ Regulamin (EULA) · → Warunki bezpiecznego korzystania

## 0. Czego dotyczy ta polityka

Polityka obejmuje **aplikację mobilną Hyc!** oraz **stronę gethyc.com** — dalej łącznie
„Usługa". Tam, gdzie zasada dotyczy tylko jednego z nich, jest to wskazane wprost;
bez takiego zastrzeżenia zapis dotyczy obu.

**Sama strona gethyc.com nie zbiera danych osobowych.** Nie ma na niej ciasteczek,
narzędzi analitycznych, pikseli śledzących ani formularzy — to statyczna wizytówka
z odnośnikami do sklepów i do niniejszych dokumentów. Jak każdy serwis WWW jest
udostępniana przez hosting, który rejestruje standardowe **logi techniczne żądań
(adres IP, typ przeglądarki, czas)**; służą one wyłącznie utrzymaniu i zabezpieczeniu
serwisu i nie są przez nas łączone z Twoim kontem w Aplikacji.

Wszystkie pozostałe punkty tej polityki opisują **Aplikację**.

## 1. Administrator danych
Administratorem danych osobowych jest **Józef Kołaczyk, ul. Piątkowska 43/49, 60-645 Poznań**,
działający jako osoba fizyczna („Operator"). Kontakt w sprawach danych:
**hyc.kontakt@gmail.com**.

## 2. Jakie dane przetwarzamy

### 2.1. Dane konta

- adres e-mail oraz nazwa wyświetlana,
- przy logowaniu Google/Apple — identyfikator dostawcy i adres e-mail udostępniony przez dostawcę,
- identyfikator użytkownika nadany przez Firebase Authentication.

Nie przechowujemy Twojego hasła do logowania Google/Apple — uwierzytelnienie odbywa się
po stronie dostawcy, a Firebase Authentication przechowuje wyłącznie token sesji.

### 2.2. Treści użytkownika (UGC)

- opisy, komentarze, nazwy oraz punkty (w tym ich współrzędne) dodawane przez Ciebie,
  wraz z datą i nazwą autora,
- zdjęcia punktów dodawane przez Ciebie. Przed wysłaniem Aplikacja usuwa z pliku
  metadane EXIF (w tym współrzędne GPS zapisane przez aparat) i zmniejsza zdjęcie;
  na serwer trafia sam obraz wraz z datą i nazwą autora.

Operator może wykorzystywać treści UGC oraz dane o punktach w formie
**zanonimizowanej i zagregowanej** (bez powiązania z Twoją tożsamością) — do celów
statystycznych, rozwoju Aplikacji oraz udostępniania lub licencjonowania osobom trzecim. Dane
w tej formie nie stanowią danych osobowych w rozumieniu RODO. Zakres licencji na Treści określa
Regulamin (EULA).

### 2.3. Lokalizacja
Pozycja GPS jest używana **na urządzeniu** do wyznaczenia najbliższego punktu i nawigacji.
Aby obliczyć trasę po szlaku, Twoja aktualna pozycja (punkt startowy) oraz współrzędne celu
są przesyłane do dostawcy routingu (**Seznam.cz a.s. / mapy.cz**) wyłącznie na czas obliczenia
trasy. **Nie przechowujemy Twojej bieżącej pozycji ani historii tras na naszych serwerach.**
Wyjątkiem jest sytuacja, gdy świadomie dodajesz punkt — wtedy zapisywane są współrzędne tego
punktu (a nie Twojej trasy). Aplikacja nie korzysta z lokalizacji w tle.

Do statystyk (pkt 4) **nie trafiają Twoje współrzędne**. Trafia natomiast — gdy akurat
jesteś w parku narodowym albo w jego 5-kilometrowym buforze — **nazwa tego parku** wraz
z informacją, czy chodzi o teren parku, czy o bufor. Przynależność do parku wylicza sama
Aplikacja **na Twoim urządzeniu**, porównując pozycję z granicami zapisanymi w plikach
Aplikacji; na zewnątrz wychodzi wyłącznie gotowa nazwa (np. „tatrzanski"), nigdy pozycja,
z której powstała. To informacja o **przybliżonym rejonie** rzędu setek kilometrów
kwadratowych, nie o Twoim miejscu pobytu.

Osobno: **kafle mapy pobieramy z naszego własnego serwera** (`tiles.hycmap.com`, hosting
Cloudflare R2). Serwer ten odbiera adres IP urządzenia oraz numery kafli, które oglądasz —
a numer kafla wskazuje obszar mapy, więc **z samego ruchu wynika przybliżony rejon, w którym
korzystasz z Aplikacji**. Nie łączymy tych żądań z Twoim kontem i nie budujemy z nich historii
tras.

### 2.4. Dane techniczne i diagnostyczne
Korzystamy z narzędzi Google (Firebase Analytics oraz Firebase Crashlytics) do zbierania
statystyk użycia i raportów o awariach (crash). Dane te służą poprawie stabilności Aplikacji.

Zakres, uczciwie: **raport o awarii zawiera model urządzenia, wersję systemu i identyfikator
instalacji Aplikacji**, a Analytics posługuje się identyfikatorem instancji Aplikacji na
urządzeniu. Nie zawierają one Twojego imienia, adresu e-mail ani współrzędnych i nie używamy ich
do profilowania — ale są to identyfikatory przypisane do instalacji, a nie dane w pełni anonimowe.
Odinstalowanie Aplikacji kończy ich żywotność.

**Weryfikacja autentyczności Aplikacji (App Check).** Żeby chronić backend przed nadużyciami
(boty, podrobione klienty), każde żądanie do naszych usług niesie token potwierdzający, że pochodzi
z prawdziwej instalacji Aplikacji. Token wystawia **Google Play Integrity** (Android) lub
**Apple App Attest / DeviceCheck** (iOS). Mechanizm sprawdza integralność aplikacji i
urządzenia; nie przekazujemy przy tym Twojej tożsamości ani lokalizacji.

Korzystanie z usług sieciowych (logowanie, moderacja, obliczanie tras) wiąże się z tym, że
dostawcy wymienieni w pkt 5 odbierają dane techniczne niezbędne do realizacji żądania, w tym
**adres IP** urządzenia i metadane połączenia.

## 3. Moderacja treści i sztuczna inteligencja (AI)
Aby chronić bazę przed spamem, dezinformacją i treściami niezgodnymi z prawem, Twoje opisy
i komentarze są **automatycznie analizowane** przez model AI Gemini (Google) w celu oceny
zgodności z Regulaminem:

- **zdjęcia** — **nie** są analizowane przez AI i podlegają wyłącznie moderacji reakcyjnej:
  widoczne od razu, chyba że towarzyszą nowo dodawanemu punktowi — wtedy publikują się razem
  z jego opisem, dopiero po rozstrzygnięciu jego weryfikacji przez AI. Widoczne zdjęcie usuwa
  autor albo moderator po zgłoszeniu.
- **opisy punktów** — pre-moderacja: są ukryte do czasu wydania werdyktu przez AI
  (zatwierdzone / odrzucone / do ręcznego przeglądu moderatora);
- **komentarze** — post-moderacja: widoczne od razu, ale AI ocenia je asynchronicznie;
  treści naruszające Regulamin są ukrywane;
- **zgłoszenia** — treści zgłoszone przez innych użytkowników ocenia moderator
  (o zgłoszeniach nie decyduje AI).

Każda ocena AI i każda decyzja moderatora jest zapisywana w rejestrze moderacyjnym
(append-only) — dla audytu i jakości usługi. Po usunięciu konta dane autora w rejestrze są
anonimizowane, ale sama treść i werdykt pozostają.

**Podstawa prawna:** art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes —
utrzymanie jakości i bezpieczeństwa usługi). Zapytania do Gemini są przetwarzane przez Google
jako podmiot przetwarzający; transfer poza EOG zabezpieczają mechanizmy z pkt 5–6. Decyzje o
zgłoszeniach podejmuje człowiek (moderator), a wobec automatycznej oceny AI masz prawo
sprzeciwu i przeglądu przez moderatora (pkt 7).

## 4. Cele i podstawy prawne (RODO)

- prowadzenie konta i świadczenie funkcji społecznościowych — wykonanie umowy (art. 6 ust. 1 lit. b),
- moderacja (w tym AI), bezpieczeństwo i obsługa zgłoszeń — prawnie uzasadniony interes (art. 6 ust. 1 lit. f),
- statystyki i diagnostyka — prawnie uzasadniony interes (art. 6 ust. 1 lit. f); dane zagregowane, bez identyfikatorów reklamowych,
- obliczenie trasy i wskazanie najbliższego punktu, w tym przekazanie współrzędnych startu i celu dostawcy routingu — wykonanie usługi na Twoje żądanie (art. 6 ust. 1 lit. b); dostęp Aplikacji do GPS wymaga zgody systemowej urządzenia, którą możesz cofnąć w ustawieniach telefonu,
- wypełnienie obowiązków prawnych (np. podatkowych, jeśli wystąpią płatności) — art. 6 ust. 1 lit. c.

**Nie sprzedajemy Twoich danych osobowych, nie profilujemy Cię ani nie udostępniamy ich
reklamodawcom.** Aplikacja **nie zawiera żadnego modułu reklamowego** — nie wyświetlamy reklam,
nie korzystamy z identyfikatorów reklamowych i nie przekazujemy danych sieciom reklamowym.
Ewentualne udostępnianie danych o punktach i treści dotyczy wyłącznie formy zanonimizowanej
i zagregowanej (pkt 2.2).

### 4.1. Zakres statystyk (Analytics) — uczciwie

Aplikacja wysyła zdarzenia z następujących kategorii:

- **wyszukanie punktu i dotarcie do niego** — czy ludzie faktycznie docierają tam, dokąd ich prowadzimy,
- **przebieg nawigacji** — jej rozpoczęcie, świadoma zmiana trybu wyszukiwania, zakończenie wraz z powodem, użyte przybliżenie mapy, wyświetlenie samouczka,
- **niepowodzenia i uproszczenia** — nieudane wyznaczenie trasy wraz z etapem, na którym się nie powiodło, oraz automatyczne uproszczenie zapytania o trasę przy słabym łączu,
- **interakcje z kartą punktu** — zapisanie punktu, dodanie komentarza, tapnięcie numeru telefonu (**bez samego numeru**),
- **wejście do parku narodowego** (zob. niżej),
- **tapnięcie „Wesprzyj projekt"**.

Do zdarzeń dołączamy identyfikator punktu, tryb wyszukiwania, źródło punktu (nasza baza /
dodany przez użytkowników) oraz proste etykiety i liczby techniczne (np. powód zakończenia nawigacji, dystans zaokrąglony do
kilometra). **Nie dołączamy Twojego identyfikatora użytkownika, adresu e-mail, nazwy
wyświetlanej ani współrzędnych** i nie łączymy tych zdarzeń z Twoim kontem. Analizujemy je
wyłącznie zbiorczo — po to, żeby wiedzieć, które funkcje działają, a które zawodzą.

**Park narodowy.** Zdarzenia wyszukania, dotarcia i wejścia do parku niosą **nazwę parku
narodowego** oraz informację, czy chodzi o teren parku, czy o jego 5-kilometrowy bufor. Jest
to dana o **przybliżonym rejonie** i mówimy o tym wprost. Klasyfikację wykonuje sama
Aplikacja na urządzeniu (pkt 2.3) — porównuje pozycję z granicami parków zapisanymi w plikach
Aplikacji, więc na zewnątrz wychodzi wyłącznie gotowa nazwa, nigdy współrzędne, z których
powstała.

## 5. Odbiorcy danych (podmioty przetwarzające)

- **Google Firebase** (Authentication, Cloud Firestore, Cloud Functions,
  Analytics, Crashlytics, Remote Config, App Check) — hosting danych i logika backendu,
- **Google AI (Gemini API)** — automatyczna moderacja treści,
- **Seznam.cz a.s. (mapy.cz)** — obliczanie tras (routing); przetwarza przesłane współrzędne
  (start i cel) wyłącznie na czas obliczenia trasy,
- **Cloudflare, Inc.** — hosting kafli mapy (`tiles.hycmap.com`) oraz przechowywanie i udostępnianie
  zdjęć dodanych przez użytkowników (`photos.hycmap.com`) — magazyn R2 i sieć CDN;
  odbiera adres IP i numery pobieranych kafli,
- **Resend (Resend, Inc.)** — wysyłka wiadomości e-mail Aplikacji (powitanie, weryfikacja
  adresu, reset hasła); otrzymuje Twój adres e-mail i treść wiadomości,
- **Google** (Play Integrity) oraz **Apple** (App Attest / DeviceCheck) — weryfikacja
  autentyczności instalacji Aplikacji,
- **Google** oraz **Apple** — logowanie przez Google Sign-In / Sign in with Apple.

Każdy z tych podmiotów przetwarza dane na podstawie umowy powierzenia zgodnej z RODO.
Dane przesyłamy z szyfrowaniem w tranzycie (TLS), a dostęp do backendu ograniczają reguły
bezpieczeństwa do niezbędnego zakresu. Logowanie Google/Apple wiąże się z przetwarzaniem przez
odpowiednio Google i Apple zgodnie z ich politykami prywatności.

## 6. Przekazywanie poza EOG
Niektóre dane mogą być przekazywane do Stanów Zjednoczonych (Google Firebase, Google AI).
Podstawą przekazania jest decyzja wykonawcza Komisji UE 2023/1795 (Data Privacy Framework —
dla podmiotów certyfikowanych) oraz standardowe klauzule umowne (SCC) przyjęte przez Komisję UE.

## 7. Twoje prawa
Masz prawo do: dostępu do danych, sprostowania, usunięcia, ograniczenia przetwarzania,
przenoszenia danych, sprzeciwu (w tym wobec moderacji AI oraz wobec statystyk i diagnostyki)
oraz wycofania zgody.

Sprzeciw wobec statystyk i diagnostyki zgłoś na adres podany w pkt 11 — Aplikacja nie ma dziś
osobnego przełącznika tych funkcji, więc realizujemy takie żądania po zgłoszeniu. Zbieranie
danych diagnostycznych kończy się z chwilą odinstalowania Aplikacji. Konto i powiązane
dane usuniesz w Aplikacji (Profil → Usuń konto) — kasowanie następuje w ciągu 30 dni. Przysługuje
Ci skarga do Prezesa Urzędu Ochrony Danych Osobowych (PUODO).

## 8. Okres przechowywania

- dane konta — do czasu usunięcia konta (kasowanie w ciągu 30 dni),
- Treści UGC — do czasu ich usunięcia przez Ciebie lub moderację; publicznie udostępnione opisy
  mogą pozostać jako element punktu w formie zanonimizowanej (zob. Regulamin),
- zdjęcia — pozostają jako element punktu również po usunięciu konta, ale w formie
  zanonimizowanej (usuwamy powiązanie z Twoim kontem i nazwą); usuwasz je sam
  albo moderator na zgłoszenie,
- rejestr moderacyjny — przez okres świadczenia usługi, dla celów audytu i bezpieczeństwa (dane autora anonimizowane po usunięciu konta),
- dane analityczne — w formie zagregowanej, zgodnie z ustawieniami retencji narzędzia analitycznego (nie dłużej niż 14 miesięcy dla danych zdarzeń).

## 9. Dzieci
Z Aplikacji mogą korzystać osoby, które ukończyły 16 lat; osoby poniżej 16. roku życia mogą korzystać wyłącznie za zgodą i pod nadzorem opiekuna prawnego.

## 10. Zmiany polityki
O istotnych zmianach poinformujemy w Aplikacji. Aktualna wersja jest zawsze dostępna pod tym adresem.

## 11. Kontakt
W sprawach prywatności: **hyc.kontakt@gmail.com**.

