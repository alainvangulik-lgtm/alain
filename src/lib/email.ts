import { Resend } from "resend";
import type { OrderStatus } from "@/generated/prisma/client";
import { ORDER_STATUS_LABELS, ORDER_STATUS_BESCHRIJVING } from "@/lib/order-status";
import { getAppUrl } from "@/lib/mollie";

let resend: Resend | null = null;

function getResendClient() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

const AFZENDER = process.env.EMAIL_FROM ?? "Veldkeuze <bestellingen@voorbeeld.nl>";

export async function verstuurWelkomstmail(naar: string, naam: string) {
  const client = getResendClient();
  if (!client) return;

  await client.emails.send({
    from: AFZENDER,
    to: naar,
    subject: "Welkom bij Veldkeuze",
    html: `
      <p>Hoi ${escapeHtml(naam)},</p>
      <p>Je account is aangemaakt. Je kunt nu een voetbalschoen op maat bestellen via Veldkeuze.</p>
      <p><a href="${getAppUrl()}/bestellen">Start je bestelling</a></p>
    `,
  });
}

export async function verstuurStatusUpdateMail(params: {
  naar: string;
  naam: string;
  orderId: string;
  merk: string;
  model: string;
  status: OrderStatus;
  trackingnummer?: string | null;
  trackingUrl?: string | null;
}) {
  const client = getResendClient();
  if (!client) return;

  const { naar, naam, orderId, merk, model, status, trackingnummer, trackingUrl } = params;
  const label = ORDER_STATUS_LABELS[status];
  const beschrijving = ORDER_STATUS_BESCHRIJVING[status];
  const dashboardUrl = `${getAppUrl()}/dashboard/bestellingen/${orderId}`;

  await client.emails.send({
    from: AFZENDER,
    to: naar,
    subject: `Update over je bestelling: ${label}`,
    html: `
      <p>Hoi ${escapeHtml(naam)},</p>
      <p>De status van je bestelling <strong>${escapeHtml(merk)} ${escapeHtml(model)}</strong> (${orderId}) is gewijzigd naar:</p>
      <p style="font-size:18px;font-weight:bold;">${escapeHtml(label)}</p>
      <p>${escapeHtml(beschrijving)}</p>
      ${
        trackingnummer
          ? `<p>Trackingnummer: <strong>${escapeHtml(trackingnummer)}</strong>${
              trackingUrl ? ` — <a href="${escapeHtml(trackingUrl)}">volg je pakket</a>` : ""
            }</p>`
          : ""
      }
      <p><a href="${dashboardUrl}">Bekijk je bestelling</a></p>
    `,
  });
}

export async function verstuurBetaallinkMail(params: {
  naar: string;
  naam: string;
  orderId: string;
  bedragCenten: number;
  checkoutUrl: string;
}) {
  const client = getResendClient();
  if (!client) return;

  const { naar, naam, orderId, bedragCenten, checkoutUrl } = params;
  const bedrag = new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(bedragCenten / 100);

  await client.emails.send({
    from: AFZENDER,
    to: naar,
    subject: "Aanvullende betaling voor je bestelling",
    html: `
      <p>Hoi ${escapeHtml(naam)},</p>
      <p>De definitieve schoenprijs van je bestelling (${orderId}) ligt hoger dan het bedrag dat je al hebt betaald.</p>
      <p>Openstaand bedrag: <strong>${bedrag}</strong></p>
      <p><a href="${escapeHtml(checkoutUrl)}">Betaal het verschil veilig via Mollie</a></p>
    `,
  });
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
