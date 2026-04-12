import { Resend } from "resend";
import { render } from "@react-email/components";
import OrderConfirmation, { OrderConfirmationProps } from "@/emails/OrderConfirmation";
import PaymentConfirmed, { PaymentConfirmedProps } from "@/emails/PaymentConfirmed";
import OrderShipped, { OrderShippedProps } from "@/emails/OrderShipped";

const FROM = "Limited Exposure <objednavky@limitedexposure.cz>";

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY není nastavena");
  }
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendOrderConfirmation(to: string, props: OrderConfirmationProps) {
  const html = await render(OrderConfirmation(props));
  return getResend().emails.send({
    from: FROM,
    to,
    subject: `Objednávka #${props.orderNumber} přijata — čekáme na platbu`,
    html,
  });
}

export async function sendPaymentConfirmed(to: string, props: PaymentConfirmedProps) {
  const html = await render(PaymentConfirmed(props));
  return getResend().emails.send({
    from: FROM,
    to,
    subject: `Platba potvrzena — vaše díla se tisknou`,
    html,
  });
}

export async function sendOrderShipped(to: string, props: OrderShippedProps) {
  const html = await render(OrderShipped(props));
  return getResend().emails.send({
    from: FROM,
    to,
    subject: `Zásilka odeslána — sledovací číslo ${props.trackingNumber}`,
    html,
  });
}
