# Mak-Went: strona internetowa (projekt v0.1)

Statyczny prototyp strony firmy Mak-Went (wentylacja, chłodnictwo, klimatyzacja, rekuperacja).
Czysty HTML, CSS i JavaScript, bez zależności i bez kroku budowania.

## Podgląd lokalny

```bash
python3 -m http.server 8000
```

Potem `http://localhost:8000/`. Pliki działają też otwarte wprost z dysku, ale formularz
i galeria zachowują się wtedy jak na serwerze tylko w Chrome i Firefoksie.

## Mapa stron

| Plik | Strona |
|---|---|
| `index.html` | Strona główna: oferta, typy obiektów, kroki współpracy, dowody, realizacje, FAQ, formularz |
| `wentylacja.html` | Usługa: wentylacja |
| `chlodnictwo.html` | Usługa: chłodnictwo |
| `klimatyzacja.html` | Usługa: klimatyzacja |
| `rekuperacja.html` | Usługa: rekuperacja |
| `realizacje.html` | Galeria realizacji z filtrem po usłudze |
| `kontakt.html` | Formularz zapytania, adres biura, wizytówki osób |
| `polityka-prywatnosci.html` | Miejsce na politykę prywatności (treść do dostarczenia) |

## Struktura

```
assets/
  tokens.css      zmienne: kolory, typografia, odstępy (jedyne źródło wartości)
  style.css       komponenty i układ
  strona.js       menu, akordeony, galeria z powiększeniem, filtr realizacji, walidacja formularzy
  fonts/          Barlow i Barlow Condensed (woff2, latin + latin-ext), fonts.css
  img/            logo SVG, favicon, tła hero, ilustracje oferty
  foto/<usługa>/  zdjęcia realizacji od klienta; podfolder m/ to wersje 640 px do miniatur
```

## Do zrobienia przed wdrożeniem

**Formularze nic nie wysyłają.** Oba formularze (`#formularz` na stronie głównej, usługach
i w kontakcie, `#szybka` na stronach usług) mają walidację po stronie przeglądarki i po
poprawnym wypełnieniu pokazują podziękowanie. Wysyłkę (endpoint, mail do biura, ochrona przed
spamem) podpina developer w `assets/strona.js`, w obsłudze zdarzenia `submit`.

**Dane przykładowe do podmiany.** Elementy z atrybutem `data-przyklad` zawierają liczby
i opinię wstawione roboczo, nie od klienta:

- sekcja dowodów na stronach głównej i usług: 15+ lat na rynku, 500+ instalacji,
  F-gaz (certyfikat UDT), 4,9/5 w Google i cytat opinii;
- linia pod przyciskami w hero: 4,9/5 w Google i 15+ lat na rynku.

Cytat opinii nie pochodzi od klienta Mak-Went i nie może zostać na stronie produkcyjnej.
Liczby trzeba potwierdzić z klientem albo usunąć.

**Treści, których brakuje od klienta:**

- godziny pracy biura;
- NIP i pełna nazwa firmy do stopki (w rejestrach są dwa podmioty Mak-Went, klient wskazuje właściwy);
- treść polityki prywatności i dane administratora danych.

**Grafiki.** Ilustracje oferty i typów obiektów (`assets/img/usl-*.webp`, `obiekt-*.webp`,
`serwis.webp`) są wygenerowane; tło hero i galerie to zdjęcia klienta. Favicon to propozycja
oparta na logo, czeka na akceptację.

## Prywatność (RODO)

Strona nie ładuje zasobów z zewnętrznych serwerów i nie śledzi odwiedzających: fonty są
lokalne, nie ma map, filmów osadzonych z YouTube, analityki ani pikseli. Baner cookies nie
jest potrzebny, dopóki to się nie zmieni.

Po stronie klienta zostaje:

- treść polityki prywatności (strona `polityka-prywatnosci.html` ma tylko miejsce na nią);
- dane administratora do klauzuli przy zgodzie w formularzu;
- jeśli dojdzie analityka, mapa albo film: baner zgód i wpis w polityce prywatności.

W kodzie produkcyjnym nie powinno być `<meta name="robots" content="noindex">`. Podgląd
na GitHub Pages ma go tylko w gałęzi `gh-pages`.
