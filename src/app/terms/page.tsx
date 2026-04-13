import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = { title: "Obchodní podmínky — Limited Exposure" };

const sections = [
  {
    id: "uvod",
    title: "1. Úvodní ustanovení",
    content: `Tyto obchodní podmínky (dále „OP") upravují práva a povinnosti mezi provozovatelem platformy Limited Exposure (dále „prodávající") a kupujícím při nákupu limitovaných fotografických tisků prostřednictvím webového rozhraní na adrese limitedexposure.cz (dále „web").

Kupující uzavřením objednávky potvrzuje, že se s těmito OP seznámil a souhlasí s nimi.`,
  },
  {
    id: "zbozi",
    title: "2. Předmět smlouvy",
    content: `Předmětem smlouvy je prodej limitovaných fotografických tisků (dále „dílo") v edici specifikované na webu. Každé dílo je opatřeno certifikátem pravosti s pořadovým číslem, specifikací edice a vlastnoručním podpisem fotografa.

Dílo je tisknuto na papír Hahnemühle Photo Rag Baryta (315 g/m²) archivními pigmentovými inkousty se stálostí 100+ let. Barevná správa je provedena fotografem v kalibrovaném prostředí.

Limitovaná edice je uzavřena po dosažení maximálního počtu kusů nebo po uplynutí doby dostupnosti. Po uzavření edice nejsou díla z dané edice znovu vydávána.`,
  },
  {
    id: "objednavka",
    title: "3. Objednávka a uzavření smlouvy",
    content: `Objednávka je odeslána vyplněním objednávkového formuláře a kliknutím na tlačítko „Odeslat objednávku". Po odeslání objednávky obdrží kupující potvrzení na e-mailovou adresu uvedenou v objednávce.

Smlouva je uzavřena okamžikem připsání platby na účet prodávajícího. Do té doby je pořadové číslo rezervováno po dobu 5 pracovních dní.

Prodávající si vyhrazuje právo odmítnout objednávku v případě, že je dílo vyprodáno nebo edice uzavřena v době mezi odesláním objednávky a připsáním platby.`,
  },
  {
    id: "platba",
    title: "4. Cena a platba",
    content: `Ceny jsou uvedeny v Kč včetně DPH. Cena dopravy je uvedena při výběru dopravce v objednávkovém formuláři.

Platba probíhá bankovním převodem na základě variabilního symbolu, který obdrží kupující v potvrzení objednávky. Platbu je nutné provést do 5 pracovních dní od odeslání objednávky.

V případě nepřijetí platby v tomto termínu je rezervace pořadového čísla zrušena a dílo je uvolněno k prodeji.`,
  },
  {
    id: "doprava",
    title: "5. Doprava a doručení",
    content: `Dílo je odesláno do 3–5 pracovních dní od připsání platby. Zásilka je pojištěna na plnou hodnotu díla.

Dílo je baleno do archivního papíru, vloženého do ochranné trubice nebo ploché kartonové krabice s tuhými stranami. Způsob balení závisí na formátu tisku.

K zásilce je přiložen certifikát pravosti v ochranném obalu.`,
  },
  {
    id: "reklamace",
    title: "6. Reklamace a vrácení zboží",
    content: `Kupující má právo odstoupit od smlouvy do 14 dnů od převzetí díla bez udání důvodu, pokud bylo dílo zakoupeno jako spotřebitel (fyzická osoba). Dílo musí být vráceno v původním stavu a balení.

Dílo vykazující poškození při dopravě je třeba reklamovat neprodleně, nejpozději do 3 dnů od převzetí. Fotografická dokumentace poškození je podmínkou uznání reklamace.

Reklamace se uplatňují e-mailem na adresu hello@limitedexposure.cz s popisem závady a fotografickou dokumentací.

Na vady materiálu nebo tisku se vztahuje záruční lhůta 24 měsíců od převzetí.`,
  },
  {
    id: "certifikat",
    title: "7. Certifikát pravosti a archivní registrace",
    content: `Každý prodaný tisk obdrží certifikát pravosti s jedinečným pořadovým číslem ve formátu LE-XXX/YYY (pořadové číslo / celkový počet kusů edice). Certifikát obsahuje: název díla, jméno fotografa, specifikaci edice, datum vydání a vlastnoruční podpis fotografa.

QR kód na certifikátu odkazuje na veřejně dostupný archivní záznam na webu Limited Exposure. Záznam obsahuje ověřitelné informace o tisku a je trvale dostupný po dobu existence platformy.

Certifikát je součástí díla a jeho absence snižuje hodnotu tisku. Prodávající doporučuje certifikát uchovávat spolu s tiskem.`,
  },
  {
    id: "ostatni",
    title: "8. Ostatní ustanovení",
    content: `Tyto OP se řídí právním řádem České republiky. Případné spory budou řešeny u příslušného soudu v České republice.

Prodávající si vyhrazuje právo tyto OP měnit. Změny jsou účinné jejich zveřejněním na webu. Na objednávky podané před změnou se vztahují OP platné v době odeslání objednávky.

Tyto obchodní podmínky jsou platné a účinné od 1. 1. 2025.`,
  },
];

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="max-w-screen-2xl mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-32">

        <div className="max-w-3xl">
          <span className="font-label text-[10px] uppercase tracking-widest text-[#777] block mb-6">Legal</span>
          <h1 className="font-headline text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4">
            Obchodní podmínky
          </h1>
          <p className="font-body text-sm text-[#777] mb-16">
            Platné od 1. 1. 2025 · Limited Exposure
          </p>

          {/* Obsah */}
          <nav className="mb-16 p-6 bg-[#f3f3f4] border border-[#e8e8e8]">
            <p className="font-label text-[10px] uppercase tracking-widest font-bold mb-4">Obsah</p>
            <ol className="space-y-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="font-body text-sm text-[#474747] hover:text-black transition-colors">
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Sekce */}
          <div className="space-y-12">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="font-label text-xs uppercase tracking-widest font-bold mb-4 pb-3 border-b border-[#e8e8e8]">
                  {s.title}
                </h2>
                <div className="font-body text-sm text-[#474747] leading-relaxed whitespace-pre-line">
                  {s.content}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-[#e8e8e8]">
            <p className="font-body text-xs text-[#aaa]">
              Dotazy k obchodním podmínkám: hello@limitedexposure.cz
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
