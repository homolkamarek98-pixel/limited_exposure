# Memory log — Limited Exposure
Formát záznamu: [datum] [AGENT] — [akce] — [důvod]

## Log
- [2026-04-12] ORCHESTRATOR — vytvořena struktura projektu, git init, GitHub repo
- [2026-04-12] ORCHESTRATOR — inicializován Next.js 16 (create-next-app@latest) + TypeScript + Tailwind
- [2026-04-12] ORCHESTRATOR — vytvořeny CLAUDE.md, RULES.md, ARCHITECTURE.md, DESIGN.md, PROGRESS.md
- [2026-04-12] ORCHESTRATOR — Prisma schéma opraveno z generického e-shop na Limited Exposure doménový model (User, Photographer, Photo, Edition, Order, Certificate)
- [2026-04-12] ORCHESTRATOR — .gitignore ověřen, .env.example připraven
- [2026-04-12] ORCHESTRATOR — Fáze 0 dokončena, první commit a push

- [2026-04-12] ORCHESTRATOR — Fáze 1 init: vytvořeny SVG loga, tokeny, Playfair Display — CHYBNĚ
- [2026-04-12] ORCHESTRATOR — Fáze 1 oprava: brand přepsán podle stitch předloh. Fonty: Noto Serif + Inter + Manrope (ne Playfair). Barvy: MD3 monochrome scale (žádné gold/cream). Border-radius 0px všude. Logo: čistý Noto Serif wordmark.
- [2026-04-12] ORCHESTRATOR — Fáze 2 backend: next-auth@4 + bcryptjs, JWT credentials auth, API routes (listings GET/POST, listings/[id] GET, upload placeholder), Prisma 7 migrace (url přesunuta z schema do prisma.config.ts, import z @/generated/prisma), tsc clean

## Technická rozhodnutí
- Next.js verze: nainstalováno 16.x (create-next-app@latest) — App Router API zachováno, Stack specifikoval v14+
- Prisma generator: prisma-client-js (standardní), výstup do src/generated/prisma
- Ceny: ukládány v haléřích (Int) — 5000 Kč = 500000 haléřů
- Tailwind v4: konfigurace výhradně přes CSS @theme (žádný tailwind.config.ts)
- Fonty: Noto Serif (headline) + Inter (body) + Manrope (label) — next/font/google, display:swap
- Paleta: MD3 monochrome scale — primary #000000, surface #f9f9f9, surface hierarchy greys, žádné gold/cream
- Border-radius: 0px všude bez výjimky — CSS reset `border-radius: 0 !important`
- Design předloha: stitch.zip — "The Silent Curator" / "The Curated Void" filozofie
- Prisma 7 breaking change: url se nekonfiguruje v schema.prisma ale v prisma.config.ts (datasource.url); runtime klient čte DATABASE_URL z env automaticky
- Prisma 7 import: `from "@/generated/prisma"` (ne `/client`)
- Auth: NextAuth v4, JWT strategie, credentials provider (email + bcrypt), žádný Prisma adapter, session rozšířena o id + role
- Platby: Neon PostgreSQL (free serverless) — uživatel zakládá účet na neon.tech
