import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getMollieClient } from "@/lib/mollie";
import { wijzigOrderStatus } from "@/lib/order-service";

// Mollie stuurt bij elke betaalstatuswijziging een POST met form-encoded body: id=tr_xxx
export async function POST(request: Request) {
  const body = await request.text();
  const params = new URLSearchParams(body);
  const paymentId = params.get("id");

  if (!paymentId) {
    return NextResponse.json({ error: "Geen payment id" }, { status: 400 });
  }

  const mollie = getMollieClient();
  const payment = await mollie.payments.get(paymentId);

  const orderId = payment.metadata
    ? (payment.metadata as { orderId?: string }).orderId
    : undefined;

  const order = orderId
    ? await prisma.order.findUnique({ where: { id: orderId } })
    : await prisma.order.findFirst({
        where: {
          OR: [{ molliePaymentId: paymentId }, { mollieVervolgId: paymentId }],
        },
      });

  if (!order) {
    return NextResponse.json({ error: "Order niet gevonden" }, { status: 404 });
  }

  const isVervolgbetaling = order.mollieVervolgId === paymentId;

  if (payment.status === "paid") {
    if (isVervolgbetaling) {
      // Bijbetaling voor prijsverhoging is ontvangen; orderstatus blijft ongewijzigd.
      return NextResponse.json({ ok: true });
    }
    if (order.status === "WACHTEND_OP_BETALING") {
      await wijzigOrderStatus(order.id, "WACHTEND_OP_BEVESTIGING");
    }
  } else if (
    ["expired", "canceled", "failed"].includes(payment.status) &&
    !isVervolgbetaling &&
    order.status === "WACHTEND_OP_BETALING"
  ) {
    await wijzigOrderStatus(
      order.id,
      "GEANNULEERD",
      "Betaling is niet voltooid (verlopen, geannuleerd of mislukt)."
    );
  }

  return NextResponse.json({ ok: true });
}
