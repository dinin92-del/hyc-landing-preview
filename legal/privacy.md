# Polityka prywatności

Hyc! · Wersja 1.8 · obowiązuje od **14 października 2026 r.**

→ Regulamin · → Warunki bezpiecznego korzystania

## 0. Czego dotyczy ta polityka

Polityka obejmuje **aplikację mobilną Hyc!** oraz **stronę gethyc.com**, dalej łącznie „Usługa”. Tam, gdzie zasada dotyczy tylko jednego z nich, jest to wskazane wprost; bez takiego zastrzeżenia zapis dotyczy obu.

**Sama strona gethyc.com nie zbiera danych osobowych.** Nie ma na niej ciasteczek, narzędzi analitycznych, pikseli śledzących ani formularzy. To statyczna wizytówka z odnośnikami do sklepów i do niniejszych dokumentów. Jak każdy serwis WWW jest udostępniana przez hosting (GitHub Pages, pkt 5), który rejestruje standardowe **logi techniczne żądań (adres IP, typ przeglądarki, czas)**. Służą one wyłącznie utrzymaniu i zabezpieczeniu serwisu i nie są przez nas łączone z Twoim kontem w Aplikacji.

Wszystkie pozostałe punkty tej polityki opisują **Aplikację**.

## 1. Administrator danych

Administratorem danych osobowych jest **Józef Kołaczyk, ul. Piątkowska 43/49, 60-645 Poznań**, działający jako osoba fizyczna („Operator”). Kontakt w sprawach danych: **hyc.kontakt@gmail.com**.

## 2. Jakie dane przetwarzamy

### 2.1. Dane konta

- adres e-mail oraz nazwa wyświetlana,
- przy logowaniu Google/Apple: identyfikator dostawcy i adres e-mail udostępniony przez dostawcę,
- identyfikator użytkownika nadany przez Firebase Authentication,
- zapis zaakceptowanej wersji Regulaminu (numer wersji i data) oraz zapisane przez Ciebie punkty,
- liczniki techniczne chroniące przed nadużyciami (m.in. liczba ostatnio dodanych komentarzy i liczba treści odrzuconych przez filtr), przypisane do konta.

Nie przechowujemy Twojego hasła do logowania Google/Apple. Uwierzytelnienie odbywa się po stronie dostawcy, a Firebase Authentication przechowuje wyłącznie token sesji. Dla kont e-mail hasło jest przechowywane przez Firebase Authentication wyłącznie w postaci skrótu.

### 2.2. Treści użytkownika (UGC)

- opisy, komentarze, nazwy oraz punkty (w tym ich współrzędne) dodawane przez Ciebie, wraz z datą i nazwą autora (nazwa autora jest widoczna publicznie przy opisach i komentarzach),
- zdjęcia punktów dodawane przez Ciebie. Przed wysłaniem Aplikacja usuwa z pliku metadane EXIF (w tym współrzędne GPS zapisane przez aparat) i zmniejsza zdjęcie; na serwer trafia sam obraz wraz z datą i nazwą autora.

Operator może wykorzystywać treści UGC w formie **zanonimizowanej i zagregowanej** (bez powiązania z Twoją tożsamością) do celów statystycznych i rozwoju Aplikacji. Dane w tej formie nie stanowią danych osobowych w rozumieniu RODO.

Dane faktograficzne o punktach (położenie, nazwa, rodzaj, numer telefonu), także o punktach dodanych lub poprawionych przez użytkowników, są częścią publicznej bazy punktów udostępnianej na licencji ODbL 1.0 (zob. Regulamin, rozdział „Dane o punktach i licencje”). Do tej bazy nie trafia nazwa autora ani identyfikator konta. Opisy, komentarze i zdjęcia nie są jej częścią; zakres licencji na Treści określa Regulamin. Osobom trzecim możemy udostępniać wyłącznie zestawienia zagregowane, z których nie da się zidentyfikować użytkownika.

### 2.3. Lokalizacja

Pozycja GPS jest używana **na urządzeniu** do wyznaczenia najbliższego punktu i nawigacji. Gdy masz nadaną zgodę systemową, Aplikacja odczytuje pozycję także przy starcie, żeby przygotować nawigację, i wczytuje z wyprzedzeniem kafle mapy w promieniu około 3 km. Pozycja pozostaje wtedy na urządzeniu. Aby obliczyć trasę po szlaku, Twoja aktualna pozycja (punkt startowy) oraz współrzędne celu są przesyłane do dostawcy routingu (**Seznam.cz a.s. / mapy.cz**) wyłącznie na czas obliczenia trasy. **Nie przechowujemy Twojej bieżącej pozycji ani historii tras na naszych serwerach.** Wyjątkiem jest sytuacja, gdy świadomie dodajesz punkt: wtedy zapisywane są współrzędne tego punktu (a nie Twojej trasy). Aplikacja nie korzysta z lokalizacji w tle.

Do statystyk (pkt 4) **nie trafiają Twoje współrzędne**. Trafia natomiast, gdy akurat jesteś w parku narodowym albo w jego 5-kilometrowym buforze, **nazwa tego parku** wraz z informacją, czy chodzi o teren parku, czy o bufor. Przynależność do parku wylicza sama Aplikacja **na Twoim urządzeniu**, porównując pozycję z granicami zapisanymi w plikach Aplikacji; na zewnątrz wychodzi wyłącznie gotowa nazwa (np. „tatrzanski”), nigdy pozycja, z której powstała. To informacja o **przybliżonym rejonie** rzędu setek kilometrów kwadratowych, nie o Twoim miejscu pobytu.

**Kafle mapy pobieramy z naszego własnego serwera** (`tiles.hycmap.com`, hosting Cloudflare R2). Serwer ten odbiera adres IP urządzenia oraz numery kafli, które oglądasz, a numer kafla wskazuje obszar mapy, więc **z samego ruchu wynika przybliżony rejon, w którym korzystasz z Aplikacji**. Nie łączymy tych żądań z Twoim kontem i nie budujemy z nich historii tras.

### 2.4. Dane techniczne i diagnostyczne

Korzystamy z narzędzi Google (Firebase Analytics, Firebase Crashlytics, Firebase Remote Config i Firebase Installations) oraz z narzędzia analitycznego **PostHog** (chmura w Unii Europejskiej) do zbierania statystyk użycia i raportów o awariach. Dane te służą poprawie stabilności i funkcji Aplikacji.

Konkretnie: narzędzia te zapisują na urządzeniu **losowe identyfikatory instalacji** (identyfikator instancji Aplikacji i identyfikator instalacji Firebase, identyfikator instalacji Crashlytics oraz identyfikator PostHog). Raport o awarii zawiera model urządzenia, wersję systemu i identyfikator instalacji. Analytics dodaje dane o urządzeniu i środowisku: model, wersję systemu i Aplikacji, język oraz kraj, region i miasto ustalane z adresu IP. Remote Config pobiera ustawienia Aplikacji (np. informację o wersji wydania) i przy tym wysyła identyfikator instalacji oraz podstawowe dane o urządzeniu. Na iOS PostHog może dodatkowo wysłać zdarzenie techniczne wielokrotnego dotknięcia tego samego miejsca ekranu (położenie dotyku na ekranie i nazwa ekranu). Nie zawierają one Twojego imienia, adresu e-mail ani współrzędnych i nie służą do reklam, ale są to identyfikatory przypisane do instalacji, a nie dane w pełni anonimowe. Odinstalowanie Aplikacji kończy ich żywotność.

Statystyki i raporty o awariach są włączone od pierwszego uruchomienia Aplikacji. Zbieranie możesz wyłączyć przełącznikiem **Anonimowe statystyki** w Menu → O aplikacji (sekcja Statystyki, na dole ekranu). Możesz też zgłosić sprzeciw mailem na adres z pkt 11 (pkt 7).

**Weryfikacja autentyczności Aplikacji (App Check).** Żeby chronić backend przed nadużyciami (boty, podrobione klienty), każde żądanie do naszych usług niesie token potwierdzający, że pochodzi z prawdziwej instalacji Aplikacji. Token wystawia **Google Play Integrity** (Android) lub **Apple App Attest / DeviceCheck** (iOS). Mechanizm sprawdza integralność aplikacji i urządzenia; nie przekazujemy przy tym Twojej tożsamości ani lokalizacji.

Korzystając z usług sieciowych (logowanie, moderacja, obliczanie tras), dostawcy wymienieni w pkt 5 odbierają dane techniczne niezbędne do realizacji żądania, w tym **adres IP** urządzenia i metadane połączenia.

## 3. Moderacja treści

Aby chronić bazę przed spamem i treściami niezgodnymi z prawem, korzystamy z **automatycznego filtra słów i wzorców** działającego w naszym backendzie. **Nie przekazujemy Twoich treści żadnemu zewnętrznemu modelowi ani usłudze moderacyjnej.** Moderacja wygląda tak:

- **opisy i nazwy punktów:** po dodaniu sprawdza je filtr (zwykle w kilka sekund). Treść wątpliwa (wulgaryzmy, groźby, linki, numer telefonu wpisany w treść opisu) trafia do ręcznego przeglądu moderatora i do jego decyzji jest ukryta, a obelgi na tle rasowym lub narodowym oraz treść wyglądająca na przypadkowy ciąg znaków są ukrywane automatycznie. Numer telefonu dodany przez użytkownika w osobnym polu formularza zawsze czeka na moderatora razem z opisem;
- **komentarze:** komentarz użytkownika, który ma już kilka zaakceptowanych komentarzy, jest widoczny od razu, a filtr sprawdza go po fakcie. Komentarze nowych użytkowników są ukryte do czasu sprawdzenia przez filtr (zwykle kilka sekund). Wulgaryzmy, obelgi na tle rasowym lub narodowym oraz treść wyglądająca na przypadkowy ciąg znaków są ukrywane automatycznie, podobnie nadmiar komentarzy dodanych w krótkim czasie (do przeglądu moderatora). Groźby, linki, reklamy, adresy e-mail i numery telefonów kierowane są do przeglądu moderatora, a komentarz kierowany do przeglądu bywa ukryty do jego decyzji;
- **zdjęcia:** nie są analizowane automatycznie i podlegają wyłącznie moderacji po zgłoszeniu. Są widoczne od razu, chyba że towarzyszą nowo dodawanemu opisowi; wtedy publikują się razem z rozstrzygnięciem tego opisu. Widoczne zdjęcie usuwa autor albo moderator po zgłoszeniu;
- **zgłoszenia:** treści zgłoszone przez innych użytkowników ocenia moderator (człowiek). Moderator może też zablokować konto naruszające Regulamin. Konto może zostać zablokowane również automatycznie, w razie seryjnego spamu (kilka treści odrzuconych przez filtr przy jednoczesnym przekroczeniu limitu komentarzy).

Automatyczne ukrycie treści nie wywołuje skutków prawnych poza ukryciem tej treści. Jeśli uważasz, że ukryto ją niesłusznie albo zablokowano Twoje konto, napisz na adres z pkt 11, a rozpatrzy to człowiek. Powód ukrycia treści lub blokady podamy na Twoją prośbę.

Każda decyzja filtra i każda decyzja moderatora jest zapisywana w rejestrze moderacyjnym (append-only) dla audytu i jakości usługi. Po usunięciu konta dane autora w rejestrze są anonimizowane, ale sama treść i decyzja pozostają.

**Podstawa prawna:** art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes: utrzymanie jakości i bezpieczeństwa usługi).

## 4. Cele i podstawy prawne (RODO)

- prowadzenie konta i świadczenie funkcji społecznościowych: wykonanie umowy (art. 6 ust. 1 lit. b),
- moderacja, bezpieczeństwo i obsługa zgłoszeń: prawnie uzasadniony interes (art. 6 ust. 1 lit. f),
- statystyki i diagnostyka: prawnie uzasadniony interes (art. 6 ust. 1 lit. f); dane nie są łączone z Twoim kontem, bez identyfikatorów reklamowych,
- obliczenie trasy i wskazanie najbliższego punktu, w tym przekazanie współrzędnych startu i celu dostawcy routingu: wykonanie usługi na Twoje żądanie (art. 6 ust. 1 lit. b); dostęp Aplikacji do GPS wymaga zgody systemowej urządzenia, którą możesz cofnąć w ustawieniach telefonu,
- utrzymanie i zabezpieczenie strony gethyc.com (logi hostingu) oraz udostępnianie bazy punktów na licencji ODbL zgodnie z jej warunkami: prawnie uzasadniony interes (art. 6 ust. 1 lit. f),
- wypełnienie obowiązków prawnych (np. podatkowych, jeśli wystąpią płatności): art. 6 ust. 1 lit. c.

**Nie sprzedajemy Twoich danych osobowych i nie udostępniamy ich reklamodawcom.** Nie budujemy profili użytkowników. Poza automatycznym ukrywaniem treści i blokadą konta w razie seryjnego spamu (pkt 3) nie podejmujemy wobec Ciebie decyzji wyłącznie zautomatyzowanych; od tych decyzji możesz żądać rozpatrzenia przez człowieka (pkt 11). Aplikacja **nie zawiera żadnego modułu reklamowego**: nie wyświetlamy reklam, nie korzystamy z identyfikatorów reklamowych i nie przekazujemy danych sieciom reklamowym. Udostępnianie danych o punktach opisuje pkt 2.2.

**Podanie danych jest dobrowolne.** Bez adresu e-mail i nazwy wyświetlanej nie założysz konta; przeglądanie mapy i nawigacja działają bez konta. Bez zgody systemowej na lokalizację Aplikacja nie wskaże najbliższego punktu.

### 4.1. Zakres statystyk (Analytics)

Aplikacja wysyła zdarzenia z następujących kategorii:

- **wyszukanie punktu i dotarcie do niego**, czyli czy ludzie faktycznie docierają tam, dokąd ich prowadzimy,
- **przebieg nawigacji:** jej rozpoczęcie, świadoma zmiana trybu wyszukiwania i kategorii, zakończenie wraz z powodem, użyte przybliżenie mapy, wyświetlenie samouczka,
- **trasa:** wyznaczenie trasy (dystans, czas, przewyższenie), nieudane wyznaczenie wraz z etapem niepowodzenia oraz automatyczne uproszczenie zapytania o trasę przy słabym łączu,
- **interakcje z kartą punktu:** zapisanie punktu, dodanie komentarza, tapnięcie numeru telefonu (**bez samego numeru**), przeciągnięcie karty,
- **dodawanie treści:** dodanie punktu (jego rodzaj) i zdjęć (liczba, powodzenie wczytania),
- **lokalizacja:** nadanie lub odmowa zgody systemowej oraz wynik ustalenia pozycji (dokładność w metrach, powód niepowodzenia), **bez współrzędnych**,
- **wejście do parku narodowego** (zob. niżej),
- **cykl życia Aplikacji:** otwarcie, podpowiedź o aktualizacji, tapnięcie przycisku wsparcia projektu.

Do zdarzeń dołączamy identyfikator punktu, tryb wyszukiwania, źródło punktu (baza punktów w Aplikacji / dodany przez użytkowników) oraz proste etykiety i liczby techniczne (np. powód zakończenia nawigacji, dystans w metrach lub kilometrach, czas w minutach). **Nie dołączamy Twojego identyfikatora użytkownika, adresu e-mail, nazwy wyświetlanej ani współrzędnych** i nie łączymy tych zdarzeń z Twoim kontem. Zdarzenia są jednak przypisane do instalacji (pkt 2.4), więc są to dane pseudonimowe, a nie w pełni anonimowe. Analizujemy je zbiorczo, po to, żeby wiedzieć, które funkcje działają, a które zawodzą. Firebase Analytics zbiera ponadto własne zdarzenia automatyczne (m.in. pierwsze otwarcie, początek sesji, wyświetlenia ekranów).

**Park narodowy.** Zdarzenia wyszukania, dotarcia i wejścia do parku niosą **nazwę parku narodowego** oraz informację, czy chodzi o teren parku, czy o jego 5-kilometrowy bufor. To dana o **przybliżonym rejonie**. Klasyfikację wykonuje sama Aplikacja na urządzeniu (pkt 2.3), więc na zewnątrz wychodzi wyłącznie gotowa nazwa, nigdy współrzędne, z których powstała.

## 5. Odbiorcy danych

- **Google Firebase** (Authentication, Cloud Firestore, Cloud Functions, Analytics, Crashlytics, Remote Config, Installations, App Check): hosting danych i logika backendu,
- **PostHog** (PostHog, Inc., chmura w Unii Europejskiej): statystyki użycia opisane w pkt 4.1,
- **Seznam.cz a.s. (mapy.cz):** obliczanie tras (routing); otrzymuje przesłane współrzędne (start i cel) oraz adres IP urządzenia na czas obliczenia trasy i przetwarza je na warunkach swoich usług,
- **Cloudflare, Inc.:** hosting kafli mapy (`tiles.hycmap.com`) oraz przechowywanie i udostępnianie zdjęć dodanych przez użytkowników (`photos.hycmap.com`), czyli magazyn R2 i sieć CDN; odbiera adres IP i numery pobieranych kafli,
- **GitHub, Inc. (GitHub Pages):** hosting strony gethyc.com; odbiera adres IP i nagłówki żądań,
- **Resend (Resend, Inc.):** wysyłka wiadomości e-mail Aplikacji (powitanie, weryfikacja adresu, reset hasła); otrzymuje Twój adres e-mail i treść wiadomości,
- **Google** (Play Integrity) oraz **Apple** (App Attest / DeviceCheck): weryfikacja autentyczności instalacji Aplikacji,
- **Google** oraz **Apple:** logowanie przez Google Sign-In / Sign in with Apple.

Firebase, PostHog, Cloudflare i Resend przetwarzają dane jako podmioty przetwarzające na podstawie umów powierzenia (DPA) zgodnych z RODO. Dane przesyłamy z szyfrowaniem w tranzycie (TLS), a dostęp do backendu ograniczają reguły bezpieczeństwa. Logowanie Google/Apple wiąże się z przetwarzaniem przez odpowiednio Google i Apple zgodnie z ich politykami prywatności.

## 6. Przekazywanie poza EOG

Niektóre dane mogą być przekazywane do Stanów Zjednoczonych (Google Firebase, a w zakresie infrastruktury także podmioty amerykańskie, jak PostHog, Inc., Cloudflare, Inc., Resend, Inc. i GitHub, Inc.). Podstawą przekazania jest decyzja wykonawcza Komisji UE 2023/1795 (Data Privacy Framework, dla podmiotów certyfikowanych) oraz standardowe klauzule umowne (SCC) przyjęte przez Komisję UE. Kopię zabezpieczeń możesz uzyskać pod adresem z pkt 11.

## 7. Twoje prawa

Masz prawo do: dostępu do danych, sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia danych, sprzeciwu (w tym wobec statystyk i diagnostyki) oraz wycofania zgody, jeśli przetwarzanie opiera się na zgodzie.

Zbieranie statystyk możesz wyłączyć samodzielnie przełącznikiem **Anonimowe statystyki** w Menu → O aplikacji (sekcja Statystyki, na dole ekranu). Skutek jest natychmiastowy. Sprzeciw lub inne żądanie dotyczące statystyk i diagnostyki możesz też zgłosić mailem na adres z pkt 11. Dane statystyczne nie są powiązane z Twoim kontem ani adresem e-mail. Żeby mimo to odnaleźć dane Twojej instalacji w Firebase Analytics, podaj w zgłoszeniu identyfikator instalacji widoczny w Aplikacji (Menu → O aplikacji). Zgłoszony sprzeciw rozpatrzymy w ciągu jednego miesiąca od otrzymania (art. 12 RODO) i wyłączymy zbieranie dla wskazanej instalacji w Firebase Analytics. Dane w PostHog nie są dziś powiązane z tym identyfikatorem i pozostają poza zasięgiem takiego żądania. Zbieranie kończy się też z chwilą odinstalowania Aplikacji.

Konto i powiązane dane usuniesz w Aplikacji (Profil, Usuń konto); kasowanie następuje w ciągu 30 dni. Wobec automatycznego ukrycia treści (pkt 3) możesz żądać rozpatrzenia przez człowieka. Przysługuje Ci skarga do Prezesa Urzędu Ochrony Danych Osobowych (PUODO).

## 8. Okres przechowywania

- dane konta: do czasu usunięcia konta (kasowanie w ciągu 30 dni; kopie zapasowe do 7 dni dłużej),
- Treści UGC: do czasu ich usunięcia przez Ciebie lub moderację; publicznie udostępnione opisy mogą pozostać jako element punktu w formie zanonimizowanej (zob. Regulamin),
- zdjęcia: pozostają jako element punktu również po usunięciu konta, ale w formie zanonimizowanej (usuwamy powiązanie z Twoim kontem i nazwą); usuwasz je sam albo moderator na zgłoszenie,
- rejestr moderacyjny: przez okres świadczenia usługi, dla celów audytu i bezpieczeństwa (dane autora anonimizowane po usunięciu konta),
- dane analityczne: Firebase Analytics według ustawień retencji narzędzia, nie dłużej niż 14 miesięcy; PostHog do 12 miesięcy; raporty awarii Crashlytics 90 dni.

## 9. Dzieci

Konto w Aplikacji mogą założyć wyłącznie osoby, które ukończyły 16 lat. Aplikacja nie jest skierowana do dzieci. Przeglądanie mapy i nawigacja nie wymagają konta ani podawania danych osobowych.

## 10. Zmiany polityki

O istotnych zmianach poinformujemy w Aplikacji. Aktualna wersja jest zawsze dostępna pod tym adresem.

## 11. Kontakt

W sprawach prywatności: **hyc.kontakt@gmail.com**.
