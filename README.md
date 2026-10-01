# BookForge Reader

Responsywny czytnik książki w języku polskim. Czysty HTML, CSS i JavaScript; bez instalowania zależności i bez serwera aplikacji.

## Uruchomienie

Wymagany Python 3 do lokalnego serwera, Node 20+ do testów.

```sh
npm start
```

Otwórz `http://localhost:8000`. Moduły ES wymagają serwera HTTP — nie otwieraj `index.html` przez `file://`. Pliki można również umieścić na dowolnym hostingu statycznym, także w podkatalogu. Repozytorium samo nie uruchamia publikacji ani GitHub Pages.

## Funkcje

- Spis treści i nawigacja rozdziałami (również strzałki klawiatury).
- Trzy motywy: noc, papier, sepia; wielkość tekstu, interlinia, szerokość i krój pisma.
- Zapamiętywanie rozdziału i pozycji oraz zakładki z powrotem do fragmentu.
- Import TXT i JSON; ilustracje między akapitami z podpisami i opisami alternatywnymi.
- Książka i dołączone grafiki w IndexedDB, postęp i ustawienia w localStorage.
- Układ mobilny, obsługa klawiatury, semantyczny HTML i czytelny fokus.

## Rękopis i grafiki

Startowa książka to **jawnie oznaczona demonstracja interfejsu**, nie rękopis powieści. Aktualna książka i wcześniejsze grafiki nie zostały dołączone ani opublikowane w tym publicznym repozytorium.

Przycisk **Wczytaj książkę** przyjmuje TXT lub JSON (do 20 MB). W TXT rozdziały zaczynaj osobną linią `Rozdział I`, `Rozdział 2` albo nagłówkiem Markdown `# Tytuł`. Puste linie oddzielają akapity. Pliki Word, PDF i EPUB nie są obsługiwane w tej wersji; tekst z Google Docs można wyeksportować jako TXT.

Format JSON znajduje się w `book.example.json`. `id` książki musi być stałe i unikalne; rozdziały mają unikalne `id`. Bloki to `paragraph` (pole `text`), `notice` (pole `text`) lub `image` (`src`, `alt`, `caption`). Tekst jest renderowany jako tekst, bez interpretacji HTML.

Grafiki można umieścić na hostingu pod względnymi ścieżkami podanymi w `src`, użyć HTTPS albo osadzić rastrowy obraz jako data URL. Jeśli grafika nie jest dostępna, czytnik pokaże przycisk **Dodaj ilustracje**. Wybierz pliki PNG, JPG, WebP lub GIF (do 10 MB każdy), których nazwy odpowiadają nazwom końcowym w `src`. Nazwy grafik w jednej książce muszą być unikalne. Dołączone obrazy zostają na urządzeniu; nie są wysyłane do GitHuba ani innych usług.

Dane są przypisane do przeglądarki i adresu strony. Nie synchronizują się między urządzeniami; czyszczenie danych witryny je usuwa. Zachowaj pliki źródłowe. Pozycja jest zapisywana jako procent długości rozdziału, więc zmiana szerokości okna lub czcionki może ją lekko przesunąć. Obrazy pochodzące z adresów HTTPS są pobierane z zewnętrznego serwera.

## Testy

```sh
npm test
```

Testy sprawdzają parsowanie rozdziałów, walidację importu, niedozwolone adresy obrazów i obliczanie czasu czytania.
