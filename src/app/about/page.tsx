import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AboutPage() {

  return (
    <>
      <Nav active="about" />
      <main>

        {/* ── Opening — krémový, celá šířka ──────────────── */}
        <section className="px-6 md:px-12 pt-16 md:pt-28 pb-16 md:pb-28">
          <div className="max-w-screen-2xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#8a8170] block mb-12">
              Otisk · O projektu
            </span>
            <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-medium tracking-[-0.04em] leading-[0.92] text-[#1a1714] max-w-5xl mb-16">
              Fotografie si zaslouží být vzácná.
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-[#e7dfd2] pt-12">
              <div className="md:col-span-5">
                <p className="text-xl md:text-2xl leading-relaxed text-[#1a1714]">
                  Nejsme obchod. Jsme standard.
                </p>
                <p className="text-base leading-relaxed text-[#57503f] mt-4">
                  Fotografie je v Česku nedoceněná — ne proto, že lidem chybí vkus, ale proto, že trh nenabídl správný rámec. My ho vytváříme: vracíme fotografii hmotnou podstatu, limitaci a sběratelskou úctu.
                </p>
              </div>
              <div className="md:col-span-5 md:col-start-8">
                <p className="text-base leading-relaxed text-[#57503f]">
                  Každé dílo na platformě prošlo výběrovým procesem. Každá edice má pevně daný počet kusů nebo dobu dostupnosti. Jakmile se uzavře, neotevře se znovu. Tato vzácnost není marketingový trik — je to základ, na kterém stojí hodnota každého tisku.
                </p>
                <Link
                  href="/for-photographers"
                  className="inline-block mt-6 text-[10px] uppercase tracking-[0.18em] text-[#8a8170] hover:text-[#1a1714] transition-colors border-b border-[#e7dfd2] pb-px"
                >
                  Pro fotografy — zjistěte více →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Pilíře ─────────────────────────────────────── */}
        <section className="border-y border-[#e7dfd2]">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {[
                { title: "Kurátorský výběr", body: "Každé dílo prochází výběrovým procesem před zařazením do kolekce." },
                { title: "Limitované edice", body: "Pevně daný počet kusů. Po vyprodání edice nekoupíte znovu." },
                { title: "Pojištěná doprava", body: "Archivní balení, pojištěná zásilka až ke dveřím." },
                { title: "Certifikát pravosti", body: "Každý tisk je číslován, podepsán a opatřen certifikátem." },
              ].map(({ title, body }, i) => (
                <div
                  key={title}
                  className={[
                    "px-6 md:px-8 py-12 md:py-16 space-y-3",
                    i % 2 === 1 ? "border-l border-[#e7dfd2]" : "",
                    i >= 2 ? "border-t border-[#e7dfd2] md:border-t-0" : "",
                    i >= 1 ? "md:border-l md:border-[#e7dfd2]" : "",
                  ].filter(Boolean).join(" ")}
                >
                  <div className="text-lg font-medium tracking-[-0.01em] text-[#1a1714]">
                    {title}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[#8a8170] leading-snug max-w-[180px]">
                    {body}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Příběh ─────────────────────────────────────── */}
        <section className="py-16 md:py-28">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
              <div className="md:col-span-4 md:sticky md:top-32">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#8a8170] block mb-6">Proč to děláme</span>
                <h2 className="text-3xl md:text-4xl font-medium tracking-[-0.03em] leading-[1.05] text-[#1a1714]">
                  Tisk je jiná kategorie než digitální soubor.
                </h2>
              </div>
              <div className="md:col-span-7 md:col-start-6 space-y-10">
                <p className="text-lg md:text-xl leading-relaxed text-[#1a1714]">
                  Digitální fotografie zrušila vzácnost. Kdokoliv může mít kopii čehokoliv. To je skvělé pro dostupnost — a špatné pro hodnotu. Fotografové, kteří tvoří na nejvyšší úrovni, si zaslouží trh, který jejich práci chrání.
                </p>
                <p className="text-base leading-relaxed text-[#57503f]">
                  Otisk tento trh vytváří. Každá edice je definována buď pevným počtem kusů, nebo dobou dostupnosti. Po uzavření není znovu otevřena — nikdy. Sběratel, který tisk vlastní, vlastní něco, co se nebude dál množit.
                </p>
                <blockquote className="border-l border-[#1a1714] pl-8 py-2">
                  <p className="text-2xl md:text-3xl italic font-medium tracking-[-0.02em] leading-snug text-[#1a1714]">
                    „Certifikát pravosti není dokument.<br />Je to součást díla.“
                  </p>
                </blockquote>
                <p className="text-base leading-relaxed text-[#57503f]">
                  Certifikát s pořadovým číslem a vlastnoručním podpisem fotografa doprovází každý tisk. Není přiložen v obálce — je součástí balení jako nedílná část celku. QR kód na certifikátu vede do archivu, kde je tisk trvale registrován.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Kurátoři ───────────────────────────────────── */}
        <section className="border-t border-[#e7dfd2] py-16 md:py-28">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
              <div className="md:col-span-4">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#8a8170] block mb-6">Výběrový proces</span>
                <h2 className="text-3xl md:text-4xl font-medium tracking-[-0.03em] leading-[1.05] text-[#1a1714] mb-6">
                  Na platformě není každý.
                </h2>
                <p className="text-base text-[#57503f] leading-relaxed">
                  To není elitářství. Je to základ důvěry. Sběratel musí vědět, že díla na Otisk prošla nezávislým posouzením.
                </p>
              </div>
              <div className="md:col-span-7 md:col-start-6">
                <div className="space-y-0 divide-y divide-[#e7dfd2] border-t border-b border-[#e7dfd2]">
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
                      text: "Dílo nesmí být dostupné v identické edici jinde. Otisk garantuje, že tisk v dané specifikaci pochází pouze od nás.",
                    },
                  ].map(({ label, text }) => (
                    <div key={label} className="py-8 grid grid-cols-1 md:grid-cols-5 gap-4">
                      <h3 className="font-medium text-sm md:col-span-2 text-[#1a1714]">{label}</h3>
                      <p className="text-sm text-[#57503f] leading-relaxed md:col-span-3">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Tisk ───────────────────────────────────────── */}
        <section className="border-t border-[#e7dfd2] py-16 md:py-28">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
              {/* Vizuál papíru */}
              <div className="md:col-span-5">
                <div className="bg-[#f3ede3] p-8 md:p-12 aspect-[4/5] flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#8a8170]">Specifikace tisku</span>
                    <div className="text-4xl font-medium tracking-[-0.03em] leading-[1.05] text-[#1a1714]">Hahnemühle<br />Photo Rag<br />Baryta</div>
                  </div>
                  <div className="space-y-3 border-t border-[#e7dfd2] pt-6">
                    {[
                      ["Gramáž", "315 g/m²"],
                      ["Povrch", "Baritový, hedvábný mat"],
                      ["Bělost", "Přirozená bílá, bez optických zjasňovačů"],
                      ["Archivní stálost", "100+ let"],
                      ["Inkousty", "Archivní pigmentové"],
                      ["Správa barev", "Fotografem, ne automatem"],
                    ].map(([k, v]) => (
                      <div key={k} className="grid grid-cols-[5fr_6fr] gap-x-3 items-start">
                        <span className="text-[10px] uppercase tracking-[0.18em] text-[#8a8170] leading-snug pt-px">{k}</span>
                        <span className="otisk-mono text-sm text-[#1a1714] text-right leading-snug">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-6 md:col-start-7 space-y-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#8a8170] block">Materiál a řemeslo</span>
                <h2 className="text-4xl md:text-5xl font-medium tracking-[-0.03em] leading-[1.05] text-[#1a1714]">
                  Tisk, který přetrvá.
                </h2>
                <div className="space-y-6 text-[#57503f]">
                  <p className="text-base leading-relaxed">
                    Hahnemühle Photo Rag Baryta je papír, který používají přední ateliéry na světě. Baritový povrch napodobuje povrch klasického chemického tisku. Přirozená bílá bez optických zjasňovačů zajišťuje stabilitu barev na desetiletí.
                  </p>
                  <p className="text-base leading-relaxed">
                    Každý tisk prochází ručním procesem kontroly kvality. Správa barev je provedena fotografem v kalibrovaném prostředí. Finální tisk schvaluje fotograf osobně — před podpisem certifikátu.
                  </p>
                  <p className="text-base leading-relaxed">
                    Výsledkem je tisk, který odpovídá tomu, co fotograf viděl při vzniku díla. Ne aproximace. Originál.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Certifikát ─────────────────────────────────── */}
        <section className="border-t border-[#e7dfd2] py-16 md:py-28">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
              <div className="md:col-span-5 space-y-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#8a8170] block">Certifikát pravosti</span>
                <h2 className="text-4xl md:text-5xl font-medium tracking-[-0.03em] leading-[1.05] text-[#1a1714]">
                  Každý tisk je registrovaný originál.
                </h2>
                <div className="space-y-4 text-[#57503f]">
                  <p className="text-base leading-relaxed">
                    Certifikát pravosti je vydán při každém prodeji. Obsahuje pořadové číslo tisku, název díla, jméno fotografa, datum vydání a specifikaci edice.
                  </p>
                  <p className="text-base leading-relaxed">
                    QR kód na certifikátu vede do trvalého záznamu v archivu Otisk. Záznam je veřejně ověřitelný a neměnný.
                  </p>
                  <p className="text-base leading-relaxed">
                    Fotograf certifikát podepisuje vlastní rukou. Ne tisk — certifikát. Je to gesto, které má váhu.
                  </p>
                </div>
              </div>

              {/* Vizuál certifikátu */}
              <div className="md:col-span-5 md:col-start-8">
                <div className="le-certificate p-8 md:p-10 space-y-6">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#8a8170]">Certifikát pravosti</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#8a8170]">Otisk</span>
                  </div>
                  <div className="border-t border-[#e7dfd2] pt-6 space-y-1">
                    <div className="text-2xl font-medium tracking-[-0.02em] text-[#1a1714]">Název díla</div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-[#8a8170]">Jméno fotografa</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-[#e7dfd2] pt-6">
                    {[
                      ["Pořadové číslo", "12 / 50"],
                      ["Rok vzniku", "2025"],
                      ["Formát", "50 × 70 cm"],
                      ["Papír", "Hahnemühle Photo Rag Baryta"],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <div className="text-[10px] uppercase tracking-[0.18em] text-[#8a8170] mb-1">{k}</div>
                        <div className="otisk-mono text-sm text-[#1a1714]">{v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-[#e7dfd2] pt-6 flex justify-between items-end">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.18em] text-[#8a8170] mb-2">Podpis fotografa</div>
                      <div className="text-2xl italic text-[#c4bba9]">vlastnoruční podpis</div>
                    </div>
                    <div className="w-14 h-14 bg-[#f3ede3] flex items-center justify-center">
                      <span className="text-[8px] uppercase tracking-[0.18em] text-[#8a8170] text-center leading-tight">QR<br />ověření</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Tiers ──────────────────────────────────────── */}
        <section className="border-t border-[#e7dfd2] py-16 md:py-28">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="text-center mb-16 md:mb-20 space-y-4">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#8a8170] block">Struktura kolekce</span>
              <h2 className="text-4xl md:text-5xl font-medium tracking-[-0.03em] text-[#1a1714]">Dvě kategorie. Jeden standard.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-[#e7dfd2]">
              <div className="p-10 md:p-14 space-y-6 border-b md:border-b-0 md:border-r border-[#e7dfd2]">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#8a8170] block">Rising Talents</span>
                <h3 className="text-3xl font-medium tracking-[-0.02em] text-[#1a1714]">Fotografové na vzestupu.</h3>
                <p className="text-base text-[#57503f] leading-relaxed">
                  Rising Talents jsou fotografové, jejichž práce prošla kurátorským procesem a kteří vydávají první nebo druhou limitovanou edici. Edice mají pevně stanovený počet kusů. Ceny jsou dostupnější — proto, že sbírat na vzestupu má smysl.
                </p>
                <div className="pt-4 space-y-2">
                  {["Počet kusů: typicky 30–100", "Certifikát pravosti v ceně", "Vlastnoruční podpis fotografa"].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="w-1 h-1 bg-[#1a1714] block shrink-0" />
                      <span className="text-sm text-[#57503f]">{item}</span>
                    </div>
                  ))}
                </div>
                <Link href="/gallery?tier=RISING_TALENT" className="inline-block text-[10px] uppercase tracking-[0.18em] text-[#8a8170] hover:text-[#1a1714] transition-colors border-b border-[#e7dfd2] pb-1">
                  Prohlédnout Rising Talents →
                </Link>
              </div>
              <div className="p-10 md:p-14 space-y-6">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#8a8170] block">Signature Series</span>
                <h3 className="text-3xl font-medium tracking-[-0.02em] text-[#1a1714]">Prémiová edice.</h3>
                <p className="text-base text-[#57503f] leading-relaxed">
                  Signature Series jsou díla etablovaných fotografů s prokázanou historií sběratelského zájmu. Edice jsou časově omezené — bez pevného počtu kusů. Po uzavření nejsou znovu dostupné. Nikdy.
                </p>
                <div className="pt-4 space-y-2">
                  {["Časově omezená dostupnost", "Prémiový formát (70 × 100 cm)", "Certifikát pravosti s archivním číslem"].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="w-1 h-1 bg-[#1a1714] block shrink-0" />
                      <span className="text-sm text-[#57503f]">{item}</span>
                    </div>
                  ))}
                </div>
                <Link href="/gallery?tier=SIGNATURE" className="inline-block text-[10px] uppercase tracking-[0.18em] text-[#8a8170] hover:text-[#1a1714] transition-colors border-b border-[#e7dfd2] pb-1">
                  Prohlédnout Signature Series →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Closing CTA ────────────────────────────────── */}
        <section className="border-t border-[#e7dfd2] py-20 md:py-32">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12 text-center space-y-10">
            <h2 className="text-5xl md:text-7xl font-medium tracking-[-0.03em] leading-[0.95] text-[#1a1714] max-w-3xl mx-auto">
              Vaše první dílo čeká.
            </h2>
            <p className="text-lg text-[#57503f] max-w-lg mx-auto leading-relaxed">
              Kurátorský výběr limitovaných edic. Každá s pevným limitem. Některé se uzavřou dříve, než čekáte.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/gallery"
                className="bg-[#1a1714] text-[#faf6f0] px-12 py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-[#57503f] transition-colors"
              >
                Vybrat dílo
              </Link>
              <Link
                href="/photographers"
                className="border border-[#e7dfd2] text-[#1a1714] px-12 py-4 text-[10px] uppercase tracking-[0.2em] hover:border-[#1a1714] transition-colors"
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
