"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/auth/signin");
  }
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
