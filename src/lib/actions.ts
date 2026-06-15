"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmation } from "@/lib/email";
import type { CartItem } from "@/lib/cart";
import { computeItemPrice, parseEditionId, shippingPrices, isCarrier, isFrame } from "@/lib/pricing";
import { orderToken } from "@/lib/order-token";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/auth/signin");
  }
}

// ── Orders ───────────────────────────────────────────────────

function generatePaymentReference(): string {
  return String(Math.floor(1000000 + Math.random() * 9000000));
}

function generateSerialNumber(count: number, total: number | null): string {
  const padded = String(count).padStart(3, "0");
  return total ? `OT-${padded}/${total}` : `OT-${padded}`;
}

export async function createOrder(
  formData: FormData
): Promise<{ orderId?: string; token?: string; error?: string }> {
  const session = await getServerSession(authOptions);

  const itemsJson = formData.get("items");
  if (!itemsJson) return { error: "Prázdný košík" };

  let items: CartItem[];
  try {
    items = JSON.parse(String(itemsJson));
  } catch {
    return { error: "Neplatná data košíku" };
  }

  if (items.length === 0) return { error: "Košík je prázdný" };

  const paymentReference = generatePaymentReference();

  // Dopravce validujeme proti ceníku — cenu dopravy bere server, ne klient
  const carrierRaw = String(formData.get("carrier") ?? "ZASILKOVNA");
  const carrier = isCarrier(carrierRaw) ? carrierRaw : "ZASILKOVNA";
  const shipping = shippingPrices[carrier];

  try {
    const order = await prisma.$transaction(async (tx) => {
      const companyName = formData.get("companyName") ? String(formData.get("companyName")) : null;
      const ico = formData.get("ico") ? String(formData.get("ico")) : null;
      const dic = formData.get("dic") ? String(formData.get("dic")) : null;

      const newOrder = await tx.order.create({
        data: {
          buyerId: session?.user?.id ?? null,
          email: String(formData.get("email") ?? ""),
          firstName: String(formData.get("firstName") ?? ""),
          lastName: String(formData.get("lastName") ?? ""),
          phone: String(formData.get("phone") ?? ""),
          // Firma
          companyName,
          ico,
          dic,
          // Fakturační adresa
          billingAddressLine1: String(formData.get("billingAddressLine1") ?? ""),
          billingAddressLine2: String(formData.get("billingAddressLine2") ?? ""),
          billingCity: String(formData.get("billingCity") ?? ""),
          billingPostalCode: String(formData.get("billingPostalCode") ?? ""),
          billingCountry: String(formData.get("billingCountry") ?? "CZ"),
          // Dodací adresa
          addressLine1: String(formData.get("addressLine1") ?? ""),
          addressLine2: String(formData.get("addressLine2") ?? ""),
          city: String(formData.get("city") ?? ""),
          postalCode: String(formData.get("postalCode") ?? ""),
          country: String(formData.get("country") ?? "CZ"),
          carrier,
          totalAmount: 0, // dopočítáme serverově níže
          paymentMethod: "BANK_TRANSFER",
          paymentReference,
          pickupPointId: formData.get("pickupPointId") ? String(formData.get("pickupPointId")) : null,
          pickupPointName: formData.get("pickupPointName") ? String(formData.get("pickupPointName")) : null,
          notes: String(formData.get("notes") ?? ""),
        },
      });

      const orderItems = [];
      let itemsTotal = 0;

      for (const item of items) {
        const { id: rawEditionId, format } = parseEditionId(item.editionId);

        // Zámek řádku edice — serializuje souběžné objednávky téže edice
        // (zabraňuje race condition při rezervaci čísla a přeprodeji).
        await tx.$queryRaw`SELECT id FROM "Edition" WHERE id = ${rawEditionId} FOR UPDATE`;

        const edition = await tx.edition.findUnique({ where: { id: rawEditionId } });
        if (!edition) throw new Error("USER:Některé dílo v košíku již není dostupné.");

        // Serverová kontrola dostupnosti
        const now = new Date();
        if (edition.type === "LIMITED_COUNT") {
          if (edition.totalCount == null || edition.soldCount >= edition.totalCount) {
            throw new Error("USER:Edice je vyprodaná.");
          }
        } else if (edition.type === "TIME_WINDOW") {
          if (!edition.availableUntil || edition.availableUntil <= now) {
            throw new Error("USER:Edice je již uzavřená.");
          }
        }

        // Přiřazení pořadového čísla — pod zámkem, validované proti obsazeným
        const takenRows = await tx.orderItem.findMany({
          where: { editionId: rawEditionId },
          select: { certificateNumber: true },
        });
        const taken = new Set(takenRows.map((r) => r.certificateNumber));

        let certificateNumber: number;
        if (edition.type === "LIMITED_COUNT" && edition.totalCount) {
          if (item.requestedNumber != null) {
            if (item.requestedNumber < 1 || item.requestedNumber > edition.totalCount) {
              throw new Error("USER:Neplatné číslo tisku.");
            }
            if (taken.has(item.requestedNumber)) {
              throw new Error(`USER:Číslo ${item.requestedNumber} už není dostupné, vyberte prosím jiné.`);
            }
            certificateNumber = item.requestedNumber;
          } else {
            // nejnižší volné číslo
            let n = 1;
            while (taken.has(n) && n <= edition.totalCount) n++;
            if (n > edition.totalCount) throw new Error("USER:Edice je vyprodaná.");
            certificateNumber = n;
          }
        } else {
          certificateNumber = edition.soldCount + 1;
        }

        // Cena se počítá SERVEROVĚ z ceníku — částka z košíku se ignoruje
        const frame = isFrame(item.frame) ? item.frame : "NONE";
        const serverPrice = computeItemPrice(edition, format, frame);

        await tx.edition.update({
          where: { id: rawEditionId },
          data: { soldCount: { increment: 1 } },
        });

        const orderItem = await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            editionId: rawEditionId,
            price: serverPrice,
            certificateNumber,
          },
        });

        const serialNumber = generateSerialNumber(certificateNumber, edition.totalCount);
        await tx.certificate.create({
          data: {
            orderId: newOrder.id,
            orderItemId: orderItem.id,
            serialNumber,
          },
        });

        itemsTotal += serverPrice;
        orderItems.push({
          photoTitle: item.photoTitle,
          photographerName: item.photographerName,
          price: serverPrice,
          certificateNumber,
          serialNumber,
        });
      }

      const computedTotal = itemsTotal + shipping;
      await tx.order.update({ where: { id: newOrder.id }, data: { totalAmount: computedTotal } });

      return { newOrder, orderItems, computedTotal };
    });

    // Odeslat potvrzení emailem (neblokující)
    try {
      await sendOrderConfirmation(String(formData.get("email") ?? ""), {
        orderNumber: order.newOrder.id.slice(-8).toUpperCase(),
        firstName: String(formData.get("firstName") ?? ""),
        items: order.orderItems,
        totalAmount: order.computedTotal,
        paymentReference,
        carrier,
        addressLine1: String(formData.get("addressLine1") ?? ""),
        city: String(formData.get("city") ?? ""),
        postalCode: String(formData.get("postalCode") ?? ""),
      });
    } catch (emailErr) {
      console.error("Email send failed:", emailErr);
      // Neblokujeme — objednávka je vytvořena
    }

    revalidatePath("/admin/orders");
    return { orderId: order.newOrder.id, token: orderToken(order.newOrder.id) };
  } catch (err) {
    console.error("createOrder error:", err);
    const msg = err instanceof Error ? err.message : "";
    if (msg.startsWith("USER:")) return { error: msg.slice(5) };
    return { error: "Chyba při vytváření objednávky. Zkuste to prosím znovu." };
  }
}

// ── Admin: Order management ───────────────────────────────────

export async function updateOrderStatus(id: string, formData: FormData) {
  await requireAdmin();

  const status = String(formData.get("status") ?? "PENDING_PAYMENT");

  await prisma.order.update({
    where: { id },
    data: { status: status as "PENDING_PAYMENT" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED" },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  redirect(`/admin/orders/${id}?saved=1`);
}

export async function createPacketaShipment(id: string) {
  await requireAdmin();

  const { createPacket, getLabelUrl, getTrackingUrl } = await import("@/lib/packeta");

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { edition: true } } },
  });
  if (!order) return { error: "Objednávka nenalezena" };
  if (order.packetaId) return { error: "Zásilka v Zásilkovně již existuje" };

  const totalValueKc = Math.round(order.totalAmount / 100);

  const result = await createPacket({
    orderNumber: order.id.slice(-8).toUpperCase(),
    firstName: order.firstName,
    lastName: order.lastName,
    email: order.email,
    phone: order.phone || undefined,
    addressId: order.pickupPointId || undefined,
    street: !order.pickupPointId ? order.addressLine1 : undefined,
    city: !order.pickupPointId ? order.city : undefined,
    zip: !order.pickupPointId ? order.postalCode : undefined,
    country: !order.pickupPointId ? order.country : undefined,
    value: totalValueKc,
    weight: 0.5,
    cod: 0,
  });

  if (!result.ok) {
    return { error: result.error };
  }

  const trackingUrl = getTrackingUrl(result.barcode);
  const labelUrl = getLabelUrl(result.barcode);

  await prisma.order.update({
    where: { id },
    data: {
      packetaId: result.barcode,
      trackingNumber: result.barcode,
      status: "PROCESSING",
    },
  });

  revalidatePath(`/admin/orders/${id}`);
  return { ok: true, barcode: result.barcode, trackingUrl, labelUrl };
}

export async function sendShippingEmail(id: string, formData: FormData) {
  await requireAdmin();

  const { sendOrderShipped } = await import("@/lib/email");
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { edition: { include: { photo: { include: { photographer: { include: { user: true } } } } } } } } },
  });
  if (!order) return;

  const trackingNumber = String(formData.get("trackingNumber") ?? "");
  const trackingUrl = String(formData.get("trackingUrl") ?? "") || undefined;

  await sendOrderShipped(order.email, {
    orderNumber: order.id.slice(-8).toUpperCase(),
    firstName: order.firstName,
    carrier: order.carrier,
    trackingNumber,
    trackingUrl,
    items: order.items.map((i) => ({
      photoTitle: i.edition.photo.title,
      photographerName: i.edition.photo.photographer.user.name ?? "Fotograf",
    })),
  });

  await prisma.order.update({ where: { id }, data: { status: "SHIPPED" } });
  revalidatePath(`/admin/orders/${id}`);
  redirect(`/admin/orders/${id}?shipped=1`);
}

// ── Photographers ────────────────────────────────────────────

export async function updatePhotographer(id: string, formData: FormData) {
  await requireAdmin();

  await prisma.photographer.update({
    where: { id },
    data: {
      bio: String(formData.get("bio") ?? ""),
      instagram: String(formData.get("instagram") ?? ""),
      totalSales: parseInt(String(formData.get("totalSales") ?? "0"), 10) || 0,
      user: {
        update: { name: String(formData.get("name") ?? "") },
      },
    },
  });

  revalidatePath("/admin/photographers");
  revalidatePath(`/photographer/${id}`);
  redirect("/admin/photographers?saved=1");
}

// ── Photos ───────────────────────────────────────────────────

export async function createPhoto(formData: FormData) {
  await requireAdmin();

  const photo = await prisma.photo.create({
    data: {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      curatorNote: String(formData.get("curatorNote") ?? ""),
      behindTheLens: String(formData.get("behindTheLens") ?? ""),
      imageUrl: String(formData.get("imageUrl") ?? ""),
      format: (formData.get("format") as "S" | "M" | "L") ?? "M",
      photographerId: String(formData.get("photographerId") ?? ""),
    },
  });

  revalidatePath("/admin/photos");
  redirect(`/admin/photos/${photo.id}?created=1`);
}

export async function updatePhoto(id: string, formData: FormData) {
  await requireAdmin();

  await prisma.photo.update({
    where: { id },
    data: {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      curatorNote: String(formData.get("curatorNote") ?? ""),
      behindTheLens: String(formData.get("behindTheLens") ?? ""),
      imageUrl: String(formData.get("imageUrl") ?? ""),
      format: (formData.get("format") as "S" | "M" | "L") ?? "M",
      photographerId: String(formData.get("photographerId") ?? ""),
    },
  });

  revalidatePath("/admin/photos");
  revalidatePath(`/listing`);
  redirect("/admin/photos?saved=1");
}

export async function deletePhoto(id: string) {
  await requireAdmin();

  await prisma.photo.delete({ where: { id } });

  revalidatePath("/admin/photos");
  redirect("/admin/photos?deleted=1");
}

// ── Editions ─────────────────────────────────────────────────

function parsePriceField(formData: FormData, name: string): number | null {
  const raw = String(formData.get(name) ?? "").trim();
  if (!raw) return null;
  const val = Math.round(parseFloat(raw) * 100);
  return isNaN(val) ? null : val;
}

export async function createEdition(formData: FormData) {
  await requireAdmin();

  const type = formData.get("type") as "LIMITED_COUNT" | "TIME_WINDOW";
  const availableUntilRaw = formData.get("availableUntil");

  await prisma.edition.create({
    data: {
      photoId: String(formData.get("photoId") ?? ""),
      type,
      tier: (formData.get("tier") as "RISING_TALENT" | "SIGNATURE") ?? "RISING_TALENT",
      price: Math.round(parseFloat(String(formData.get("price") ?? "0")) * 100),
      priceS: parsePriceField(formData, "priceS"),
      priceL: parsePriceField(formData, "priceL"),
      totalCount: type === "LIMITED_COUNT" ? (parseInt(String(formData.get("totalCount") ?? "0"), 10) || null) : null,
      soldCount: parseInt(String(formData.get("soldCount") ?? "0"), 10) || 0,
      availableUntil: type === "TIME_WINDOW" && availableUntilRaw
        ? new Date(String(availableUntilRaw))
        : null,
    },
  });

  revalidatePath("/admin/editions");
  revalidatePath("/");
  redirect("/admin/editions?created=1");
}

export async function updateEdition(id: string, formData: FormData) {
  await requireAdmin();

  const type = formData.get("type") as "LIMITED_COUNT" | "TIME_WINDOW";
  const availableUntilRaw = formData.get("availableUntil");

  await prisma.edition.update({
    where: { id },
    data: {
      type,
      tier: (formData.get("tier") as "RISING_TALENT" | "SIGNATURE") ?? "RISING_TALENT",
      price: Math.round(parseFloat(String(formData.get("price") ?? "0")) * 100),
      priceS: parsePriceField(formData, "priceS"),
      priceL: parsePriceField(formData, "priceL"),
      totalCount: type === "LIMITED_COUNT" ? (parseInt(String(formData.get("totalCount") ?? "0"), 10) || null) : null,
      soldCount: parseInt(String(formData.get("soldCount") ?? "0"), 10) || 0,
      availableUntil: type === "TIME_WINDOW" && availableUntilRaw
        ? new Date(String(availableUntilRaw))
        : null,
    },
  });

  revalidatePath("/admin/editions");
  revalidatePath("/");
  redirect("/admin/editions?saved=1");
}

export async function deleteEdition(id: string) {
  await requireAdmin();

  await prisma.edition.delete({ where: { id } });

  revalidatePath("/admin/editions");
  revalidatePath("/");
  redirect("/admin/editions?deleted=1");
}
