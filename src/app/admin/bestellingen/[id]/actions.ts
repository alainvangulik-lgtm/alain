"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import type { OrderStatus } from "@/generated/prisma/client";
import {
  wijzigOrderStatus,
  zetOrderNietBeschikbaar,
  annuleerOrder,
  pasDefinitiefBedragAan,
} from "@/lib/order-service";
import { prisma } from "@/lib/prisma";

async function vereisAdmin() {
  const session = await auth();
  if (session?.user?.rol !== "ADMIN") {
    throw new Error("Niet geautoriseerd");
  }
}

export async function wijzigStatusActie(orderId: string, formData: FormData) {
  await vereisAdmin();
  const status = formData.get("status") as OrderStatus;
  const toelichting = String(formData.get("toelichting") ?? "") || undefined;

  if (status === "NIET_BESCHIKBAAR") {
    await zetOrderNietBeschikbaar(orderId, toelichting);
  } else if (status === "GEANNULEERD") {
    await annuleerOrder(orderId, toelichting);
  } else {
    await wijzigOrderStatus(orderId, status, toelichting);
  }

  revalidatePath(`/admin/bestellingen/${orderId}`);
  revalidatePath("/admin");
}

export async function bijwerkenTrackingActie(orderId: string, formData: FormData) {
  await vereisAdmin();
  const trackingnummer = String(formData.get("trackingnummer") ?? "") || null;
  const trackingUrl = String(formData.get("trackingUrl") ?? "") || null;

  await prisma.order.update({
    where: { id: orderId },
    data: { trackingnummer, trackingUrl },
  });

  revalidatePath(`/admin/bestellingen/${orderId}`);
}

export async function pasBedragAanActie(orderId: string, formData: FormData) {
  await vereisAdmin();
  const bedragEuro = String(formData.get("schoenprijsDefinitief") ?? "");
  const centen = Math.round(Number(bedragEuro.replace(",", ".")) * 100);

  if (!Number.isFinite(centen) || centen < 0) {
    throw new Error("Ongeldig bedrag");
  }

  await pasDefinitiefBedragAan(orderId, centen);

  revalidatePath(`/admin/bestellingen/${orderId}`);
  revalidatePath("/admin");
}
