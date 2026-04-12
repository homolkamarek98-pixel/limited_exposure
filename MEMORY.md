# Memory log — Limited Exposure
Formát záznamu: [datum] [AGENT] — [akce] — [důvod]

## Log
- [2026-04-12] ORCHESTRATOR — vytvořena struktura projektu, git init, GitHub repo
- [2026-04-12] ORCHESTRATOR — inicializován Next.js 16 (create-next-app@latest) + TypeScript + Tailwind
- [2026-04-12] ORCHESTRATOR — vytvořeny CLAUDE.md, RULES.md, ARCHITECTURE.md, DESIGN.md, PROGRESS.md
- [2026-04-12] ORCHESTRATOR — Prisma schéma opraveno z generického e-shop na Limited Exposure doménový model (User, Photographer, Photo, Edition, Order, Certificate)
- [2026-04-12] ORCHESTRATOR — .gitignore ověřen, .env.example připraven
- [2026-04-12] ORCHESTRATOR — Fáze 0 dokončena, první commit a push

## Technická rozhodnutí
- Next.js verze: nainstalováno 16.x (create-next-app@latest) — App Router API zachováno, Stack specifikoval v14+
- Prisma generator: prisma-client-js (standardní), výstup do src/generated/prisma
- Ceny: ukládány v haléřích (Int) — 5000 Kč = 500000 haléřů
