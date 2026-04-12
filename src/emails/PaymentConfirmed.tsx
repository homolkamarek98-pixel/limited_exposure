import {
  Html, Head, Body, Container, Section, Text, Heading, Hr, Preview,
} from "@react-email/components";

export type PaymentConfirmedProps = {
  orderNumber: string;
  firstName: string;
  items: Array<{ photoTitle: string; photographerName: string }>;
  carrier: string;
};

const carrierLabels: Record<string, string> = {
  ZASILKOVNA: "Zásilkovna",
  CZECH_POST: "Česká pošta",
  DPD: "DPD",
  PPL: "PPL",
  TOP_TRANS: "Top Trans",
};

export default function PaymentConfirmed({ orderNumber, firstName, items, carrier }: PaymentConfirmedProps) {
  return (
    <Html lang="cs">
      <Head />
      <Preview>Platba potvrzena — vaše díla se připravují k tisku</Preview>
      <Body style={{ background: "#f3f3f4", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        <Container style={{ maxWidth: "560px", margin: "40px auto", background: "#ffffff" }}>

          <Section style={{ background: "#000000", padding: "32px 40px" }}>
            <Text style={{ color: "#ffffff", fontWeight: 900, fontSize: "14px", letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>
              Limited Exposure
            </Text>
          </Section>

          <Section style={{ padding: "40px 40px 32px" }}>
            <Heading style={{ fontSize: "22px", fontWeight: 900, margin: "0 0 8px", letterSpacing: "-0.03em" }}>
              Platba potvrzena
            </Heading>
            <Text style={{ color: "#777", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 32px" }}>
              Objednávka #{orderNumber}
            </Text>

            <Text style={{ fontSize: "15px", lineHeight: "1.6", color: "#474747" }}>
              Dobrý den, {firstName},<br />
              vaše platba byla přijata. Vaše díla jsou nyní ve frontě pro tisk na Hahnemühle Photo Rag Baryta.
            </Text>

            <Hr style={{ borderColor: "#e8e8e8", margin: "32px 0" }} />

            {items.map((item, i) => (
              <Text key={i} style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 8px" }}>
                {item.photoTitle} <span style={{ fontWeight: 400, color: "#777" }}>— {item.photographerName}</span>
              </Text>
            ))}

            <Hr style={{ borderColor: "#e8e8e8", margin: "32px 0" }} />

            <Section style={{ background: "#f3f3f4", padding: "24px", marginBottom: "24px" }}>
              <Text style={{ fontWeight: 900, fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 12px" }}>
                Co bude dál
              </Text>
              <Text style={{ fontSize: "13px", lineHeight: "2", color: "#474747", margin: 0 }}>
                1. Tisk na profesionální plotně (1–2 dny)<br />
                2. Ruční kontrola kvality a balení<br />
                3. Expedice dopravcem {carrierLabels[carrier] ?? carrier}<br />
                4. Email s číslem zásilky
              </Text>
            </Section>

            <Text style={{ fontSize: "13px", color: "#777", lineHeight: "1.6" }}>
              Průměrná doba od platby po odeslání je 3–5 pracovních dní.
            </Text>
          </Section>

          <Section style={{ background: "#f3f3f4", padding: "24px 40px" }}>
            <Text style={{ fontSize: "11px", color: "#aaa", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
              © {new Date().getFullYear()} Limited Exposure · Originální tisky · Certifikovaná pravost
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}
