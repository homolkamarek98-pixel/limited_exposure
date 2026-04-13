import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = { title: "Ochrana soukromí — Limited Exposure" };

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="max-w-screen-2xl mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-32">
        <div className="max-w-3xl">
          <span className="font-label text-[10px] uppercase tracking-widest text-[#777] block mb-6">Legal</span>
          <h1 className="font-headline text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4">
            Ochrana osobních údajů
          </h1>
          <p className="font-body text-sm text-[#777] mb-16">
            GDPR · Platné od 1. 1. 2025 · Limited Exposure
          </p>

          <div className="space-y-12 font-body text-sm text-[#474747] leading-relaxed">

            <section id="spravce" className="scroll-mt-24">
              <h2 className="font-label text-xs uppercase tracking-widest font-bold mb-4 pb-3 border-b border-[#e8e8e8]">
                1. Správce osobních údajů
              </h2>
              <p>Správcem osobních údajů je provozovatel platformy Limited Exposure (dále „správce"). Kontakt: hello@limitedexposure.cz</p>
            </section>

            <section id="udaje" className="scroll-mt-24">
              <h2 className="font-label text-xs uppercase tracking-widest font-bold mb-4 pb-3 border-b border-[#e8e8e8]">
                2. Jaké údaje zpracováváme
              </h2>
              <p className="mb-4">Zpracováváme pouze údaje nezbytné pro splnění objednávky a zákonných povinností:</p>
              <ul className="space-y-2 list-none">
                {[
                  "Identifikační údaje: jméno, příjmení, název firmy, IČO, DIČ",
                  "Kontaktní údaje: e-mailová adresa, telefonní číslo",
                  "Doručovací a fakturační adresa",
                  "Platební údaje: variabilní symbol, informace o provedení platby (bez čísla karty)",
                  "Údaje o objednávce: zakoupená díla, cena, datum objednávky",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-[#ccc] mt-1">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section id="ucel" className="scroll-mt-24">
              <h2 className="font-label text-xs uppercase tracking-widest font-bold mb-4 pb-3 border-b border-[#e8e8e8]">
                3. Účel zpracování
              </h2>
              <div className="space-y-4">
                <p><strong>Plnění smlouvy (čl. 6 odst. 1 písm. b GDPR):</strong> Zpracování objednávky, doručení zásilky, vystavení certifikátu pravosti a zajištění zákaznické podpory.</p>
                <p><strong>Zákonná povinnost (čl. 6 odst. 1 písm. c GDPR):</strong> Vedení účetní evidence, daňové doklady, plnění povinností dle zákona o DPH.</p>
                <p><strong>Oprávněný zájem (čl. 6 odst. 1 písm. f GDPR):</strong> Ochrana před podvody, řešení sporů, zlepšování služeb.</p>
              </div>
            </section>

            <section id="doba" className="scroll-mt-24">
              <h2 className="font-label text-xs uppercase tracking-widest font-bold mb-4 pb-3 border-b border-[#e8e8e8]">
                4. Doba uchování
              </h2>
              <p>Údaje spojené s objednávkou uchováváme po dobu 10 let od uzavření smlouvy (zákonná povinnost pro účetní doklady). Archivní záznam certifikátu pravosti je veden trvale jako součást záruky pravosti díla.</p>
            </section>

            <section id="prava" className="scroll-mt-24">
              <h2 className="font-label text-xs uppercase tracking-widest font-bold mb-4 pb-3 border-b border-[#e8e8e8]">
                5. Vaše práva
              </h2>
              <p className="mb-4">Máte právo na přístup ke svým údajům, opravu, výmaz (s výjimkou zákonem vyžadovaných záznamů), omezení zpracování, přenositelnost dat a vznést námitku. Stížnost lze podat u Úřadu pro ochranu osobních údajů (uoou.cz).</p>
              <p>Pro uplatnění práv kontaktujte: hello@limitedexposure.cz</p>
            </section>

            <section id="cookies" className="scroll-mt-24">
              <h2 className="font-label text-xs uppercase tracking-widest font-bold mb-4 pb-3 border-b border-[#e8e8e8]">
                6. Cookies
              </h2>
              <p>Web používá pouze technicky nezbytné cookies pro fungování košíku a přihlášení (session cookie). Nepoužíváme cookies pro sledování nebo reklamu třetích stran.</p>
            </section>

          </div>

          <div className="mt-16 pt-8 border-t border-[#e8e8e8]">
            <p className="font-body text-xs text-[#aaa]">
              Dotazy k ochraně osobních údajů: hello@limitedexposure.cz
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
