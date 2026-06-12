# Design systém — OTISK (v3 „Papír")

## Vizuální filozofie
Úplná jednoduchá moderna. Jedna krémová plocha jako kvalitní výtvarný papír,
jeden grotesk font, hairline linky. Fotografie je plnobarevná a je jedinou
barvou na stránce. Žádné stíny, žádné zaoblení, žádné tmavé sekce.

## Barevná paleta
| token      | hex     | použití                                  |
|------------|---------|------------------------------------------|
| paper      | #FAF6F0 | pozadí všeho                             |
| paper-dim  | #F3EDE3 | vstupy, image placeholdery, jemné plochy |
| ink        | #1A1714 | primární text, primární CTA              |
| ink-soft   | #57503F | sekundární text, hover CTA               |
| muted      | #8A8170 | labely, terciární text                   |
| faint      | #C4BBA9 | placeholdery, nejjemnější text           |
| line       | #E7DFD2 | hairline bordery, oddělovače             |
| urgent     | #B2401C | jediný akcent: končící edice, chyby      |

## Typografie
| role     | font              | použití                                   |
|----------|-------------------|-------------------------------------------|
| Vše      | Schibsted Grotesk | headliny, tělo, labely (jediný font)      |
| Mono     | Spline Sans Mono  | čísla edic (X/Y), ceny, sériová čísla, countdown — class `otisk-mono` |

Pravidla:
- Velké nadpisy: `font-medium tracking-[-0.03em] leading-[0.92–1.05]` — nikdy font-black
- Labely: `text-[10px] uppercase tracking-[0.18em–0.3em] text-[#8a8170]`
- Diakritika: subsety latin + latin-ext

## Komponentové vzory
- **Primární CTA**: `bg-[#1a1714] text-[#faf6f0] hover:bg-[#57503f]`, uppercase 10px tracking-[0.2em], px-8 py-4
- **Sekundární CTA**: `border border-[#e7dfd2] hover:border-[#1a1714]`
- **PhotoCard**: plnobarevná fotka 4:5 bez filtru, hover scale 1.03, mono badge (X/Y) na krémovém podkladu s blur, hairline progress bar
- **Sekce**: oddělené `border-t border-[#e7dfd2]`, py-16 md:py-28, kontejner max-w-screen-2xl px-6 md:px-12
- **Footer**: obří typografický wordmark OTISK (18vw) jako podpis stránky

## Logo
- Wordmark: OTISK — grotesk bold, prostrkání 0.32em (public/assets/logo*.svg)
- Mark: kruh + středový bod („O" jako clona / otisk objektivu)

## Tier rozlišení
Oba tiery žijí na stejné krémové ploše — rozlišuje je jen mono badge
(„Signature Series" / X/Y) a velikost layoutu (Signature = spotlight 1/2+1/2).
Žádné zlato, žádné tmavé bloky.

## Motion
- Page load: stagger reveal `.otisk-rise` (+ -1…-4 delay), respektuje prefers-reduced-motion
- Hover: jen scale fotky a barevné přechody — nic víc

## Responzivita
- Mobile-first
- PhotoCard grid: 2 col (mobil) → 3 col (desktop), stagger offsety md:mt-12/24
- Hero: typografický (13vw → 7.5rem), pod ním široká fotka 21:9
