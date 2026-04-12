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

## Fáze 2: Backend [PROBÍHÁ]
- [ ] .env.local + DATABASE_URL (čeká na Neon credentials od uživatele)
- [ ] Prisma migrate dev (čeká na DB)
- [x] NextAuth.js — credentials provider (email + bcrypt), JWT strategie, bez Google OAuth
- [x] GET /api/listings (filtr active, tier, type)
- [x] GET /api/listings/[id] (detail + foto dalšího fotografa)
- [x] POST /api/listings (auth: PHOTOGRAPHER|ADMIN)
- [x] POST /api/upload (placeholder — čeká na R2 ve Fázi 3)
- [x] Prisma schema: passwordHash přidán, datasource opraven pro Prisma 7
- [x] prisma generate — čistý build, tsc 0 chyb
- [x] .env.local.example — šablona pro uživatele

## Fáze 3: Frontend [DOKONČENA]
- [x] Nav komponenta — sticky header, wordmark, nav links
- [x] Footer komponenta
- [x] PhotoCard — mat board, grayscale hover, EditionBadge, cena v CZK
- [x] EditionBadge — limited_count (X/Y) + time_window + sold out
- [x] CountdownTimer — client component, live odpočet (hod:min:sec)
- [x] Homepage — hero, mise, Rising Talents grid, Signature spotlight, newsletter
- [x] /listing/[id] — asymetrický 8/4 grid, sticky sidebar, narrative, portfolio sekce
- [x] /photographer/[id] — hero 1/2+1/2, stats, works grid, CTA
- [x] prisma/seed.ts — 3 fotografové, 3 Rising Talents, 2 Signature Series (Neon DB)
- [x] @prisma/adapter-pg — Prisma 7 driver adapter pro přímé PostgreSQL připojení
- [x] tsc 0 chyb, HTTP 200 na všech stránkách

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
