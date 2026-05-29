# Landstreff Stavanger 2026 — Redesign

Redesign-prototype av nettsida til **Landstreff Stavanger 2026**, laga som mappeoppgåve 2 i emnet **IS-217 (Universell utforming / web)** ved Universitetet i Agder.

🔗 **Live-versjon:** https://kristianespevikuia.github.io/IS217REDESIGN/

![Status](https://img.shields.io/badge/deploy-GitHub%20Pages-success)
![Språk](https://img.shields.io/badge/spr%C3%A5k-Norsk%20%2F%20English-blue)

---

## Om prosjektet

Dette er ein interaktiv prototype som viser eit forslag til redesign av Landstreff-nettsida med vekt på **universell utforming (UU)**. Sida demonstrerer mellom anna:

- Tydeleg visuelt hierarki og lesbar typografi
- Tospråkleg innhald (norsk / engelsk)
- Tilgjengeleg navigasjon med «hopp til hovudinnhald», fokusmarkering og semantisk struktur
- Responsivt oppsett som fungerer på mobil og desktop

Prototypen er bygd som ein **React-applikasjon** som blir transpilert i nettlesaren med Babel. Alle ressursar (skriftsnitt, bibliotek) ligg lokalt i repoet, så sida fungerer utan eksterne avhengigheiter.

## Mappestruktur

```
IS217REDESIGN/
├── index.html              # HTML-struktur og innlasting av skript
├── css/
│   └── styles.css          # All CSS (inkl. @font-face)
├── js/
│   ├── app.jsx             # Hovudapplikasjonen (React-komponentar + i18n)
│   ├── tweaks-panel.jsx    # Hjelpekomponentar for prototype-panelet
│   └── vendor/             # Tredjepartsbibliotek (lokale)
│       ├── react.js
│       ├── react-dom.js
│       └── babel.min.js
├── assets/
│   └── fonts/              # Skriftsnitt (Bricolage Grotesque, Geist Sans, JetBrains Mono)
├── .github/workflows/
│   └── deploy.yml          # Automatisk deploy til GitHub Pages
├── README.md
└── .gitignore
```

> **Merk:** Sida brukar React + Babel i nettlesaren, så `.jsx`-filene blir kompilerte ved sidelasting. Det krev ingen byggjesteg lokalt — du treng berre ein enkel webtenar (sjå under).

## Køyre lokalt

Fordi nettlesaren hentar `.jsx`-filer via `fetch`, må sida serverast over HTTP (ikkje opnast direkte som `file://`).

**Alternativ 1 — Python (følgjer med dei fleste system):**

```bash
git clone https://github.com/KristianEspevikUIA/IS217REDESIGN.git
cd IS217REDESIGN
python -m http.server 8000
```

Opne så `http://localhost:8000` i nettlesaren.

**Alternativ 2 — Node:**

```bash
npx serve .
```

**Alternativ 3 — VS Code:** Installer utvidinga *Live Server* og høgreklikk på `index.html` → *Open with Live Server*.

## Bruk

1. Opne live-lenka eller den lokale adressa.
2. Naviger mellom sidene via toppmenyen.
3. Bytt språk med språkveljaren (Norsk / English).
4. Test UU-funksjonane: Tab-navigasjon, «hopp til hovudinnhald» og fokusmarkering.

## Deploy

Endringar som blir pusha til `main` blir automatisk publiserte til GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`). Live-sida oppdaterer seg sjølv kort tid etter kvar push.

## Teknologi

- React 18 (utviklingsbygg)
- Babel Standalone (transpilering i nettlesar)
- Vanleg HTML5 + CSS3
- GitHub Pages + GitHub Actions

## Lisens

Sjå [LICENSE](LICENSE). Skriftsnitt og tredjepartsbibliotek er underlagde sine eigne lisensar.

---

*Laga av Kristian Espevik — IS-217, Universitetet i Agder, 2026.*
