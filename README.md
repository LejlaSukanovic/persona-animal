
# Persona Animal

Persona Animal je spletna aplikacija, ki uporabnikom omogoča interakcijo z različnimi entitetami (npr. živali) preko samoocenjevanja in funkcij ujemanja. Projekt uporablja EJS za templating in vključuje animacije ter interaktivne elemente z Lottie datotekami.

## Kazalo

- [Pregled Projekta](#pregled-projekta)
- [Funkcionalnosti](#funkcionalnosti)
- [Namestitev](#namestitev)
- [Uporaba](#uporaba)
- [Struktura Frontend-a](#struktura-frontend-a)
- [Struktura Backend-a](#struktura-backend-a)
- [API Končne Točke](#api-končne-točke)
- [Prispevanje](#prispevanje)
- [Licenca](#licenca)

## Pregled Projekta

Persona Animal omogoča uporabnikom:
- Izbiro entitet (npr. živali) in ogled njihovih podrobnosti.
- Izvajanje samoocenjevanja na podlagi različnih kategorij.
- Ogled in upravljanje zgodovine ujemanj.
- Registracijo in prijavo za upravljanje svojih profilov.

## Funkcionalnosti

- **Izbira Entitete**: Uporabniki lahko izberejo med seznamom entitet.
- **Samoocenitev**: Uporabniki lahko izvajajo samoocenjevanje na podlagi različnih kategorij.
- **Pregled Ujemanj**: Uporabniki lahko pregledajo zgodovino svojih ujemanj in podrobnosti vsakega ujemanja.
- **Avtentikacija**: Registracija in prijava uporabnikov.

## Namestitev

Za lokalno poganjanje projekta sledite tem korakom:

1. **Klonirajte repozitorij**:
   ```bash
   git clone https://github.com/yourusername/persona-animal.git
   cd persona-animal
   ```

2. **Namestite odvisnosti**:
   ```bash
   npm install
   ```

3. **Zaženite strežnik**:
   ```bash
   npm start
   ```

4. **Odprite brskalnik** in navigirajte na `http://localhost:3000`.

## Uporaba

### Struktura Frontend-a

- **izbiraEntitete.ejs**: Stran za izbiro entitet.
- **samoocenitev.ejs**: Stran za samoocenitev.
- **pregledOcenitve.ejs**: Stran za pregled samoocenitve.
- **prijava.ejs**: Stran za prijavo in registracijo.
- **zgodovinaUjemanja.ejs**: Stran za ogled zgodovine ujemanj.
- **pregledUjemanja.ejs**: Stran za pregled določenega ujemanja.
- **novUporabnik.ejs**: Stran za dodajanje novega uporabnika.
- **izbiraEntiteteUjemanje.ejs**: Stran za izbiro entitet za ujemanje.

### Struktura Backend-a

#### `index.js`
Glavni vstopni točki aplikacije:
- Nastavi Express strežnik.
- Inicializira Firebase aplikacijo.
- Določi seje in statične poti.
- Definira usmerjanje za različne poti (samoocenitev, ujemanje, prijava).

#### `firebase.js`
Konfiguracija in inicializacija Firebase:
- Inicializira Firebase aplikacijo in Firestore bazo podatkov.
- Definira funkcije za delo z bazo podatkov (pridobivanje, shranjevanje, brisanje podatkov).

#### `prijavaRoutes.js`
Usmerjevalnik za prijavo in registracijo:
- Registracijska pot: Preverja, ali email že obstaja, in ustvari novega uporabnika.
- Prijavna pot: Prijavi uporabnika in shrani sejne podatke.
- Odjava: Izbriše sejo uporabnika.

#### `samoocenitevRoutes.js`
Usmerjevalnik za samoocenitev:
- Pridobi kategorije za samoocenitev.
- Pridobi podatke o entitetah glede na kategorijo.
- Shranjuje rezultate samoocenitve.

#### `ujemanjeRoutes.js`
Usmerjevalnik za ujemanje:
- Pridobi in prikaže zgodovino ujemanj.
- Doda nove uporabnike za ujemanje.
- Izračuna in prikaže rezultat ujemanja med dvema entitetama.

### API Končne Točke

#### Prijava in Registracija

- **POST /register**: Registracija novega uporabnika.
- **POST /login**: Prijava obstoječega uporabnika.
- **POST /logout**: Odjava uporabnika.

#### Samoocenitev

- **GET /samoocenitev**: Pridobi kategorije za samoocenitev.
- **GET /samoocenitev/izbiraEntitete/:kategorija**: Pridobi entitete za določeno kategorijo.
- **GET /samoocenitev/rezultat/:entitetaId/:kategorija**: Shranjuje rezultat samoocenitve.

#### Ujemanje

- **GET /ujemanje**: Pridobi zgodovino ujemanj.
- **GET /ujemanje/novUporabnik/:category**: Prikaže stran za dodajanje novega uporabnika.
- **POST /ujemanje/dodajUporabnika/:idPrijavljenog**: Dodaja novega uporabnika za ujemanje.
- **GET /ujemanje/izbiraEntitete/:idUporabnik/:kategorija**: Pridobi entitete za določeno kategorijo.
- **GET /ujemanje/pregledUjemanja/:entiteta1/:entiteta2**: Prikaže rezultat ujemanja med dvema entitetama.

## Prispevanje

Prispevki so dobrodošli! Sledite tem korakom za prispevanje:

1. Forkajte repozitorij.
2. Ustvarite novo vejo: `git checkout -b feature-branch-name`.
3. Naredite spremembe in jih committajte: `git commit -m 'Dodaj funkcionalnost'`.
4. Potisnite na vejo: `git push origin feature-branch-name`.
5. Pošljite pull request.

## Licenca

Ta projekt je licenciran pod MIT licenco. Za več informacij si oglejte datoteko [LICENSE](LICENSE).