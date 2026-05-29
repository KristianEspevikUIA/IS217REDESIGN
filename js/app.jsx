/* global React, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakColor */
const { useState, useEffect, useRef, useCallback } = React;

// Tweakable defaults (host can rewrite this block on disk)
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "lodgingPosition": "bottom",
  "accent": "#b5371a",
  "ctaPad": 26,
  "showA11yBadge": true
}/*EDITMODE-END*/;

// ============================================
// I18N
// ============================================
const TXT = {
  no: {
    skip: "Hopp til hovedinnhold",
    siteLang: "Norsk",
    siteLangAlt: "English",
    a11y: "Tilgjengelighet",
    search: "Søk på nettstedet",
    searchPh: "Søk artister, FAQ, overnatting…",
    buyTickets: "Kjøp billett",
    openMenu: "Åpne meny",
    closeMenu: "Lukk meny",
    nav: {
      home: "Forside",
      artists: "Artister",
      lodging: "Overnatting",
      faq: "FAQ",
      contact: "Kontakt",
    },
    hero: {
      eyebrow: "Norges største russetreff",
      titleA: "Landstreff",
      titleB: "Stavanger 2026",
      dateLabel: "Dato",
      dateValue: "1.–3. mai 2026",
      locLabel: "Sted",
      locValue: "Stavanger forum, Gamlingen",
      statusLabel: "Status",
      statusValue: "Utsolgt — venteliste åpen",
      ageLabel: "Aldersgrense",
      ageValue: "18 år",
      ctaPrimary: "Sett deg på venteliste",
      ctaSecondary: "Se hele programmet",
    },
    quick: {
      a: { l: "Program", v: "23 artister", s: "3 scener · 50 timer musikk" },
      b: { l: "Overnatting", v: "3 alternativer", s: "Fra 990 kr / pers" },
      c: { l: "Innsjekk", v: "Onsdag 14:00", s: "Stavanger forum, hovedinngang" },
      d: { l: "Hjelp", v: "Døgnvakt 24/7", s: "+47 51 00 00 00" },
    },
    artists: {
      title: "Artister 2026",
      lede: "23 navn fordelt på tre scener. Hovedscene, klubbscene og DJ-telt.",
      cta: "Se hele lineupen",
      detail: {
        bio: "Biografi",
        stage: "Scene",
        time: "Spilletid",
        playlist: "Spilleliste",
        share: "Del med vennene dine",
        close: "Lukk",
        bioPlaceholder: "Artistbio settes inn av Landstreff-redaksjonen før release.",
      },
    },
    lodging: {
      title: "Overnatting",
      lede: "Alle alternativer er innenfor 15 min fra Stavanger forum. Velg det som passer russegruppa best.",
      compareTitle: "Sammenlign overnatting",
      groupBooking: "Gruppebooking",
      groupNote: "Russegrupper på 10+ får 10 % rabatt og garantert plass på samme rom/område.",
      book: "Reserver plass",
    },
    faq: {
      title: "Spørsmål og svar",
      lede: "Finn raskt svar. Bruk piltastene for å bla mellom spørsmål.",
      cats: ["Alle", "Billett", "Overnatting", "Praktisk", "Sikkerhet"],
    },
    contact: {
      title: "Kontakt oss",
      lede: "Vi svarer normalt innen 24 timer på hverdager. Døgnvakt under arrangementet.",
      formTitle: "Send oss en melding",
      name: "Navn",
      email: "E-post",
      topic: "Hva gjelder det?",
      message: "Melding",
      send: "Send melding",
      sent: "Takk! Vi tar kontakt på e-post innen 24 timer.",
    },
    extMod: {
      title: "Du forlater landstreff.no",
      body: "Billettsalget håndteres av Ticketmaster. Du sendes til ticketmaster.no for å fullføre kjøpet.",
      go: "Fortsett til Ticketmaster",
      stay: "Bli her",
    },
    cookie: {
      title: "Vi bruker informasjonskapsler",
      body: "Vi bruker kun nødvendige cookies for at nettsiden skal fungere, og valgfrie cookies for statistikk. Du kan endre dette når som helst.",
      accept: "Godta alle",
      necessary: "Kun nødvendige",
    },
    a11yPanel: {
      title: "Tilgjengelighet",
      textSize: "Tekststørrelse",
      contrast: "Kontrast",
      motion: "Animasjon",
      sizes: ["Standard", "Stor", "Ekstra stor"],
      contrasts: ["Standard", "Høy", "Mørk"],
      motions: ["På", "Redusert"],
      reset: "Tilbakestill",
      close: "Lukk",
    },
  },
  en: {
    skip: "Skip to main content",
    siteLang: "English",
    siteLangAlt: "Norsk",
    a11y: "Accessibility",
    search: "Search the site",
    searchPh: "Search artists, FAQ, lodging…",
    buyTickets: "Buy ticket",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    nav: {
      home: "Home",
      artists: "Artists",
      lodging: "Lodging",
      faq: "FAQ",
      contact: "Contact",
    },
    hero: {
      eyebrow: "Norway's biggest graduation festival",
      titleA: "Landstreff",
      titleB: "Stavanger 2026",
      dateLabel: "Date",
      dateValue: "May 1–3, 2026",
      locLabel: "Venue",
      locValue: "Stavanger Forum, Gamlingen",
      statusLabel: "Status",
      statusValue: "Sold out — waitlist open",
      ageLabel: "Age limit",
      ageValue: "18+",
      ctaPrimary: "Join the waitlist",
      ctaSecondary: "See full programme",
    },
    quick: {
      a: { l: "Programme", v: "23 artists", s: "3 stages · 50 hours of music" },
      b: { l: "Lodging", v: "3 options", s: "From NOK 990 / person" },
      c: { l: "Check-in", v: "Wednesday 14:00", s: "Stavanger Forum, main entrance" },
      d: { l: "Help", v: "24/7 hotline", s: "+47 51 00 00 00" },
    },
    artists: {
      title: "Artists 2026",
      lede: "23 acts across three stages. Main, club and DJ tent.",
      cta: "See full lineup",
      detail: {
        bio: "Biography",
        stage: "Stage",
        time: "Set time",
        playlist: "Playlist",
        share: "Share with friends",
        close: "Close",
        bioPlaceholder: "Artist bio added by the Landstreff team before release.",
      },
    },
    lodging: {
      title: "Lodging",
      lede: "All options within 15 min of Stavanger Forum. Pick what fits your group.",
      compareTitle: "Compare options",
      groupBooking: "Group booking",
      groupNote: "Groups of 10+ get a 10 % discount and guaranteed adjacent rooms.",
      book: "Reserve",
    },
    faq: {
      title: "Frequently asked questions",
      lede: "Find answers fast. Use arrow keys to move between questions.",
      cats: ["All", "Ticket", "Lodging", "Practical", "Safety"],
    },
    contact: {
      title: "Contact us",
      lede: "Replies within 24 hours on weekdays. 24/7 hotline during the event.",
      formTitle: "Send us a message",
      name: "Name",
      email: "Email",
      topic: "Topic",
      message: "Message",
      send: "Send message",
      sent: "Thanks! We'll reply by email within 24 hours.",
    },
    extMod: {
      title: "You're leaving landstreff.no",
      body: "Ticket sales are handled by Ticketmaster. You'll be sent to ticketmaster.no to complete your purchase.",
      go: "Continue to Ticketmaster",
      stay: "Stay here",
    },
    cookie: {
      title: "We use cookies",
      body: "We use only necessary cookies for the site to work, plus optional cookies for analytics. You can change this anytime.",
      accept: "Accept all",
      necessary: "Necessary only",
    },
    a11yPanel: {
      title: "Accessibility",
      textSize: "Text size",
      contrast: "Contrast",
      motion: "Motion",
      sizes: ["Default", "Large", "Extra large"],
      contrasts: ["Default", "High", "Dark"],
      motions: ["On", "Reduced"],
      reset: "Reset",
      close: "Close",
    },
  },
};

// ============================================
// DATA
// ============================================
const ARTISTS = [
  { id: "a01", name: "Karpe", sub: "Headliner · Hovedscene", initials: "KP", stage: "Hovedscene", time: "Fre 22:30", size: "lg" },
  { id: "a02", name: "Astrid S", sub: "Hovedscene", initials: "AS", stage: "Hovedscene", time: "Tor 21:00", size: "lg" },
  { id: "a03", name: "Cezinando", sub: "Hovedscene", initials: "CZ", stage: "Hovedscene", time: "Lør 22:00" },
  { id: "a04", name: "Sigrid", sub: "Hovedscene", initials: "SG", stage: "Hovedscene", time: "Fre 20:30" },
  { id: "a05", name: "Ramón", sub: "Klubbscene", initials: "RM", stage: "Klubbscene", time: "Lør 23:30" },
  { id: "a06", name: "Marcus & Martinus", sub: "Hovedscene", initials: "MM", stage: "Hovedscene", time: "Lør 20:30" },
  { id: "a07", name: "Tix", sub: "Hovedscene", initials: "TX", stage: "Hovedscene", time: "Tor 22:30" },
  { id: "a08", name: "Bjørnskov", sub: "Klubbscene", initials: "BJ", stage: "Klubbscene", time: "Fre 01:00" },
  { id: "a09", name: "Hkeem", sub: "Klubbscene", initials: "HK", stage: "Klubbscene", time: "Tor 23:30" },
  { id: "a10", name: "Ravi", sub: "DJ-telt", initials: "RV", stage: "DJ-telt", time: "Fre 02:00" },
  { id: "a11", name: "Unge Ferrari", sub: "Klubbscene", initials: "UF", stage: "Klubbscene", time: "Lør 00:30" },
  { id: "a12", name: "Lars Vaular", sub: "Hovedscene", initials: "LV", stage: "Hovedscene", time: "Fre 19:00" },
  { id: "a13", name: "Annika Momrak", sub: "DJ-telt", initials: "AM", stage: "DJ-telt", time: "Lør 01:00" },
  { id: "a14", name: "Sondre Justad", sub: "Klubbscene", initials: "SJ", stage: "Klubbscene", time: "Tor 20:00" },
  { id: "a15", name: "Kohld", sub: "DJ-telt", initials: "KO", stage: "DJ-telt", time: "Tor 01:30" },
  { id: "a16", name: "+ 8 navn til", sub: "Slippes 1. mars", initials: "···", stage: "TBA", time: "TBA", placeholder: true },
];

const LODGING = [
  {
    id: "hotel",
    name: "Hotell",
    price: "Fra 1 890 kr / natt",
    initials: "HOT",
    desc: "Privatrom på partnerhoteller innen 10 min fra forumet. Inkluderer frokost og sengetøy.",
    features: [
      { ok: true, t: "Privatrom 2–4 personer" },
      { ok: true, t: "Frokost inkludert" },
      { ok: true, t: "Sengetøy og håndkle" },
      { ok: true, t: "Heis og rullestoltilgang" },
      { ok: true, t: "Stillesoner etter 23:00" },
    ],
  },
  {
    id: "camp",
    name: "Camp",
    price: "Fra 990 kr / pers",
    initials: "CMP",
    desc: "Telt-camp ved siden av festivalområdet. Inkluderer telt, liggeunderlag og frokostbillett.",
    features: [
      { ok: true, t: "Forhåndsoppsatt 4-manns telt" },
      { ok: true, t: "Liggeunderlag og lykt" },
      { ok: true, t: "Felles dusj og toalett" },
      { ok: true, t: "Døgnvakt og oppbevaring" },
      { ok: false, t: "Sengetøy ikke inkludert" },
    ],
  },
  {
    id: "studio",
    name: "Studio",
    price: "Fra 2 490 kr / natt",
    initials: "STU",
    desc: "Større leiligheter for grupper på 6–10 personer. Felles kjøkken, eget bad og soverom.",
    features: [
      { ok: true, t: "Plass til 6–10 personer" },
      { ok: true, t: "Eget kjøkken og bad" },
      { ok: true, t: "Sengetøy inkludert" },
      { ok: true, t: "Gratis WiFi" },
      { ok: false, t: "Frokost kommer i tillegg" },
    ],
  },
];

const FAQ = [
  { cat: 1, q: "Når slippes billetter til LS2027?", a: "Billetter til LS2027 slippes torsdag 5. juni 2026 kl 18:00 via Ticketmaster. Vi varsler alle på nyhetsbrevet 24 timer i forveien. Det blir også et eget forhåndssalg for de som var med på LS2026." },
  { cat: 1, q: "Kan jeg refundere billetten min?", a: "Billetter er som hovedregel ikke refunderbare. Hvis du blir syk og kan dokumentere det med legeerklæring, kan vi refundere innenfor 14 dager før arrangementet. Du kan også selge billetten videre via Ticketmaster Resale." },
  { cat: 2, q: "Hvor mange er det plass til i Camp?", a: "Camp har plass til 2 400 personer fordelt på forhåndsoppsatte 4-manns telt. Du kan booke alene, i par eller hele teltet for gruppa. Gruppebookinger på 10+ plasseres ved siden av hverandre." },
  { cat: 2, q: "Hva er forskjellen på Hotell, Camp og Studio?", a: "Hotell gir privatrom og frokost, Camp er den rimeligste løsningen rett ved festivalområdet, og Studio passer for større russegrupper som vil bo sammen. Se sammenligningstabellen på Overnatting-siden." },
  { cat: 3, q: "Når er innsjekk og utsjekk?", a: "Innsjekk åpner onsdag 30. april kl 14:00. Utsjekk er senest søndag 3. mai kl 12:00. Ved Camp er det selvinnsjekk med QR-kode du får på e-post 48 timer før." },
  { cat: 3, q: "Er det parkering tilgjengelig?", a: "Vi anbefaler kollektivtransport eller å bli kjørt. Det er begrenset parkering ved Stavanger forum (200 plasser, kr 150/døgn). For Camp er det egen parkeringssone for russebusser." },
  { cat: 4, q: "Er Landstreff universelt utformet?", a: "Vi jobber kontinuerlig med tilgjengelighet. Alle scenene har rullestolplasser med god sikt, og det er tilrettelagte toaletter og soverom. Kontakt oss på post@landstreff.no minst 14 dager før, så lager vi en individuell plan." },
  { cat: 4, q: "Hva gjør jeg hvis jeg trenger hjelp under arrangementet?", a: "Det er rød kors-team i alle scenene og en bemannet hjelpetelefon hele døgnet på +47 51 00 00 00. Søk opp en gulvest om du står i kø eller på området, og vi sender deg dit du trenger." },
];

// ============================================
// CLAUDE.md: HEADER
// ============================================
function Header({ lang, setLang, page, setPage, openA11y, openExternal, openMenu, setOpenMenu }) {
  const t = TXT[lang];
  const navItems = [
    { id: "home", k: "home" },
    { id: "artists", k: "artists" },
    { id: "lodging", k: "lodging" },
    { id: "faq", k: "faq" },
    { id: "contact", k: "contact" },
  ];

  return (
    <>
      <a href="#main" className="skip">{t.skip}</a>
      <div className="topbar" aria-label="Verktøy">
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-xs)", letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.85 }}>
          {lang === "no" ? "Tilgjengelighet" : "Accessibility"} · WCAG 2.1 AA
        </div>
        <div className="topbar-tools">
          <button onClick={() => setLang(lang === "no" ? "en" : "no")} aria-label={lang === "no" ? "Switch to English" : "Bytt til norsk"}>
            <span aria-hidden="true">🌐</span> {t.siteLangAlt}
          </button>
          <button onClick={openA11y} aria-label={t.a11y}>
            <span aria-hidden="true" style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>A</span>
            <span aria-hidden="true" style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "1.2em" }}>A</span>
            {t.a11y}
          </button>
        </div>
      </div>

      <header className="header" data-screen-label="Header">
        <div className="container header-row">
          <a href="#" className="brand" onClick={(e) => { e.preventDefault(); setPage("home"); }} aria-label="Landstreff Stavanger forside" style={{ marginRight: "auto" }}>
            <span className="brand-mark" aria-hidden="true">LS</span>
            <span>Landstreff</span>
          </a>

          <nav className={`nav ${openMenu ? "open" : ""}`} aria-label={lang === "no" ? "Hovedmeny" : "Main menu"} style={{ marginLeft: 0 }}>
            {navItems.map(n => (
              <a key={n.id}
                 href={`#${n.id}`}
                 onClick={(e) => { e.preventDefault(); setPage(n.id); setOpenMenu(false); }}
                 aria-current={page === n.id ? "page" : undefined}>
                {t.nav[n.k]}
              </a>
            ))}
          </nav>

          <label className="search-bar" aria-label={t.search}>
            <span aria-hidden="true" style={{ color: "var(--ink-mute)" }}>⌕</span>
            <input type="search" placeholder={t.searchPh} />
          </label>

          <button className="menu-btn" onClick={() => setOpenMenu(!openMenu)} aria-expanded={openMenu} aria-controls="main-nav">
            <span aria-hidden="true">{openMenu ? "✕" : "≡"}</span> {openMenu ? t.closeMenu : t.openMenu}
          </button>

          <a href="#tickets" className="btn btn-primary header-cta"
             onClick={(e) => { e.preventDefault(); openExternal("ticketmaster.no/landstreff-2027"); }}>
            {t.buyTickets} <span aria-hidden="true">→</span>
          </a>
        </div>
      </header>
    </>
  );
}

// ============================================
// HOME (FORSIDE)
// ============================================
function HomePage({ lang, setPage, openExternal, lodgingPosition }) {
  const t = TXT[lang];
  const q = t.quick;

  const lodgingSection = (
    <section className="section container" aria-labelledby="home-lodging-h" style={{ background: "var(--bg-elev)", marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)", paddingLeft: "var(--container-pad)", paddingRight: "var(--container-pad)" }}>
      <div style={{ maxWidth: "var(--maxw)", margin: "0 auto" }}>
        <div className="section-head">
          <div>
            <p className="eyebrow" style={{ marginBottom: 12 }}>02 / Overnatting</p>
            <h2 id="home-lodging-h">{t.lodging.title}</h2>
          </div>
          <button className="btn btn-secondary" onClick={() => setPage("lodging")}>
            {lang === "no" ? "Se alle alternativer" : "See all options"} <span aria-hidden="true">→</span>
          </button>
        </div>
        <div className="lodging-grid">
          {LODGING.map(l => <LodgingCard key={l.id} item={l} lang={lang} setPage={setPage} />)}
        </div>
      </div>
    </section>
  );

  return (
    <main id="main" data-screen-label="01 Forside">
      <section className="hero container" aria-labelledby="hero-title">
        <div className="hero-grid">
          <div>
            <p className="eyebrow" style={{ marginBottom: 16 }}>{t.hero.eyebrow}</p>
            <h1 id="hero-title">
              <span className="accent">{t.hero.titleA}</span>
              <span>{t.hero.titleB}</span>
            </h1>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => openExternal("ticketmaster.no/landstreff-2027-waitlist")}>
                {t.hero.ctaPrimary} <span aria-hidden="true">→</span>
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => setPage("artists")}>
                {t.hero.ctaSecondary}
              </button>
            </div>
          </div>
          <div className="hero-meta">
            <dl>
              <dt>{t.hero.dateLabel}</dt>
              <dd>{t.hero.dateValue}</dd>
              <dt>{t.hero.locLabel}</dt>
              <dd>{t.hero.locValue}</dd>
              <dt>{t.hero.statusLabel}</dt>
              <dd>{t.hero.statusValue}</dd>
              <dt>{t.hero.ageLabel}</dt>
              <dd>{t.hero.ageValue}</dd>
            </dl>
          </div>
        </div>
      </section>

      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          <span>Karpe</span><span>Astrid S</span><span>Cezinando</span><span>Sigrid</span><span>Marcus & Martinus</span><span>Tix</span><span>Lars Vaular</span><span>Hkeem</span><span>Sondre Justad</span><span>+ 14 navn</span>
        </div>
      </div>

      <section aria-label={lang === "no" ? "Hurtig informasjon" : "Quick info"} className="quick-info">
        <a href="#artists" className="qi" onClick={(e) => { e.preventDefault(); setPage("artists"); }}>
          <span className="qi-label">{q.a.l}</span>
          <span className="qi-value">{q.a.v}</span>
          <span className="qi-sub">{q.a.s}</span>
        </a>
        <a href="#lodging" className="qi" onClick={(e) => { e.preventDefault(); setPage("lodging"); }}>
          <span className="qi-label">{q.b.l}</span>
          <span className="qi-value">{q.b.v}</span>
          <span className="qi-sub">{q.b.s}</span>
        </a>
        <a href="#faq" className="qi" onClick={(e) => { e.preventDefault(); setPage("faq"); }}>
          <span className="qi-label">{q.c.l}</span>
          <span className="qi-value">{q.c.v}</span>
          <span className="qi-sub">{q.c.s}</span>
        </a>
        <a href="#contact" className="qi" onClick={(e) => { e.preventDefault(); setPage("contact"); }}>
          <span className="qi-label">{q.d.l}</span>
          <span className="qi-value">{q.d.v}</span>
          <span className="qi-sub">{q.d.s}</span>
        </a>
      </section>

      {lodgingPosition === "middle" && lodgingSection}

      <section className="section container" aria-labelledby="home-artists-h">
        <div className="section-head">
          <div>
            <p className="eyebrow" style={{ marginBottom: 12 }}>{lodgingPosition === "middle" ? "02" : "01"} / Program</p>
            <h2 id="home-artists-h">{t.artists.title}</h2>
          </div>
          <button className="btn btn-secondary" onClick={() => setPage("artists")}>
            {t.artists.cta} <span aria-hidden="true">→</span>
          </button>
        </div>
        <ArtistGrid lang={lang} compact={true} max={8} />
      </section>

      {lodgingPosition === "bottom" && lodgingSection}
    </main>
  );
}

// ============================================
// ARTIST GRID + CARD
// ============================================
function ArtistGrid({ lang, compact, max, onSelect }) {
  const list = max ? ARTISTS.slice(0, max) : ARTISTS;
  return (
    <div className="artist-grid">
      {list.map((a, i) => (
        <ArtistCard key={a.id} a={a} large={!compact && i < 2} onSelect={onSelect} lang={lang} />
      ))}
    </div>
  );
}

function ArtistCard({ a, large, onSelect, lang }) {
  return (
    <button
      className={`artist-card ${large ? "lg" : ""}`}
      onClick={() => onSelect && onSelect(a)}
      aria-label={`${a.name} – ${a.sub}. ${lang === "no" ? "Åpne detaljer" : "Open details"}`}>
      <div className="artist-card-img" role="img" aria-label={`${lang === "no" ? "Promobilde av" : "Promotional image of"} ${a.name}`}>
        <span className="artist-card-img-label" aria-hidden="true">{a.placeholder ? a.initials : a.name}</span>
      </div>
      <div className="artist-card-body">
        <span className="artist-card-name">{a.name}</span>
        <span className="artist-card-meta">
          <span className="dot" aria-hidden="true" />
          {a.stage} · {a.time}
        </span>
      </div>
    </button>
  );
}

// ============================================
// ARTISTS PAGE
// ============================================
function ArtistsPage({ lang, openArtist }) {
  const t = TXT[lang];
  const [filter, setFilter] = useState("Alle");
  const stages = ["Alle", "Hovedscene", "Klubbscene", "DJ-telt"];
  const list = filter === "Alle" ? ARTISTS : ARTISTS.filter(a => a.stage === filter);
  return (
    <main id="main" data-screen-label="02 Artister 2026">
      <div className="page-header container">
        <div className="breadcrumb">
          <a href="#">{lang === "no" ? "Forside" : "Home"}</a><span>›</span>{t.artists.title}
        </div>
        <h1>{t.artists.title}</h1>
        <p>{t.artists.lede}</p>
      </div>
      <section className="section container">
        <div className="faq-cats" role="group" aria-label={lang === "no" ? "Filtrer etter scene" : "Filter by stage"}>
          {stages.map(s => (
            <button key={s} className="faq-cat" aria-pressed={filter === s} onClick={() => setFilter(s)}>
              {s}
            </button>
          ))}
        </div>
        <div className="artist-grid" style={{ marginTop: 32 }}>
          {list.map((a, i) => (
            <ArtistCard key={a.id} a={a} large={i < 2 && filter === "Alle"} onSelect={openArtist} lang={lang} />
          ))}
        </div>
      </section>
    </main>
  );
}

// ============================================
// LODGING CARD + PAGE
// ============================================
function LodgingCard({ item, lang }) {
  const t = TXT[lang];
  return (
    <article className="lodging-card">
      <div className="lodging-card-img" role="img" aria-label={`${lang === "no" ? "Bilde av" : "Photo of"} ${item.name}`}>
        <span aria-hidden="true">{item.name}</span>
      </div>
      <div className="lodging-card-body">
        <h3>{item.name} <span className="price">{item.price}</span></h3>
        <p>{item.desc}</p>
        <ul className="lodging-features">
          {item.features.map((f, i) => (
            <li key={i} className={f.ok ? "" : "no"}>{f.t}</li>
          ))}
        </ul>
        <button className="btn">{t.lodging.book} <span aria-hidden="true">→</span></button>
      </div>
    </article>
  );
}

function LodgingPage({ lang }) {
  const t = TXT[lang];
  return (
    <main id="main" data-screen-label="03 Overnatting">
      <div className="page-header container">
        <div className="breadcrumb">
          <a href="#">{lang === "no" ? "Forside" : "Home"}</a><span>›</span>{t.lodging.title}
        </div>
        <h1>{t.lodging.title}</h1>
        <p>{t.lodging.lede}</p>
      </div>

      <section className="section container">
        <div className="lodging-grid">
          {LODGING.map(l => <LodgingCard key={l.id} item={l} lang={lang} />)}
        </div>

        <div className="lodging-compare" aria-labelledby="compare-h">
          <table>
            <caption className="sr-only">{t.lodging.compareTitle}</caption>
            <thead>
              <tr>
                <th scope="col">{lang === "no" ? "Tjeneste" : "Feature"}</th>
                <th scope="col">Hotell</th>
                <th scope="col">Camp</th>
                <th scope="col">Studio</th>
              </tr>
            </thead>
            <tbody>
              <tr><th scope="row">{lang === "no" ? "Pris fra" : "Price from"}</th><td>1 890 kr/natt</td><td>990 kr/pers</td><td>2 490 kr/natt</td></tr>
              <tr><th scope="row">{lang === "no" ? "Frokost" : "Breakfast"}</th><td className="check">Ja</td><td className="no">Tillegg</td><td className="no">Tillegg</td></tr>
              <tr><th scope="row">{lang === "no" ? "Sengetøy" : "Bedding"}</th><td className="check">Ja</td><td className="no">Nei</td><td className="check">Ja</td></tr>
              <tr><th scope="row">{lang === "no" ? "Rullestol" : "Wheelchair"}</th><td className="check">Ja</td><td className="check">Ja</td><td className="check">Ja</td></tr>
              <tr><th scope="row">{lang === "no" ? "Stillesoner" : "Quiet zones"}</th><td className="check">Etter 23:00</td><td className="no">Begrenset</td><td className="check">Eget rom</td></tr>
              <tr><th scope="row">{lang === "no" ? "Avstand til forum" : "Distance to venue"}</th><td>10 min</td><td>3 min</td><td>15 min</td></tr>
              <tr><th scope="row">{lang === "no" ? "Plass per booking" : "People per booking"}</th><td>2–4</td><td>1–4</td><td>6–10</td></tr>
            </tbody>
          </table>
        </div>

        <aside style={{ marginTop: 48, padding: 32, background: "var(--accent-soft)", borderRadius: "var(--radius-lg)", border: "1.5px solid var(--accent)" }} aria-labelledby="group-h">
          <h3 id="group-h" style={{ fontSize: "var(--fs-2xl)", marginBottom: 8 }}>{t.lodging.groupBooking}</h3>
          <p style={{ maxWidth: "60ch", color: "var(--ink)" }}>{t.lodging.groupNote}</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }}>
            {lang === "no" ? "Start gruppebooking" : "Start group booking"} <span aria-hidden="true">→</span>
          </button>
        </aside>
      </section>
    </main>
  );
}

// ============================================
// FAQ
// ============================================
function FAQPage({ lang }) {
  const t = TXT[lang];
  const [open, setOpen] = useState(0);
  const [cat, setCat] = useState(0);
  const triggers = useRef([]);

  const list = cat === 0 ? FAQ : FAQ.filter(f => f.cat === cat);

  const handleKey = (e, i) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = (i + 1) % list.length;
      triggers.current[next]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (i - 1 + list.length) % list.length;
      triggers.current[prev]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault(); triggers.current[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault(); triggers.current[list.length - 1]?.focus();
    }
  };

  return (
    <main id="main" data-screen-label="04 FAQ">
      <div className="page-header container">
        <div className="breadcrumb">
          <a href="#">{lang === "no" ? "Forside" : "Home"}</a><span>›</span>{t.faq.title}
        </div>
        <h1>{t.faq.title}</h1>
        <p>{t.faq.lede}</p>
      </div>
      <section className="section container">
        <div className="faq-cats" role="group" aria-label={lang === "no" ? "Filtrer FAQ" : "Filter FAQ"}>
          {t.faq.cats.map((c, i) => (
            <button key={c} className="faq-cat" aria-pressed={cat === i} onClick={() => { setCat(i); setOpen(0); }}>
              {c}
            </button>
          ))}
        </div>

        <div className="faq-list" role="region" aria-label={t.faq.title}>
          {list.map((item, i) => (
            <div key={i} className="faq-item" data-open={open === i}>
              <h3 style={{ margin: 0 }}>
                <button
                  className="faq-trigger"
                  ref={el => triggers.current[i] = el}
                  aria-expanded={open === i}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-trigger-${i}`}
                  onClick={() => setOpen(open === i ? -1 : i)}
                  onKeyDown={(e) => handleKey(e, i)}>
                  <span>{item.q}</span>
                  <span className="faq-trigger-icon" aria-hidden="true">+</span>
                </button>
              </h3>
              <div
                className="faq-panel"
                id={`faq-panel-${i}`}
                role="region"
                aria-labelledby={`faq-trigger-${i}`}
                hidden={open !== i}>
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, textAlign: "center" }}>
          <p style={{ color: "var(--ink-soft)", marginBottom: 16 }}>
            {lang === "no" ? "Fant du ikke svaret?" : "Didn't find your answer?"}
          </p>
          <a href="#contact" className="btn btn-secondary" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent("__goto", { detail: "contact" })); }}>
            {lang === "no" ? "Send oss en melding" : "Send us a message"} <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </main>
  );
}

// ============================================
// KONTAKT
// ============================================
function ContactPage({ lang }) {
  const t = TXT[lang];
  const [sent, setSent] = useState(false);
  return (
    <main id="main" data-screen-label="05 Kontakt">
      <div className="page-header container">
        <div className="breadcrumb">
          <a href="#">{lang === "no" ? "Forside" : "Home"}</a><span>›</span>{t.contact.title}
        </div>
        <h1>{t.contact.title}</h1>
        <p>{t.contact.lede}</p>
      </div>
      <section className="section container">
        <div className="contact-grid">
          <div>
            <h2 style={{ fontSize: "var(--fs-2xl)", marginBottom: 24 }}>
              {lang === "no" ? "Direkte kontakt" : "Direct contact"}
            </h2>
            <dl className="contact-list">
              <div className="contact-row">
                <dt>{lang === "no" ? "Generelt" : "General"}</dt>
                <dd><a href="mailto:post@landstreff.no">post@landstreff.no</a></dd>
                <dd style={{ color: "var(--ink-mute)", fontFamily: "var(--font-mono)", fontSize: "var(--fs-xs)" }}>SVAR &lt; 24t</dd>
              </div>
              <div className="contact-row">
                <dt>{lang === "no" ? "Billett" : "Tickets"}</dt>
                <dd><a href="mailto:billett@landstreff.no">billett@landstreff.no</a></dd>
                <dd style={{ color: "var(--ink-mute)", fontFamily: "var(--font-mono)", fontSize: "var(--fs-xs)" }}>SVAR &lt; 24t</dd>
              </div>
              <div className="contact-row">
                <dt>{lang === "no" ? "Tilgjengelighet" : "Accessibility"}</dt>
                <dd><a href="mailto:uu@landstreff.no">uu@landstreff.no</a></dd>
                <dd style={{ color: "var(--ink-mute)", fontFamily: "var(--font-mono)", fontSize: "var(--fs-xs)" }}>SVAR &lt; 48t</dd>
              </div>
              <div className="contact-row">
                <dt>{lang === "no" ? "Døgnvakt" : "24/7 hotline"}</dt>
                <dd><a href="tel:+4751000000">+47 51 00 00 00</a></dd>
                <dd style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: "var(--fs-xs)" }}>UNDER ARR.</dd>
              </div>
              <div className="contact-row">
                <dt>{lang === "no" ? "Adresse" : "Address"}</dt>
                <dd>Stavanger forum<br />Gunnar Warebergs gate 13<br />4021 Stavanger</dd>
                <dd></dd>
              </div>
            </dl>
          </div>

          <form className="card" aria-labelledby="form-h" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <h2 id="form-h" style={{ fontSize: "var(--fs-xl)", marginBottom: 8 }}>{t.contact.formTitle}</h2>
            <p style={{ color: "var(--ink-soft)", fontSize: "var(--fs-sm)", marginBottom: 20 }}>
              {lang === "no" ? "Felter merket med * er obligatoriske." : "Fields marked with * are required."}
            </p>
            {sent ? (
              <div role="status" style={{ padding: 24, background: "var(--bg-elev)", borderRadius: "var(--radius-md)", border: "1.5px solid var(--success)" }}>
                <strong style={{ color: "var(--success)" }}>✓ {t.contact.sent}</strong>
              </div>
            ) : (
              <>
                <div className="form-field">
                  <label htmlFor="name">{t.contact.name} *</label>
                  <input id="name" type="text" required autoComplete="name" />
                </div>
                <div className="form-field">
                  <label htmlFor="email">{t.contact.email} *</label>
                  <input id="email" type="email" required autoComplete="email" aria-describedby="email-hint" />
                  <span id="email-hint" className="hint">{lang === "no" ? "Vi sender svaret hit." : "We'll reply to this address."}</span>
                </div>
                <div className="form-field">
                  <label htmlFor="topic">{t.contact.topic} *</label>
                  <select id="topic" required>
                    <option value="">—</option>
                    <option>{lang === "no" ? "Billett" : "Tickets"}</option>
                    <option>{lang === "no" ? "Overnatting" : "Lodging"}</option>
                    <option>{lang === "no" ? "Tilgjengelighet" : "Accessibility"}</option>
                    <option>{lang === "no" ? "Annet" : "Other"}</option>
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="message">{t.contact.message} *</label>
                  <textarea id="message" required></textarea>
                </div>
                <button className="btn btn-primary" type="submit" style={{ marginTop: 8 }}>
                  {t.contact.send} <span aria-hidden="true">→</span>
                </button>
              </>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}

// ============================================
// MODALS
// ============================================
function ExternalModal({ url, onClose, onGo, lang }) {
  const t = TXT[lang].extMod;
  const dlg = useRef();
  useEffect(() => {
    dlg.current?.querySelector("button")?.focus();
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-labelledby="ext-title" aria-describedby="ext-body" aria-modal="true" ref={dlg} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label={lang === "no" ? "Lukk" : "Close"}>✕</button>
        <p className="eyebrow" style={{ marginBottom: 8 }}>{lang === "no" ? "Ekstern lenke" : "External link"}</p>
        <h2 id="ext-title">{t.title}</h2>
        <p id="ext-body" style={{ color: "var(--ink-soft)", marginTop: 12, marginBottom: 12 }}>{t.body}</p>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-sm)", color: "var(--ink-mute)", padding: "10px 14px", background: "var(--bg-elev)", borderRadius: "var(--radius-md)", wordBreak: "break-all" }}>
          ↗ {url}
        </p>
        <div className="modal-actions">
          <button className="btn btn-primary" onClick={onGo}>{t.go} <span aria-hidden="true">↗</span></button>
          <button className="btn btn-secondary" onClick={onClose}>{t.stay}</button>
        </div>
      </div>
    </div>
  );
}

function ArtistModal({ artist, onClose, lang }) {
  const t = TXT[lang].artists.detail;
  const dlg = useRef();
  useEffect(() => {
    dlg.current?.querySelector("button")?.focus();
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  if (!artist) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal lg" role="dialog" aria-labelledby="art-title" aria-modal="true" ref={dlg} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label={t.close}>✕</button>
        <p className="eyebrow" style={{ marginBottom: 8 }}>{artist.stage} · {artist.time}</p>
        <h2 id="art-title" style={{ fontSize: "var(--fs-3xl)" }}>{artist.name}</h2>
        <div className="artist-detail-img" role="img" aria-label={`${lang === "no" ? "Promobilde av" : "Promotional image of"} ${artist.name}`}>
          <span aria-hidden="true">{artist.name}</span>
        </div>
        <p style={{ color: "var(--ink-soft)", fontSize: "var(--fs-lg)", marginBottom: 24 }}>{t.bioPlaceholder}</p>
        <p className="eyebrow" style={{ marginBottom: 12 }}>{t.share}</p>
        <div className="share-row">
          <button className="btn btn-sm">📱 Snapchat</button>
          <button className="btn btn-sm">📷 Instagram</button>
          <button className="btn btn-sm">🔗 {lang === "no" ? "Kopier lenke" : "Copy link"}</button>
          <button className="btn btn-sm">▶ {t.playlist}</button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// ACCESSIBILITY PANEL
// ============================================
function A11yPanel({ onClose, lang, scale, setScale, contrast, setContrast, motion, setMotion }) {
  const t = TXT[lang].a11yPanel;
  const dlg = useRef();
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    dlg.current?.querySelector("button")?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <div className="a11y-panel" role="dialog" aria-labelledby="a11y-title" ref={dlg}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h2 id="a11y-title">{t.title}</h2>
        <button onClick={onClose} aria-label={t.close} style={{ background: "transparent", border: 0, fontSize: 20, cursor: "pointer", padding: 4, minWidth: 32, minHeight: 32 }}>✕</button>
      </div>

      <div className="a11y-group">
        <label id="size-lbl">{t.textSize}</label>
        <div className="a11y-row" role="group" aria-labelledby="size-lbl">
          {t.sizes.map((s, i) => {
            const val = [1, 1.2, 1.45][i];
            return (
              <button key={s} aria-pressed={scale === val} onClick={() => setScale(val)}>
                <span style={{ fontSize: `${0.9 + i * 0.15}em` }}>A</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="a11y-group">
        <label id="con-lbl">{t.contrast}</label>
        <div className="a11y-row" role="group" aria-labelledby="con-lbl">
          {["default", "high", "dark"].map((c, i) => (
            <button key={c} aria-pressed={contrast === c} onClick={() => setContrast(c)}>
              {t.contrasts[i]}
            </button>
          ))}
        </div>
      </div>

      <div className="a11y-group">
        <label id="mot-lbl">{t.motion}</label>
        <div className="a11y-row" role="group" aria-labelledby="mot-lbl">
          {["on", "reduce"].map((m, i) => (
            <button key={m} aria-pressed={motion === m} onClick={() => setMotion(m)}>
              {t.motions[i]}
            </button>
          ))}
        </div>
      </div>

      <button className="btn btn-sm btn-secondary" onClick={() => { setScale(1); setContrast("default"); setMotion("on"); }}>
        {t.reset}
      </button>
    </div>
  );
}

// ============================================
// COOKIE BANNER (non-blocking, dismissable)
// ============================================
function CookieBanner({ onClose, lang }) {
  const t = TXT[lang].cookie;
  return (
    <div className="cookie" role="region" aria-labelledby="cookie-title">
      <h3 id="cookie-title">{t.title}</h3>
      <p>{t.body}</p>
      <div className="cookie-actions">
        <button className="btn btn-primary btn-sm" onClick={onClose}>{t.accept}</button>
        <button className="btn btn-secondary btn-sm" onClick={onClose}>{t.necessary}</button>
      </div>
    </div>
  );
}

// ============================================
// FOOTER
// ============================================
function Footer({ lang, setPage }) {
  return (
    <footer className="footer" data-screen-label="Footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-2xl)", fontWeight: 800, marginBottom: 16, letterSpacing: "-0.02em" }}>
              Landstreff Stavanger
            </div>
            <p style={{ opacity: 0.85, maxWidth: "32ch" }}>
              {lang === "no" ? "Norges største russetreff. 1.–3. mai 2026 i Stavanger." : "Norway's biggest graduation festival. May 1–3, 2026 in Stavanger."}
            </p>
            <p style={{ opacity: 0.7, fontFamily: "var(--font-mono)", fontSize: "var(--fs-xs)", marginTop: 16 }}>
              {lang === "no" ? "Universelt utformet etter WCAG 2.1 AA." : "Universally designed per WCAG 2.1 AA."}<br />
              {lang === "no" ? "Org.nr 999 999 999" : "Org. no. 999 999 999"}
            </p>
          </div>
          <div>
            <h4>{lang === "no" ? "Festival" : "Festival"}</h4>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setPage("artists"); }}>{TXT[lang].nav.artists}</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setPage("lodging"); }}>{TXT[lang].nav.lodging}</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setPage("faq"); }}>FAQ</a></li>
              <li><a href="#">{lang === "no" ? "Frivillig" : "Volunteer"}</a></li>
            </ul>
          </div>
          <div>
            <h4>{lang === "no" ? "Hjelp" : "Help"}</h4>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setPage("contact"); }}>{TXT[lang].nav.contact}</a></li>
              <li><a href="#">{lang === "no" ? "Tilgjengelighetserklæring" : "Accessibility statement"}</a></li>
              <li><a href="#">{lang === "no" ? "Personvern" : "Privacy"}</a></li>
              <li><a href="#">{lang === "no" ? "Cookies" : "Cookies"}</a></li>
            </ul>
          </div>
          <div>
            <h4>{lang === "no" ? "Følg oss" : "Follow"}</h4>
            <ul>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">TikTok</a></li>
              <li><a href="#">Snapchat</a></li>
              <li><a href="#">Spotify</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Landstreff Stavanger AS</span>
          <span>{lang === "no" ? "Redesign · IS-217 Mappeoppgave 2 · Gruppe 3" : "Redesign · IS-217 Portfolio task 2 · Group 3"}</span>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// APP
// ============================================
function App() {
  const [tw, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [lang, setLang] = useState("no");
  const [page, setPageRaw] = useState("home");
  const [openMenu, setOpenMenu] = useState(false);
  const [extUrl, setExtUrl] = useState(null);
  const [artist, setArtist] = useState(null);
  const [a11yOpen, setA11yOpen] = useState(false);
  const [cookieShown, setCookieShown] = useState(true);

  // a11y settings
  const [scale, setScale] = useState(1);
  const [contrast, setContrast] = useState("default");
  const [motion, setMotion] = useState("on");

  // sync to <html> attrs
  useEffect(() => {
    document.documentElement.lang = lang === "no" ? "nb" : "en";
    document.documentElement.style.setProperty("--type-scale", scale);
    document.documentElement.dataset.contrast = contrast;
    document.documentElement.dataset.motion = motion;
  }, [lang, scale, contrast, motion]);

  // sync tweak: accent color
  useEffect(() => {
    if (contrast === "default") {
      document.documentElement.style.setProperty("--accent", tw.accent);
    } else {
      document.documentElement.style.removeProperty("--accent");
    }
    document.documentElement.style.setProperty("--cta-pad", tw.ctaPad + "px");
  }, [tw.accent, tw.ctaPad, contrast]);

  const setPage = (p) => {
    setPageRaw(p);
    setOpenMenu(false);
    // scroll to top on page change
    window.scrollTo({ top: 0, behavior: "instant" });
    // move focus to main
    setTimeout(() => document.getElementById("main")?.focus(), 100);
  };

  // listen for in-page goto (from FAQ "didn't find answer")
  useEffect(() => {
    const h = (e) => setPage(e.detail);
    window.addEventListener("__goto", h);
    return () => window.removeEventListener("__goto", h);
  }, []);

  const openExternal = (url) => setExtUrl(url);

  const pageContent = {
    home: <HomePage lang={lang} setPage={setPage} openExternal={openExternal} lodgingPosition={tw.lodgingPosition} />,
    artists: <ArtistsPage lang={lang} openArtist={setArtist} />,
    lodging: <LodgingPage lang={lang} />,
    faq: <FAQPage lang={lang} />,
    contact: <ContactPage lang={lang} />,
  }[page];

  return (
    <>
      <Header lang={lang} setLang={setLang} page={page} setPage={setPage}
              openA11y={() => setA11yOpen(true)}
              openExternal={openExternal}
              openMenu={openMenu} setOpenMenu={setOpenMenu} />
      {pageContent}
      <Footer lang={lang} setPage={setPage} />

      {extUrl && <ExternalModal url={extUrl} lang={lang}
                                onClose={() => setExtUrl(null)}
                                onGo={() => { window.alert("Ville åpnet: " + extUrl); setExtUrl(null); }} />}
      {artist && <ArtistModal artist={artist} lang={lang} onClose={() => setArtist(null)} />}
      {a11yOpen && <A11yPanel onClose={() => setA11yOpen(false)} lang={lang}
                              scale={scale} setScale={setScale}
                              contrast={contrast} setContrast={setContrast}
                              motion={motion} setMotion={setMotion} />}
      {cookieShown && <CookieBanner onClose={() => setCookieShown(false)} lang={lang} />}

      <TweaksPanel title="Tweaks — IS-217">
        <TweakSection label="Forside" />
        <TweakRadio
          label="Overnatting-seksjon"
          value={tw.lodgingPosition}
          options={["bottom", "middle"]}
          onChange={(v) => setTweak("lodgingPosition", v)} />

        <TweakSection label="CTA-knapp" />
        <TweakRadio
          label='"Kjøp billett"-bredde'
          value={String(tw.ctaPad)}
          options={["22", "26", "32"]}
          onChange={(v) => setTweak("ctaPad", parseInt(v, 10))} />

        <TweakSection label="Aksentfarge (WCAG-godkjent)" />
        <TweakColor
          label="Aksent"
          value={tw.accent}
          options={["#b5371a", "#a8290f", "#1b2a47", "#1f5d3a"]}
          onChange={(v) => setTweak("accent", v)} />
        <div style={{ fontSize: 10, color: "rgba(41,38,27,.55)", lineHeight: 1.4 }}>
          Alle alternativer ≥ 4.5:1 mot hvit tekst (WCAG AA).<br />
          Rød 5.9:1 · Mørk rød 7.0:1 · Navy 14:1 · Grønn 7.8:1
        </div>
      </TweaksPanel>
    </>
  );
}

// Mount
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
