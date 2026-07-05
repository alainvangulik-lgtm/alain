"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { bestelSchema } from "@/lib/validation";
import {
  berekenIndicatieveSchoenprijs,
  berekenServicebedrag,
} from "@/lib/pricing";
import { getMollieClient, getAppUrl } from "@/lib/mollie";

export async function plaatsBestelling(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    redirect("/inloggen?callbackUrl=/bestellen");
  }

  const raw = {
    merk: String(formData.get("merk") ?? ""),
    model: String(formData.get("model") ?? ""),
    maat: Number(formData.get("maat")),
    kleur: String(formData.get("kleur") ?? ""),
    aantal: Number(formData.get("aantal") ?? 1),
    opmerkingen: String(formData.get("opmerkingen") ?? ""),
    akkoordVoorwaarden: formData.get("akkoordVoorwaarden") === "on",
  };

  const parsed = bestelSchema.safeParse(raw);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Ongeldige invoer";
    redirect(`/bestellen?fout=${encodeURIComponent(message)}`);
  }

  const data = parsed.data;
  const servicebedrag = berekenServicebedrag(data.aantal);
  const schoenprijsIndicatief = berekenIndicatieveSchoenprijs(data.aantal);
  const totaalCenten = servicebedrag + schoenprijsIndicatief;

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      merk: data.merk,
      model: data.model,
      maat: data.maat,
      kleur: data.kleur,
      aantal: data.aantal,
      opmerkingen: data.opmerkingen || null,
      servicebedrag,
      schoenprijsIndicatief,
      akkoordVoorwaarden: data.akkoordVoorwaarden,
      statusHistorie: {
        create: { status: "WACHTEND_OP_BETALING" },
      },
    },
  });

  const appUrl = getAppUrl();
  let checkoutUrl: string | null;

  try {
    const mollie = getMollieClient();
    const payment = await mollie.payments.create({
      amount: {
        currency: "EUR",
        value: (totaalCenten / 100).toFixed(2),
      },
      description: `Bestelling ${data.merk} ${data.model} — maat ${data.maat} (${order.id})`,
      redirectUrl: `${appUrl}/dashboard/bestellingen/${order.id}`,
      webhookUrl: `${appUrl}/api/webhooks/mollie`,
      metadata: { orderId: order.id },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { molliePaymentId: payment.id },
    });

    checkoutUrl = payment.getCheckoutUrl();
  } catch (error) {
    console.error("Mollie betaling aanmaken is mislukt:", error);
    await prisma.order.delete({ where: { id: order.id } });
    redirect(
      `/bestellen?fout=${encodeURIComponent(
        "Betalen is momenteel niet mogelijk. Probeer het later opnieuw."
      )}`
    );
  }

  redirect(checkoutUrl ?? `/dashboard/bestellingen/${order.id}`);
}
