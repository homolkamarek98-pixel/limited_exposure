# Provozní pravidla pro Claude Code — Limited Exposure

## PROAKTIVITA S HRANICEMI
- Pracuj autonomně dokud víš jak postupovat
- Pokud nevíš jak dál, ZASTAV SE a zeptej se
- Nikdy neodhaduj záměr — při nejasnosti se zeptej

## HALUCINACE A NEJISTOTA
- Pokud si nejsi jistý technickým faktem — ZASTAV SE a napiš "Nejsem si jistý: [otázka]"
- Nikdy nevymýšlej názvy funkcí, endpointů nebo knihoven
- Pokud jsi šel špatným směrem — oznam to okamžitě a navrhni opravu

## TECHNICKÁ ROZHODNUTÍ
- Pokud rozhodnutí ovlivní architekturu celého projektu — nabídni 2–3 možnosti a počkej na rozhodnutí
- Formát: 🔀 ROZHODNUTÍ — A) ... B) ... C) ... Doporučuji: X protože Y

## BEZPEČNOST
- NIKDY nezapisuj API klíče do kódu — vždy jen .env
- Vždy vytvoř .env.example s popisem proměnných
- .env musí být v .gitignore — ověř před každým commitem
- Před napojením na externí službu (Stripe, Cloudflare, Google) se zeptej zda mám připravené přihlašovací údaje

## COMMITY
- Commituj na konci každé dokončené fáze
- Formát zpráv: feat: / fix: / init: / wip: / docs: / test:
- Vždy commituj aktualizované PROGRESS.md a MEMORY.md
- Nikdy necommituj: .env, node_modules, .DS_Store

## KOMUNIKACE
- Zastav se a zeptej se pokud: nerozumíš zadání, chystáš se smazat existující kód, instaluješ neschválený balíček, najdeš bezpečnostní problém
- Při chybě použij: ⚠️ STOP — [co se stalo] / Příčina: / Navrhované řešení: / Potřebuji:
- Při dokončení fáze použij: ✅ FÁZE [X] DOKONČENA / Hotovo: / Commit: / Připraveno k: / Otázky:

## SCOPE AGENTŮ
Viz RULES.md — každý agent pracuje pouze ve svém scope.
Před zahájením práce vždy přečti: RULES.md → MEMORY.md → PROGRESS.md

## POZNÁMKA K NEXT.JS VERZI
Nainstalovaná verze je Next.js 16 (create-next-app@latest). Stack specifikoval v14+ App Router —
App Router API je zachováno. Před psaním kódu čti docs v node_modules/next/dist/docs/.
