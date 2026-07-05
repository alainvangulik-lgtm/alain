import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@/generated/prisma/client";
import { ORDER_STATUS_LABELS, statusKleur } from "@/lib/order-status";
import { toEuro } from "@/lib/pricing";
import {
  wijzigStatusActie,
  bijwerkenTrackingActie,
  pasBedragAanActie,
} from "./actions";

export default async function AdminBestellingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { user: true, statusHistorie: { orderBy: { tijdstip: "desc" } } },
  });

  if (!order) notFound();

  const alleStatussen = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[];
  const huidigBedragEuro = (
    (order.schoenprijsDefinitief ?? order.schoenprijsIndicatief) / 100
  ).toFixed(2);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-pitch-950">
            {order.merk} {order.model}
          </h1>
          <p className="mt-1 text-pitch-950/60">
            {order.user.naam} · {order.user.email}
          </p>
          <p className="mt-1 text-sm text-pitch-950/60">
            Maat {order.maat} · {order.kleur} · {order.aantal} paar
          </p>
        </div>
        <span className={`rounded-full px-4 py-2 text-sm font-semibold ${statusKleur(order.status)}`}>
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      {order.opmerkingen && (
        <p className="mt-4 rounded-xl bg-pitch-950/5 px-4 py-3 text-sm text-pitch-950/80">
          Opmerking klant: {order.opmerkingen}
        </p>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <form
          action={wijzigStatusActie.bind(null, order.id)}
          className="rounded-2xl border border-pitch-950/10 bg-white p-6"
        >
          <h2 className="font-semibold text-pitch-950">Status wijzigen</h2>
          <p className="mt-1 text-xs text-pitch-950/50">
            &ldquo;Niet beschikbaar&rdquo; en &ldquo;Geannuleerd&rdquo; starten automatisch
            een volledige terugbetaling via Mollie.
          </p>
          <select
            name="status"
            defaultValue={order.status}
            className="mt-3 w-full rounded-lg border border-pitch-950/20 px-3 py-2"
          >
            {alleStatussen.map((s) => (
              <option key={s} value={s}>
                {ORDER_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          <textarea
            name="toelichting"
            rows={2}
            placeholder="Optionele toelichting voor de klant"
            className="mt-3 w-full rounded-lg border border-pitch-950/20 px-3 py-2"
          />
          <button
            type="submit"
            className="mt-3 rounded-full bg-flare-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Status opslaan
          </button>
        </form>

        <form
          action={bijwerkenTrackingActie.bind(null, order.id)}
          className="rounded-2xl border border-pitch-950/10 bg-white p-6"
        >
          <h2 className="font-semibold text-pitch-950">Verzending</h2>
          <label className="mt-3 block text-sm text-pitch-950/70">Trackingnummer</label>
          <input
            name="trackingnummer"
            defaultValue={order.trackingnummer ?? ""}
            className="mt-1 w-full rounded-lg border border-pitch-950/20 px-3 py-2"
          />
          <label className="mt-3 block text-sm text-pitch-950/70">Trackinglink</label>
          <input
            name="trackingUrl"
            defaultValue={order.trackingUrl ?? ""}
            placeholder="https://..."
            className="mt-1 w-full rounded-lg border border-pitch-950/20 px-3 py-2"
          />
          <button
            type="submit"
            className="mt-3 rounded-full bg-flare-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Opslaan
          </button>
        </form>

        <form
          action={pasBedragAanActie.bind(null, order.id)}
          className="rounded-2xl border border-pitch-950/10 bg-white p-6 sm:col-span-2"
        >
          <h2 className="font-semibold text-pitch-950">Definitief schoenbedrag</h2>
          <p className="mt-1 text-xs text-pitch-950/50">
            Servicebedrag ({toEuro(order.servicebedrag)}) blijft ongewijzigd. Wijkt
            het nieuwe bedrag af van wat al betaald is, dan stuurt Veldkeuze
            automatisch een bijbetaallink of gedeeltelijke restitutie via Mollie.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-sm text-pitch-950/70">Indicatief was: {toEuro(order.schoenprijsIndicatief)}</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-pitch-950">€</span>
            <input
              name="schoenprijsDefinitief"
              defaultValue={huidigBedragEuro}
              className="w-40 rounded-lg border border-pitch-950/20 px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="mt-3 rounded-full bg-pitch-950 px-4 py-2 text-sm font-semibold text-chalk"
          >
            Definitief bedrag vastleggen
          </button>
        </form>
      </div>

      <div className="mt-8 rounded-2xl border border-pitch-950/10 bg-white p-6">
        <h2 className="font-semibold text-pitch-950">Statushistorie</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {order.statusHistorie.map((entry) => (
            <li key={entry.id} className="flex justify-between border-b border-pitch-950/5 pb-2">
              <span>{ORDER_STATUS_LABELS[entry.status]}</span>
              <span className="text-pitch-950/50">
                {new Intl.DateTimeFormat("nl-NL", {
                  dateStyle: "short",
                  timeStyle: "short",
                }).format(entry.tijdstip)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
