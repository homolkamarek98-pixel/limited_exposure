import {
  Html, Head, Body, Container, Section, Text, Heading, Hr, Link, Preview,
} from "@react-email/components";

export type OrderConfirmationProps = {
  orderNumber: string;
  firstName: string;
  items: Array<{
    photoTitle: string;
    photographerName: string;
    price: number;
    certificateNumber: number;
    serialNumber: string;
  }>;
  totalAmount: number;
  paymentReference: string;
  carrier: string;
  addressLine1: string;
  city: string;
  postalCode: string;
};

function formatPrice(halers: number) {
  return new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK", minimumFractionDigits: 0 }).format(halers / 100);
}

const carrierLabels: Record<string, string> = {
  ZASILKOVNA: "Zásilkovna",
  CZECH_POST: "Česká pošta",
  DPD: "DPD",
  PPL: "PPL",
  TOP_TRANS: "Top Trans",
};

export default function OrderConfirmation({
  orderNumber,
  firstName,
  items,
  totalAmount,
  paymentReference,
  carrier,
  addressLine1,
  city,
  postalCode,
}: OrderConfirmationProps) {
  return (
    <Html lang="cs">
      <Head />
      <Preview>Objednávka {orderNumber} přijata — čekáme na platbu</Preview>
      <Body style={{ background: "#f3f3f4", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        <Container style={{ maxWidth: "560px", margin: "40px auto", background: "#ffffff" }}>

          {/* Header */}
          <Section style={{ background: "#000000", padding: "32px 40px" }}>
            <Text style={{ color: "#ffffff", fontWeight: 900, fontSize: "14px", letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>
              Limited Exposure
            </Text>
          </Section>

          {/* Body */}
          <Section style={{ padding: "40px 40px 32px" }}>
            <Heading style={{ fontSize: "22px", fontWeight: 900, margin: "0 0 8px", letterSpacing: "-0.03em" }}>
              Objednávka přijata
            </Heading>
            <Text style={{ color: "#777", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 32px" }}>
              #{orderNumber}
            </Text>

            <Text style={{ fontSize: "15px", lineHeight: "1.6", color: "#474747" }}>
              Dobrý den, {firstName},<br />
              vaše objednávka byla přijata. Prosíme o provedení platby na účet níže.
            </Text>

            <Hr style={{ borderColor: "#e8e8e8", margin: "32px 0" }} />

            {/* Items */}
            {items.map((item, i) => (
              <Section key={i} style={{ marginBottom: "20px" }}>
                <Text style={{ fontWeight: 900, fontSize: "14px", margin: "0 0 2px", letterSpacing: "-0.01em" }}>
                  {item.photoTitle}
                </Text>
                <Text style={{ color: "#777", fontSize: "12px", margin: "0 0 4px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  {item.photographerName}
                </Text>
                <Text style={{ fontSize: "12px", color: "#aaa", margin: "0 0 4px", letterSpacing: "0.05em" }}>
                  Certifikát: {item.serialNumber}
                </Text>
                <Text style={{ fontWeight: 700, fontSize: "15px", margin: 0 }}>
                  {formatPrice(item.price)}
                </Text>
              </Section>
            ))}

            <Hr style={{ borderColor: "#e8e8e8", margin: "24px 0" }} />

            <Section style={{ display: "flex", justifyContent: "space-between", marginBottom: "32px" }}>
              <Text style={{ fontWeight: 900, fontSize: "16px", margin: 0 }}>Celkem</Text>
              <Text style={{ fontWeight: 900, fontSize: "16px", margin: 0 }}>{formatPrice(totalAmount)}</Text>
            </Section>

            {/* Payment instructions */}
            <Section style={{ background: "#f3f3f4", padding: "24px", marginBottom: "32px" }}>
              <Text style={{ fontWeight: 900, fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 16px" }}>
                Platební instrukce
              </Text>
              <Text style={{ fontSize: "13px", lineHeight: "1.8", color: "#474747", margin: 0 }}>
                Číslo účtu: <strong>1234567890 / 0800</strong><br />
                Variabilní symbol: <strong>{paymentReference}</strong><br />
                Částka: <strong>{formatPrice(totalAmount)}</strong><br />
                Banka: Česká spořitelna
              </Text>
            </Section>

            {/* Delivery */}
            <Section style={{ marginBottom: "32px" }}>
              <Text style={{ fontWeight: 900, fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 12px" }}>
                Doručení
              </Text>
              <Text style={{ fontSize: "13px", lineHeight: "1.8", color: "#474747", margin: 0 }}>
                Dopravce: {carrierLabels[carrier] ?? carrier}<br />
                Adresa: {addressLine1}, {postalCode} {city}
              </Text>
            </Section>

            <Text style={{ fontSize: "13px", color: "#777", lineHeight: "1.6" }}>
              Po přijetí platby vás budeme informovat emailem a odešleme zásilku. Průměrná doba zpracování je 3–5 pracovních dní.
            </Text>
          </Section>

          {/* Footer */}
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
