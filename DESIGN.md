# Design systém — Limited Exposure

## Vizuální filozofie
Minimalistická galerijní estetika. Značka je elegantní černobílý rám který ustupuje fotografii.
Fotografie je hrdinou. UI je neviditelné.

## Barevná paleta
| název    | hex       | použití                               |
|----------|-----------|---------------------------------------|
| Černá    | #0A0A0A   | primární text, pozadí (dark mode)     |
| Bílá     | #FFFFFF   | pozadí (light mode), text na tmavém   |
| Krémová  | #F5F0E8   | certifikáty, sekundární plochy        |
| Grafitová| #3D3D3D   | sekundární text                       |
| Zlatá    | #C8A96E   | certifikáty, prémiové prvky           |

## Typografie
| role     | font              | použití                        |
|----------|-------------------|---------------------------------|
| Nadpisy  | Playfair Display  | serif, elegantní, galerijní     |
| Tělo     | Inter             | sans-serif, čitelné, moderní    |
| Mono     | JetBrains Mono    | certifikátová čísla, kódy       |

## Klíčové komponenty

### PhotoCard
- Obrázek (aspect-ratio 3:4, černobílý s hover barvením)
- Název fotografie (Playfair Display)
- Jméno fotografa (Inter, grafitová)
- Cena
- EditionBadge
- Hover: jemné zvětšení, overlay s CTA

### EditionBadge
- Limited count: "47 / 50 kusů" (s progress barem)
- Time window: countdown "Vyprší za 23:14:05" (červené pokud < 1h)
- Sold out: "Vyprodáno" (grafitová, disabled)

### CertificatePreview
- Krémový (#F5F0E8) podklad, zlatý (#C8A96E) rámeček
- Logo Limited Exposure (JetBrains Mono)
- Název fotografie (Playfair Display, velký)
- Jméno fotografa
- Sériové číslo: "LE-0042 / 50" (zlatá, prominentní)
- Datum tisku
- QR kód ověření pravosti

## Tier vizuální rozlišení

### Rising Talents
- Bílé pozadí
- Jemný šedý rámeček
- Badge: "Rising Talent" (grafitová)

### Signature Series
- Tmavé pozadí (#0A0A0A)
- Zlatý rámeček
- Badge: "Signature Series" (zlatá)
- Větší fotografie (prominentnější layout)

## Responzivita
- Mobile-first
- PhotoCard grid: 1 col (mobile) → 2 col (tablet) → 3–4 col (desktop)
- Homepage hero: fullscreen fotografie s minimálním textem
