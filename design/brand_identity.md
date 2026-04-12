# Brand Identity — Limited Exposure

## Filozofie značky

Limited Exposure je galerijní prostor v digitálním světě. Každá fotografie je prezentována jako umělecké dílo hodné muzejní výstavy — s maximální vzdušností, minimem vizuálního hluku a plnou pozorností pro obraz samotný.

> "Značka je elegantní černobílý rám, který ustupuje fotografii."

---

## Logo

### Wordmark
Soubory: `public/assets/logo.svg` (tmavý) / `public/assets/logo-light.svg` (světlý)

Wordmark je dvouřádkový typografický znak:
- Řádek 1: **LIMITED** — Playfair Display, 21 px, letter-spacing 11, váha 400
- Řádek 2: **EXPOSURE** — Playfair Display, 8.5 px, letter-spacing 7.5, váha 400
- Orámování dvěma tenkými vodorovnými linkami (tloušťka 0.75 px)
- Viewbox: 320 × 72 px

Pravidla použití:
- Na světlém pozadí: `logo.svg` (černá varianta)
- Na tmavém pozadí: `logo-light.svg` (bílá varianta)
- Minimální výška při zobrazení: 32 px
- Kolem loga vždy volný prostor ≥ výška písmene "E"

### Monogram (LE)
Soubory: `public/assets/logo-mark.svg` / `public/assets/logo-mark-light.svg`

Čtvercový rámeček s dvojitým okrajem a monogramem "LE" uprostřed.
Použití: favicon, profily, watermark na fotografiích, certifikáty.
Viewbox: 48 × 48 px

---

## Barevná paleta

| Název     | Hex       | Tailwind třída      | Použití                                      |
|-----------|-----------|---------------------|----------------------------------------------|
| Černá     | `#0A0A0A` | `bg-le-black`       | Primární text, pozadí (tmavý mód)            |
| Bílá      | `#FFFFFF` | `bg-le-white`       | Pozadí (světlý mód), text na tmavém          |
| Krémová   | `#F5F0E8` | `bg-le-cream`       | Certifikáty, sekundární plochy               |
| Grafitová | `#3D3D3D` | `text-le-graphite`  | Sekundární text, popisky, metadata           |
| Zlatá     | `#C8A96E` | `text-le-gold`      | Certifikáty, Signature Series badge, akcenty |

CSS custom properties: `var(--le-black)`, `var(--le-cream)`, etc.

---

## Typografie

| Role      | Font              | Variable CSS         | Tailwind třída   | Použití                           |
|-----------|-------------------|----------------------|------------------|-----------------------------------|
| Nadpisy   | Playfair Display  | `--font-playfair`    | `font-display`   | H1–H3, názvy fotografií           |
| Tělo      | Inter             | `--font-inter`       | `font-sans`      | Popisky, UI, navigace, tlačítka   |
| Mono      | JetBrains Mono    | `--font-jetbrains`   | `font-mono`      | Certifikátová čísla, kódy, ceny   |

Váhy:
- Playfair Display: 400, 500, 600 (vždy preferuj 400 pro elegantní look)
- Inter: 300, 400, 500, 600
- JetBrains Mono: 300, 400

Klíčová pravidla:
- Nadpisy: vždy Playfair Display, `letter-spacing: 0.02em`
- Certifikátové číslo: JetBrains Mono, `text-le-gold`, `letter-spacing: 0.1em`
- Maximální šířka odstavce: `max-w-[65ch]`

---

## Tier vizuální rozlišení

### Rising Talents
- Bílé/krémové pozadí
- Tenký šedý rámeček (`border-le-graphite/20`)
- Badge: "Rising Talent" text grafitová

### Signature Series
- Tmavé pozadí (`bg-le-black`)
- Zlatý rámeček (`border-le-gold`)
- Badge: "Signature Series" zlatá
- Větší obrázek, prominentnější layout

---

## Tón komunikace
- Stručné, elegantní, bez hyperboly
- "Limitovaná edice" — ne "exkluzivní nabídka"
- Fotograf je umělec, kupující je sběratel — ne zákazník
- Texty v češtině (primární trh), bez zdrobnělin

---

## Implementace (technické)

Brand tokeny jsou v `src/app/globals.css` jako:
1. **CSS custom properties** (`var(--le-gold)`) — pro přímé použití v stylech
2. **Tailwind @theme tokeny** (`text-le-gold`) — pro utility třídy v JSX

Fonty jsou načteny v `src/app/layout.tsx` přes `next/font/google` (zero layout shift, font preloading).
