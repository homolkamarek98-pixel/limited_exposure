# Progress — Limited Exposure

## Fáze 0: Příprava [DOKONČENA]
- [x] Složka, git, GitHub repo
- [x] CLAUDE.md, RULES.md, MEMORY.md, PROGRESS.md, ARCHITECTURE.md, DESIGN.md
- [x] Next.js init (TypeScript + Tailwind, verze 16 via create-next-app@latest)
- [x] Prisma schéma — Limited Exposure doménový model
- [x] .gitignore ověřen (.env uvnitř)
- [x] První commit a push

## Fáze 1: Brand identity [DOKONČENA]
- [x] Logo SVG — wordmark (dark + light) + monogram LE (dark + light) → public/assets/
- [x] Barevná paleta — CSS custom properties + Tailwind @theme tokeny v globals.css
- [x] Typografie — Playfair Display + Inter + JetBrains Mono via next/font/google v layout.tsx
- [x] design/brand_identity.md — kompletní brand manuál

## Fáze 2: Backend [ČEKÁ]
- [ ] .env.local + DATABASE_URL
- [ ] Prisma migrate dev
- [ ] NextAuth.js (email + Google provider)
- [ ] GET /api/listings
- [ ] GET /api/listings/[id]
- [ ] POST /api/listings
- [ ] POST /api/upload (Cloudflare R2)

## Fáze 3: Frontend [ČEKÁ]
- [ ] PhotoCard komponenta
- [ ] EditionBadge (počítadlo / countdown)
- [ ] Homepage (featured works)
- [ ] /listing/[id]
- [ ] /photographer/[id]
- [ ] Layout + navigace

## Fáze 4: Platby [ČEKÁ]
- [ ] Stripe checkout + webhook
- [ ] Certificate generování (PDF)
- [ ] CartDrawer + checkout stepper
- [ ] /order/[id] (potvrzení + certifikát)

## Fáze 5: QA + Deploy [ČEKÁ]
- [ ] Unit testy
- [ ] E2E testy (Playwright)
- [ ] Deploy Vercel
- [ ] Bezpečnostní audit
