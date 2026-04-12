# Provozní pravidla pro Claude Code — Limited Exposure

## 1. Základní chování

### Proaktivita s hranicemi
- Pracuj autonomně dokud víš jak postupovat podle pravidel projektu
- Pokud nevíš jak dál, ZASTAV SE a zeptej se — neptej se zbytečně, ale raději jednou víc než méně
- Nikdy neodhaduj záměr uživatele — pokud je zadání nejednoznačné, zeptej se na upřesnění

### Halucinace a nejistota
- Pokud si nejsi jistý technickým faktem, knihovnou nebo API — ZASTAV SE, napiš "Nejsem si jistý: [konkrétní otázka]" a počkej na odpověď
- Nikdy nevymýšlej názvy funkcí, endpointů nebo knihoven — ověř si je nebo se zeptej
- Pokud zjistíš že jsi udělal chybu nebo šel špatným směrem — oznam to okamžitě, vysvětli co se stalo a navrhni opravu

### Technická rozhodnutí
- Pokud narazíš na rozhodnutí které ovlivní architekturu, výkon nebo celý projekt, NEZASTAVOVEJ SE — nabídni 2–3 konkrétní možnosti s krátkým popisem výhod a nevýhod každé, a počkej na rozhodnutí uživatele
- Příklady kdy nabídnout možnosti: výběr databázového přístupu, způsob autentizace, struktura URL, způsob platební integrace

---

## 2. Bezpečnost a citlivá data

### API klíče a secrets
- NIKDY nezapisuj API klíče, hesla ani tokeny přímo do kódu
- Vždy používej .env soubor — pokud neexistuje, vytvoř .env.example s popisem proměnných
- Před napojením na jakoukoliv externí službu (Stripe, Cloudflare, Google) se zeptej uživatele zda má připravené přihlašovací údaje
- .env nikdy nepřidávej do git commitu — ověř že je v .gitignore

### Co nikdy nedělat
- Nesdílej ani nevypisuj obsah .env souborů
- Neukládej citlivá data do MEMORY.md ani jiných sledovaných souborů
- Neinstaluj balíčky které nebyly schváleny nebo nevyplývají přímo z architektury projektu

---

## 3. Git a commity

### Frekvence
- Commituj na konci každé dokončené fáze (ne po každém souboru)
- Výjimka: pokud fáze trvá velmi dlouho, udělej průběžný commit s prefixem "wip:"

### Formát commit zpráv
- feat: popis (nová funkce)
- fix: popis (oprava chyby)
- init: popis (inicializace)
- wip: popis (rozpracováno)
- docs: popis (dokumentace)
- test: popis (testy)

### Co vždy commitovat
- Aktualizovaný PROGRESS.md (zaškrtnuté hotové úkoly)
- Aktualizovaný MEMORY.md (log co bylo uděláno)
- Nikdy necommitovat: .env, node_modules, .DS_Store

---

## 4. Komunikace s uživatelem

### Kdy se zeptat (povinně)
- Nerozumíš zadání nebo je zadání v rozporu s pravidly
- Narazíš na technické rozhodnutí s dopadem na celý projekt
- Chystáš se smazat nebo přepsat existující kód
- Instaluješ nový balíček který nebyl zmíněn v architektuře
- Zjistíš potenciální bezpečnostní problém

### Jak oznamovat halucinaci nebo chybu
Použij tento formát:
⚠️ STOP — [co se stalo]
Příčina: [proč k tomu došlo]
Navrhované řešení: [co udělat dál]
Potřebuji: [co od tebe potřebuji k pokračování]

### Jak nabídnout technické možnosti
Použij tento formát:
🔀 ROZHODNUTÍ POTŘEBA — [název rozhodnutí]
A) [název] — [1 věta popis] — výhoda: X, nevýhoda: Y
B) [název] — [1 věta popis] — výhoda: X, nevýhoda: Y
C) [název] — [1 věta popis] — výhoda: X, nevýhoda: Y
Doporučuji: [A/B/C] protože [důvod]

### Jak reportovat dokončení fáze
Použij tento formát:
✅ FÁZE [číslo] DOKONČENA — [název]
Hotovo: [seznam co bylo uděláno]
Commit: [hash nebo zpráva]
Připraveno k: Fáze [číslo+1] — [název]
Otázky před pokračováním: [případné otázky nebo "žádné"]

---

## 5. Scope agentů (připomínka)
Každý agent pracuje pouze ve svém scope definovaném v RULES.md.
Před zahájením práce vždy přečti: RULES.md → MEMORY.md → PROGRESS.md