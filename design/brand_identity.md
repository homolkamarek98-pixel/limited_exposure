# Brand Identity — Limited Exposure
## "The Silent Curator"

---

## Filozofie

Rozhraní je tichý kurátorský rám, který nikdy nesoupeří s fotografií. Whitespace je prémiový materiál, ne prázdné pixely. **Prostorový luxus** — dvojnásobné marginy jsou správný výběr. UI je přísně monochromatické; jediný zdroj barvy pochází z fotografií samotných.

> "V high-end galerii architektura a rám nikdy nesoupeří s mistrovským dílem — poskytují záměrné prázdno potřebné k tomu, aby dílo dýchalo."

---

## Logo

### Wordmark
`public/assets/logo.svg` (tmavý) / `public/assets/logo-light.svg` (světlý)

- Font: **Noto Serif**, weight 900 (font-black)
- Text: "Limited Exposure" (sentence case, ne ALL CAPS)
- Letter-spacing: `-0.02em` (tight — jako tiskový monograf)
- Barva dark: `#000000` | light: `#f9f9f9`

V HTML kódu komponenty: `font-['Noto_Serif'] font-black tracking-tighter`

### Monogram (LE)
`public/assets/logo-mark.svg` / `public/assets/logo-mark-light.svg`

- Čtvercový rám s border 1px — ostré rohy (0px radius)
- "LE" v Noto Serif 900, letter-spacing -0.02em
- Použití: favicon, watermark, certifikáty

### Pravidla loga
- Minimální výška: 24px
- Volný prostor: ≥ výška písmene "L" na všech stranách
- Nikdy: shadow, outline, deformace, gradient

---

## Typografie

| Role     | Font       | Variable CSS          | Tailwind              | Vlastnosti                            |
|----------|------------|-----------------------|-----------------------|---------------------------------------|
| Headline | Noto Serif | `--font-noto-serif`   | `font-['Noto_Serif']` | wght 400/700/900, italic pro citáty   |
| Body     | Inter      | `--font-inter`        | `font-['Inter']`      | wght 300–700, body/descriptions       |
| Label    | Manrope    | `--font-manrope`      | `font-['Manrope']`    | wght 300–800, UI/labels/nav           |

### Typografická hierarchie (editoriální extremy)
```
display-lg:  3.5rem–5rem, Noto Serif 900, tracking -0.02em    ← název díla, hero
headline-lg: 2rem–3rem,   Noto Serif 700, tracking -0.02em    ← sekce
label-sm:    0.625rem,    Manrope 500,   tracking 0.2em, CAPS  ← metadata, tech specs
```

Střední škála je nepřítel high-end editoriálního designu — používej extrémy.

---

## Barevná paleta — Material Design 3 Monochrome

```
primary:                   #000000   ← primární text, CTA tlačítka, rámečky
on-primary:                #e2e2e2   ← text na černém pozadí
primary-container:         #3b3b3b   ← gradient endpoint, hover stav

background:                #f9f9f9   ← hlavní canvas
surface:                   #f9f9f9   ← surface 0
surface-bright:            #f9f9f9
surface-container-lowest:  #ffffff   ← karty (nejvýš "pop")
surface-container-low:     #f3f3f4   ← jemné sekce, mat board
surface-container:         #eeeeee   ← střední úroveň
surface-container-high:    #e8e8e8   ← subtilní dělení
surface-container-highest: #e2e2e2   ← darkest surface, photo background
surface-dim:               #dadada   ← tmavší pozadí
surface-variant:           #e2e2e2

on-surface:                #1a1c1c   ← body text
on-surface-variant:        #474747   ← sekundární text
secondary:                 #5f5e5e   ← pomocný text
tertiary:                  #3b3b3c   ← terciární

outline:                   #777777   ← viditelné ohraničení (certificate)
outline-variant:           #c6c6c6   ← ghost border (20% opacity)

error:                     #ba1a1a
inverse-surface:           #2f3131   ← dark mode base
```

### Pravidla barev
- **No-Line Rule:** žádné `border: 1px solid` pro dělení sekcí — použij tonal shift (surface-container-low vs surface)
- **Ghost Border:** `outline: 1px solid rgba(198,198,198,0.20)` — pouze pro rámování fotografií
- **Gradient:** `linear-gradient(45deg, #000000, #3b3b3b)` — CTA, hero overlay, "carbon finish"
- UI je výhradně monochromatické; fotografie poskytuje jedinou barvu

---

## Border Radius — 0px. Vždy. Bez výjimek.

```css
*, *::before, *::after { border-radius: 0 !important; }
```

Výjimka: `.rounded-full` pro avatary (9999px), pokud jsou absolutně nezbytné.
Ostré rohy = architektonická galerie. I 2px radius to rozbíjí.

---

## Klíčové komponenty

### PhotoCard — mat board efekt
```html
<div class="bg-surface-container-low p-6 md:p-12">
  <div class="outline outline-1 outline-outline-variant/20">
    <img class="grayscale hover:grayscale-0 transition-all duration-700" />
  </div>
</div>
```
- Padding = "paspartování" jako v galerii
- Ghost border kolem fotografie
- Grayscale s hover color reveal (700ms ease)

### Asymetrický layout (2/3 + 1/3)
```html
<div class="grid grid-cols-12 gap-12">
  <div class="col-span-8"><!-- fotografie --></div>
  <div class="col-span-4 sticky top-32"><!-- metadata --></div>
</div>
```
Žádná stejná 3×3 nebo 4×4 mřížka — vždy asymetrie.

### Primární tlačítko
```html
<button class="bg-primary text-on-primary px-12 py-5 uppercase tracking-widest text-xs font-label
               hover:bg-primary-container transition-colors">
  Add to Collection
</button>
```

### Ghost tlačítko
```html
<button class="border border-outline-variant/40 text-primary px-12 py-5 uppercase tracking-widest text-xs font-label
               hover:border-primary transition-colors bg-transparent">
  Learn More
</button>
```

### Label (metadata)
```html
<span class="text-[10px] tracking-[0.2em] uppercase font-medium text-outline">
  Edition — 04 / 50
</span>
```

### Certificate component
```html
<div class="le-certificate p-8">
  <!-- watermark "CERTIFICATE" je v CSS ::before -->
  <p class="le-label">Certificate of Authenticity</p>
  <p class="font-['Noto_Serif'] font-black text-2xl tracking-tighter">LE-0042 / 50</p>
</div>
```

### Glassmorphism (hero overlay)
```html
<div class="bg-surface/70 backdrop-blur-[20px] p-12">
  <!-- obsah nad fotografií -->
</div>
```

---

## Tier vizuální rozlišení

### Rising Talents
- Pozadí: `surface` (#f9f9f9)
- Badge: `<span class="le-label">Rising Talent</span>`
- Karty: světlý mat board (`surface-container-low`)

### Signature Series
- Pozadí: `primary` (#000000) sekce
- Badge: `<span class="le-label" style="color: #f9f9f9">Signature Series</span>`
- Karty: tmavý mat board (`surface-dim` nebo `inverse-surface`)
- Gradient header: `le-gradient-primary`

---

## Navigace
```html
<nav class="bg-[#f9f9f9] border-b border-gray-200 px-12 py-8">
  <div class="text-2xl font-black font-['Noto_Serif'] tracking-tighter">Limited Exposure</div>
  <div class="uppercase tracking-tight font-['Noto_Serif'] text-sm space-x-12">
    <a class="border-b-2 border-black">The Gallery</a>
    <a class="text-gray-500">Photographers</a>
    <a class="text-gray-500">About</a>
  </div>
</nav>
```

---

## Fotografie

- Vždy: `grayscale` defaultně, `hover:grayscale-0 transition-all duration-700`
- Vždy: mat board wrapper (`le-mat` class)
- Vždy: ghost border (`le-ghost-border` class)
- Orientace: preferuj 2:3 nebo 3:4 portrait, nebo panoramické 16:9 pro hero
- Objekt: `object-cover` s `brightness-90` pro hero pozadí

---

## Tone of Voice
- Strohé, elegantní, bez superlativů
- "Photographer" nikdy "artist" (ale "The Artist" v kurátorském kontextu OK)
- "Collector" nikdy "buyer" nebo "customer"
- "Add to Collection" nikdy "Buy Now" nebo "Add to Cart"
- Čísla edice: formát `04 / 50` nebo `LE-0042/50`

---

## Implementace (technické reference)

| Soubor                        | Role                                      |
|-------------------------------|-------------------------------------------|
| `src/app/globals.css`         | @theme tokeny, CSS utility třídy          |
| `src/app/layout.tsx`          | next/font/google (Noto Serif, Inter, Manrope) |
| `public/assets/logo.svg`      | Wordmark tmavý                            |
| `public/assets/logo-light.svg`| Wordmark světlý                           |
| `public/assets/logo-mark.svg` | LE monogram tmavý                         |
| `public/assets/logo-mark-light.svg` | LE monogram světlý                  |
