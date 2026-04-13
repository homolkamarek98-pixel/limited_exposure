import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AboutPage() {

  return (
    <>
      <Nav active="about" />
      <main>

        {/* ── Opening — černý, celá šířka ────────────────── */}
        <section className="bg-primary text-on-primary px-6 md:px-12 pt-24 md:pt-32 pb-20 md:pb-28">
          <div className="max-w-screen-2xl mx-auto">
            <span className="font-label text-[10px] uppercase tracking-widest text-on-primary/40 block mb-12">
              Limited Exposure · O projektu
            </span>
            <h1 className="serif-display text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter leading-[0.9] max-w-5xl mb-16">
              Fotografie si zaslouží být vzácná.
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-on-primary/20 pt-12">
              <div className="md:col-span-5">
                <p className="font-body text-xl md:text-2xl leading-relaxed text-on-primary/80">
                  Nejsme obchod. Jsme standard.
                </p>
                <p className="font-body text-base leading-relaxed text-on-primary/60 mt-4">
                  Fotografie je v Česku nedoceněná — ne proto, že lidem chybí vkus, ale proto, že trh nenabídl správný rámec. My ho vytváříme: vracíme fotografii hmotnou podstatu, limitaci a sběratelskou úctu.
                </p>
              </div>
              <div className="md:col-span-5 md:col-start-8">
                <p className="font-body text-base leading-relaxed text-on-primary/60">
                  Každé dílo na platformě prošlo výběrovým procesem. Každá edice má pevně daný počet kusů nebo dobu dostupnosti. Jakmile se uzavře, neotevře se znovu. Tato vzácnost není marketingový trik — je to základ, na kterém stojí hodnota každého tisku.
                </p>
                <Link
                  href="/for-photographers"
                  className="inline-block mt-6 font-label text-[10px] uppercase tracking-widest text-on-primary/40 hover:text-on-primary/80 transition-colors border-b border-on-primary/20 pb-px"
                >
                  Pro fotografy — zjistěte více →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Čísla ──────────────────────────────────────── */}
        <section className="bg-surface-container-low py-0">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-outline-variant/20 border-b border-outline-variant/20">
              {[
                { title: "Kurátorský výběr", body: "Každé dílo prochází výběrovým procesem před zařazením do kolekce." },
                { title: "Limitované edice", body: "Pevně daný počet kusů. Po vyprodání edice nekoupíte znovu." },
                { title: "Pojištěná doprava", body: "Archivní balení, pojištěná zásilka až ke dveřím." },
                { title: "Certifikát pravosti", body: "Každý tisk je číslován, podepsán a opatřen certifikátem." },
              ].map(({ title, body }) => (
                <div key={title} className="px-8 py-12 md:py-16 space-y-3">
                  <div className="font-headline text-lg font-black tracking-tight">
                    {title}
                  </div>
                  <div className="font-label text-[10px] uppercase tracking-widest text-outline leading-snug max-w-[180px]">
                    {body}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Příběh ─────────────────────────────────────── */}
        <section className="py-24 md:py-32 bg-surface">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
              <div className="md:col-span-4 md:sticky md:top-32">
                <span className="font-label text-[10px] uppercase tracking-widest text-outline block mb-6">Proč to děláme</span>
                <h2 className="serif-display text-3xl md:text-4xl font-black tracking-tighter leading-tight">
                  Tisk je jiná kategorie než digitální soubor.
                </h2>
              </div>
              <div className="md:col-span-7 md:col-start-6 space-y-10">
                <p className="font-body text-lg md:text-xl leading-relaxed text-on-surface">
                  Digitální fotografie zrušila vzácnost. Kdokoliv může mít kopii čehokoliv. To je skvělé pro dostupnost — a špatné pro hodnotu. Fotografové, kteří tvoří na nejvyšší úrovni, si zaslouží trh, který jejich práci chrání.
                </p>
                <p className="font-body text-base leading-relaxed text-on-surface-variant">
                  Limited Exposure tento trh vytváří. Každá edice je definována buď pevným počtem kusů, nebo dobou dostupnosti. Po uzavření není znovu otevřena — nikdy. Sběratel, který tisk vlastní, vlastní něco, co se nebude dál množit.
                </p>
                <blockquote className="border-l-2 border-primary pl-8 py-2">
                  <p className="serif-display text-2xl md:text-3xl italic font-bold leading-snug text-primary">
                    „Certifikát pravosti není dokument.<br />Je to součást díla."
                  </p>
                </blockquote>
                <p className="font-body text-base leading-relaxed text-on-surface-variant">
                  Certifikát s pořadovým číslem a vlastnoručním podpisem fotografa doprovází každý tisk. Není přiložen v obálce — je součástí balení jako nedílná část celku. QR kód na certifikátu vede do archivu, kde je tisk trvale registrován.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Kurátoři ───────────────────────────────────── */}
        <section className="bg-surface-container-low py-24 md:py-32">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
              <div className="md:col-span-4">
                <span className="font-label text-[10px] uppercase tracking-widest text-outline block mb-6">Výběrový proces</span>
                <h2 className="serif-display text-3xl md:text-4xl font-black tracking-tighter leading-tight mb-6">
                  Na platformě není každý.
                </h2>
                <p className="font-body text-base text-on-surface-variant leading-relaxed">
                  To není elitářství. Je to základ důvěry. Sběratel musí vědět, že díla na Limited Exposure prošla nezávislým posouzením.
                </p>
              </div>
              <div className="md:col-span-7 md:col-start-6">
                <div className="space-y-0 divide-y divide-outline-variant/20 border-t border-b border-outline-variant/20">
                  {[
                    {
                      label: "Vizuální konzistence",
                      text: "Posuzujeme celé portfolio, ne jedno dílo. Fotograf musí mít rozpoznatelný vizuální jazyk.",
                    },
                    {
                      label: "Technické zpracování",
                      text: "Soubory musí splňovat technické požadavky pro velkoformátový archivní tisk. Rozlišení, dynamický rozsah, správa barev.",
                    },
                    {
                      label: "Příběh díla",
                      text: "Každé dílo musí mít kontext. Kde, kdy, proč. Bez příběhu není certifikát úplný.",
                    },
                    {
                      label: "Exkluzivita edice",
                      text: "Dílo nesmí být dostupné v identické edici jinde. Limited Exposure garantuje, že tisk v dané specifikaci pochází pouze od nás.",
                    },
                  ].map(({ label, text }) => (
                    <div key={label} className="py-8 grid grid-cols-1 md:grid-cols-5 gap-4">
                      <h3 className="font-body font-bold text-sm md:col-span-2">{label}</h3>
                      <p className="font-body text-sm text-on-surface-variant leading-relaxed md:col-span-3">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Tisk ───────────────────────────────────────── */}
        <section className="py-24 md:py-32 bg-surface">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
              {/* Vizuál papíru */}
              <div className="md:col-span-5">
                <div className="bg-surface-container-highest p-8 md:p-12 aspect-[4/5] flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="font-label text-[10px] uppercase tracking-widest text-outline">Specifikace tisku</span>
                    <div className="serif-display text-4xl font-black tracking-tighter">Hahnemühle<br />Photo Rag<br />Baryta</div>
                  </div>
                  <div className="space-y-3 border-t border-outline-variant/30 pt-6">
                    {[
                      ["Gramáž", "315 g/m²"],
                      ["Povrch", "Baritový, hedvábný mat"],
                      ["Bělost", "Přirozená bílá, bez optických zjasňovačů"],
                      ["Archivní stálost", "100+ let"],
                      ["Inkousty", "Archivní pigmentové"],
                      ["Správa barev", "Fotografem, ne automatem"],
                    ].map(([k, v]) => (
                      <div key={k} className="grid grid-cols-[5fr_6fr] gap-x-3 items-start">
                        <span className="font-label text-[10px] uppercase tracking-widest text-outline leading-snug pt-px">{k}</span>
                        <span className="font-body text-sm font-medium text-right leading-snug">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-6 md:col-start-7 space-y-8">
                <span className="font-label text-[10px] uppercase tracking-widest text-outline block">Materiál a řemeslo</span>
                <h2 className="serif-display text-4xl md:text-5xl font-black tracking-tighter leading-tight">
                  Tisk, který přetrvá.
                </h2>
                <div className="space-y-6 text-on-surface-variant">
                  <p className="font-body text-base leading-relaxed">
                    Hahnemühle Photo Rag Baryta je papír, který používají přední ateliéry na světě. Baritový povrch napodobuje povrch klasického chemického tisku. Přirozená bílá bez optických zjasňovačů zajišťuje stabilitu barev na desetiletí.
                  </p>
                  <p className="font-body text-base leading-relaxed">
                    Každý tisk prochází ručním procesem kontroly kvality. Správa barev je provedena fotografem v kalibrovaném prostředí. Finální tisk schvaluje fotograf osobně — před podpisem certifikátu.
                  </p>
                  <p className="font-body text-base leading-relaxed">
                    Výsledkem je tisk, který odpovídá tomu, co fotograf viděl při vzniku díla. Ne aproximace. Originál.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Certifikát ─────────────────────────────────── */}
        <section className="bg-primary text-on-primary py-24 md:py-32">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
              <div className="md:col-span-5 space-y-8">
                <span className="font-label text-[10px] uppercase tracking-widest text-on-primary/40 block">Certifikát pravosti</span>
                <h2 className="serif-display text-4xl md:text-5xl font-black tracking-tighter leading-tight">
                  Každý tisk je registrovaný originál.
                </h2>
                <div className="space-y-4 text-on-primary/70">
                  <p className="font-body text-base leading-relaxed">
                    Certifikát pravosti je vydán při každém prodeji. Obsahuje pořadové číslo tisku, název díla, jméno fotografa, datum vydání a specifikaci edice.
                  </p>
                  <p className="font-body text-base leading-relaxed">
                    QR kód na certifikátu vede do trvalého záznamu v archivu Limited Exposure. Záznam je veřejně ověřitelný a neměnný.
                  </p>
                  <p className="font-body text-base leading-relaxed">
                    Fotograf certifikát podepisuje vlastní rukou. Ne tisk — certifikát. Je to gesto, které má váhu.
                  </p>
                </div>
              </div>

              {/* Vizuál certifikátu */}
              <div className="md:col-span-5 md:col-start-8">
                <div className="bg-[#f9f9f9] text-primary p-8 md:p-10 space-y-6 border border-on-primary/10">
                  <div className="flex justify-between items-start">
                    <span className="font-label text-[10px] uppercase tracking-widest text-outline">Certifikát pravosti</span>
                    <span className="font-label text-[10px] uppercase tracking-widest text-outline">Limited Exposure</span>
                  </div>
                  <div className="border-t border-outline-variant/30 pt-6 space-y-1">
                    <div className="serif-display text-2xl font-black tracking-tighter">Název díla</div>
                    <div className="font-label text-xs uppercase tracking-widest text-outline">Jméno fotografa</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-outline-variant/30 pt-6">
                    {[
                      ["Pořadové číslo", "12 / 50"],
                      ["Rok vzniku", "2025"],
                      ["Formát", "50 × 70 cm"],
                      ["Papír", "Hahnemühle Photo Rag Baryta"],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <div className="font-label text-[10px] uppercase tracking-widest text-outline mb-1">{k}</div>
                        <div className="font-body text-sm font-medium">{v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-outline-variant/30 pt-6 flex justify-between items-end">
                    <div>
                      <div className="font-label text-[10px] uppercase tracking-widest text-outline mb-2">Podpis fotografa</div>
                      <div className="serif-display text-2xl italic text-outline/40">vlastnoruční podpis</div>
                    </div>
                    <div className="w-14 h-14 bg-outline/10 flex items-center justify-center">
                      <span className="font-label text-[8px] uppercase tracking-widest text-outline text-center leading-tight">QR<br />ověření</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Tiers ──────────────────────────────────────── */}
        <section className="py-24 md:py-32 bg-surface">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="text-center mb-16 md:mb-20 space-y-4">
              <span className="font-label text-[10px] uppercase tracking-widest text-outline block">Struktura kolekce</span>
              <h2 className="serif-display text-4xl md:text-5xl font-black tracking-tighter">Dvě kategorie. Jeden standard.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-outline-variant/20">
              <div className="p-10 md:p-14 space-y-6 border-b md:border-b-0 md:border-r border-outline-variant/20">
                <span className="font-label text-[10px] uppercase tracking-widest text-secondary block">Rising Talents</span>
                <h3 className="serif-display text-3xl font-black tracking-tighter">Fotografové na vzestupu.</h3>
                <p className="font-body text-base text-on-surface-variant leading-relaxed">
                  Rising Talents jsou fotografové, jejichž práce prošla kurátorským procesem a kteří vydávají první nebo druhou limitovanou edici. Edice mají pevně stanovený počet kusů. Ceny jsou dostupnější — proto, že sbírat na vzestupu má smysl.
                </p>
                <div className="pt-4 space-y-2">
                  {["Počet kusů: typicky 30–100", "Certifikát pravosti v ceně", "Vlastnoruční podpis fotografa"].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="w-1 h-1 bg-primary block shrink-0" />
                      <span className="font-body text-sm text-on-surface-variant">{item}</span>
                    </div>
                  ))}
                </div>
                <Link href="/gallery?tier=RISING_TALENT" className="inline-block font-label text-xs uppercase tracking-widest border-b border-primary pb-1 hover:opacity-60 transition-opacity">
                  Prohlédnout Rising Talents →
                </Link>
              </div>
              <div className="p-10 md:p-14 bg-primary text-on-primary space-y-6">
                <span className="font-label text-[10px] uppercase tracking-widest text-on-primary/40 block">Signature Series</span>
                <h3 className="serif-display text-3xl font-black tracking-tighter">Prémiová edice.</h3>
                <p className="font-body text-base text-on-primary/70 leading-relaxed">
                  Signature Series jsou díla etablovaných fotografů s prokázanou historií sběratelského zájmu. Edice jsou časově omezené — bez pevného počtu kusů. Po uzavření nejsou znovu dostupné. Nikdy.
                </p>
                <div className="pt-4 space-y-2">
                  {["Časově omezená dostupnost", "Prémiový formát (70 × 100 cm)", "Certifikát pravosti s archivním číslem"].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="w-1 h-1 bg-on-primary block shrink-0" />
                      <span className="font-body text-sm text-on-primary/70">{item}</span>
                    </div>
                  ))}
                </div>
                <Link href="/gallery?tier=SIGNATURE" className="inline-block font-label text-xs uppercase tracking-widest border-b border-on-primary pb-1 hover:opacity-60 transition-opacity text-on-primary">
                  Prohlédnout Signature Series →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Closing CTA ────────────────────────────────── */}
        <section className="bg-surface-container-low py-24 md:py-32">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12 text-center space-y-10">
            <h2 className="serif-display text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] max-w-3xl mx-auto">
              Vaše první dílo čeká.
            </h2>
            <p className="font-body text-lg text-on-surface-variant max-w-lg mx-auto leading-relaxed">
              Kurátorský výběr limitovaných edic. Každá s pevným limitem. Některé se uzavřou dříve, než čekáte.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/gallery"
                className="bg-primary text-on-primary px-12 py-5 font-label text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                Vybrat dílo
              </Link>
              <Link
                href="/photographers"
                className="border border-outline/30 text-primary px-12 py-5 font-label text-xs uppercase tracking-widest hover:border-primary transition-colors"
              >
                Poznat fotografy →
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
