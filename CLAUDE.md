# OTISK (dříve Limited Exposure) — Claude Code pravidla

## Stack
Next.js 16 (App Router) + TypeScript + Tailwind v4 + Prisma + PostgreSQL (Neon) + NextAuth.js + Zásilkovna + Vercel

## Klíčové technické detaily
- `editionId` v košíku: formát `uuid__S` — splitovat na `__` před DB lookup
- Migrace desync s DB — používat `prisma db push` místo `migrate dev`
- Seed: vyžaduje `Pool` s `ssl: { rejectUnauthorized: false }` (Neon SSL)
- ListingProductView: parent client component, drží `selectedFrame` state sdílený s ListingSidebar

## Commity
Conventional commits: feat: / fix: / init: / wip: / docs: / test:

## Před zahájením práce
Přečti: PROGRESS.md → zkontroluj branch (git branch)
