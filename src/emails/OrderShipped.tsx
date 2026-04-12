import {
  Html, Head, Body, Container, Section, Text, Heading, Hr, Link, Preview,
} from "@react-email/components";

export type OrderShippedProps = {
  orderNumber: string;
  firstName: string;
  carrier: string;
  trackingNumber: string;
  trackingUrl?: string;
  items: Array<{ photoTitle: string; photographerName: string }>;
};

const carrierLabels: Record<string, string> = {
  ZASILKOVNA: "Zásilkovna",
  CZECH_POST: "Česká pošta",
  DPD: "DPD",
  PPL: "PPL",
  TOP_TRANS: "Top Trans",
};

export default function OrderShipped({ orderNumber, firstName, carrier, trackingNumber, trackingUrl, items }: OrderShippedProps) {
  return (
    <Html lang="cs">
      <Head />
      <Preview>Zásilka odeslána — sledovací číslo {trackingNumber}</Preview>
      <Body style={{ background: "#f3f3f4", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        <Container style={{ maxWidth: "560px", margin: "40px auto", background: "#ffffff" }}>

          <Section style={{ background: "#000000", padding: "32px 40px" }}>
            <Text style={{ color: "#ffffff", fontWeight: 900, fontSize: "14px", letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>
              Limited Exposure
            </Text>
          </Section>

          <Section style={{ padding: "40px 40px 32px" }}>
            <Heading style={{ fontSize: "22px", fontWeight: 900, margin: "0 0 8px", letterSpacing: "-0.03em" }}>
              Zásilka odeslána
            </Heading>
            <Text style={{ color: "#777", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 32px" }}>
              Objednávka #{orderNumber}
            </Text>

            <Text style={{ fontSize: "15px", lineHeight: "1.6", color: "#474747" }}>
              Dobrý den, {firstName},<br />
              vaše díla opustila náš ateliér a jsou na cestě k vám.
            </Text>

            <Hr style={{ borderColor: "#e8e8e8", margin: "32px 0" }} />

            <Section style={{ background: "#f3f3f4", padding: "24px", marginBottom: "32px" }}>
              <Text style={{ fontWeight: 900, fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 16px" }}>
                Sledování zásilky
              </Text>
              <Text style={{ fontSize: "13px", lineHeight: "1.8", color: "#474747", margin: "0 0 16px" }}>
                Dopravce: <strong>{carrierLabels[carrier] ?? carrier}</strong><br />
                Číslo zásilky: <strong>{trackingNumber}</strong>
              </Text>
              {trackingUrl && (
                <Link
                  href={trackingUrl}
                  style={{ background: "#000", color: "#fff", padding: "12px 24px", fontWeight: 700, fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none", display: "inline-block" }}
                >
                  Sledovat zásilku →
                </Link>
              )}
            </Section>

            {items.map((item, i) => (
              <Text key={i} style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 8px" }}>
                {item.photoTitle} <span style={{ fontWeight: 400, color: "#777" }}>— {item.photographerName}</span>
              </Text>
            ))}

            <Hr style={{ borderColor: "#e8e8e8", margin: "32px 0" }} />

            <Text style={{ fontSize: "13px", color: "#777", lineHeight: "1.6" }}>
              Zásilka je zabalena do ochranných materiálů, které zabraňují poškození tisku. Doporučujeme uskladnit dílo na místě chráněném před přímým slunečním svitem.
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
