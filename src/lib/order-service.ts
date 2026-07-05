import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@/generated/prisma/client";
import { verstuurStatusUpdateMail, verstuurBetaallinkMail } from "@/lib/email";
import { getMollieClient, getAppUrl } from "@/lib/mollie";

export async function wijzigOrderStatus(
  orderId: string,
  status: OrderStatus,
  toelichting?: string
) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status,
      statusHistorie: { create: { status, toelichting } },
    },
    include: { user: true },
  });

  await verstuurStatusUpdateMail({
    naar: order.user.email,
    naam: order.user.naam,
    orderId: order.id,
    merk: order.merk,
    model: order.model,
    status,
    trackingnummer: order.trackingnummer,
    trackingUrl: order.trackingUrl,
  });

  return order;
}

async function restitueerVolledigBedrag(order: {
  id: string;
  molliePaymentId: string | null;
  mollieVervolgId: string | null;
}) {
  const mollie = getMollieClient();

  for (const paymentId of [order.molliePaymentId, order.mollieVervolgId]) {
    if (!paymentId) continue;
    const payment = await mollie.payments.get(paymentId);
    if (payment.status === "paid" && payment.amountRemaining !== undefined) {
      const teRestitueren = payment.amountRemaining ?? payment.amount;
      if (Number(teRestitueren.value) > 0) {
        await mollie.paymentRefunds.create({
          paymentId,
          amount: teRestitueren,
          description: `Terugbetaling bestelling ${order.id}`,
        });
      }
    }
  }
}

export async function zetOrderNietBeschikbaar(orderId: string, toelichting?: string) {
  const order = await prisma.order.findUniqueOrThrow({ where: { id: orderId } });
  await restitueerVolledigBedrag(order);
  return wijzigOrderStatus(orderId, "NIET_BESCHIKBAAR", toelichting);
}

export async function annuleerOrder(orderId: string, toelichting?: string) {
  const order = await prisma.order.findUniqueOrThrow({ where: { id: orderId } });
  await restitueerVolledigBedrag(order);
  return wijzigOrderStatus(orderId, "GEANNULEERD", toelichting);
}

export async function pasDefinitiefBedragAan(
  orderId: string,
  nieuweSchoenprijsDefinitiefCenten: number
) {
  const order = await prisma.order.findUniqueOrThrow({
    where: { id: orderId },
    include: { user: true },
  });

  const huidigBevestigdeSchoenprijs =
    order.schoenprijsDefinitief ?? order.schoenprijsIndicatief;
  const verschilCenten =
    nieuweSchoenprijsDefinitiefCenten - huidigBevestigdeSchoenprijs;

  const mollie = getMollieClient();

  if (verschilCenten > 0 && order.molliePaymentId) {
    const appUrl = getAppUrl();
    const vervolgPayment = await mollie.payments.create({
      amount: { currency: "EUR", value: (verschilCenten / 100).toFixed(2) },
      description: `Bijbetaling bestelling ${order.merk} ${order.model} (${order.id})`,
      redirectUrl: `${appUrl}/dashboard/bestellingen/${order.id}`,
      webhookUrl: `${appUrl}/api/webhooks/mollie`,
      metadata: { orderId: order.id },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { mollieVervolgId: vervolgPayment.id },
    });

    const checkoutUrl = vervolgPayment.getCheckoutUrl();
    if (checkoutUrl) {
      await verstuurBetaallinkMail({
        naar: order.user.email,
        naam: order.user.naam,
        orderId: order.id,
        bedragCenten: verschilCenten,
        checkoutUrl,
      });
    }
  } else if (verschilCenten < 0 && order.molliePaymentId) {
    const origineel = await mollie.payments.get(order.molliePaymentId);
    if (origineel.status === "paid") {
      await mollie.paymentRefunds.create({
        paymentId: order.molliePaymentId,
        amount: {
          currency: "EUR",
          value: (Math.abs(verschilCenten) / 100).toFixed(2),
        },
        description: `Deelrestitutie bestelling ${order.id}`,
      });
    }
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { schoenprijsDefinitief: nieuweSchoenprijsDefinitiefCenten },
  });
}
