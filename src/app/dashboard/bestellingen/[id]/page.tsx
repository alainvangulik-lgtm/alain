import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_BESCHRIJVING,
  statusKleur,
} from "@/lib/order-status";
import { toEuro } from "@/lib/pricing";

export default async function BestellingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) return null;

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { statusHistorie: { orderBy: { tijdstip: "asc" } } },
  });

  if (!order || order.userId !== session.user.id) notFound();

  const totaal =
    (order.schoenprijsDefinitief ?? order.schoenprijsIndicatief) +
    order.servicebedrag;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-pitch-950">
            {order.merk} {order.model}
          </h1>
          <p className="mt-1 text-pitch-950/60">
            Maat {order.maat} · {order.kleur} · {order.aantal} paar
          </p>
        </div>
        <span
          className={`rounded-full px-4 py-2 text-sm font-semibold ${statusKleur(order.status)}`}
        >
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      <p className="mt-3 max-w-xl text-sm text-pitch-950/70">
        {ORDER_STATUS_BESCHRIJVING[order.status]}
      </p>

      {order.trackingnummer && (
        <div className="mt-4 rounded-xl bg-gold-500/15 px-4 py-3 text-sm text-pitch-950">
          Trackingnummer: <strong>{order.trackingnummer}</strong>
          {order.trackingUrl && (
            <>
              {" — "}
              <a href={order.trackingUrl} className="underline" target="_blank" rel="noreferrer">
                volg je pakket
              </a>
            </>
          )}
        </div>
      )}

      <div className="mt-8 grid gap-8 sm:grid-cols-[1fr_1.2fr]">
        <div className="rounded-2xl border border-pitch-950/10 bg-white p-6">
          <h2 className="font-semibold text-pitch-950">Bedrag</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-pitch-950/60">Servicebedrag</dt>
              <dd>{toEuro(order.servicebedrag)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-pitch-950/60">
                Schoenprijs {order.schoenprijsDefinitief ? "(definitief)" : "(indicatief)"}
              </dt>
              <dd>
                {toEuro(order.schoenprijsDefinitief ?? order.schoenprijsIndicatief)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-pitch-950/10 pt-2 font-semibold">
              <dt>Totaal</dt>
              <dd>{toEuro(totaal)}</dd>
            </div>
          </dl>
          {order.opmerkingen && (
            <>
              <h2 className="mt-6 font-semibold text-pitch-950">Opmerkingen</h2>
              <p className="mt-2 text-sm text-pitch-950/70">{order.opmerkingen}</p>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-pitch-950/10 bg-white p-6">
          <h2 className="font-semibold text-pitch-950">Tijdlijn</h2>
          <ol className="mt-4 space-y-4 border-l border-pitch-950/10 pl-4">
            {order.statusHistorie.map((entry) => (
              <li key={entry.id} className="relative">
                <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-flare-500" />
                <p className="text-sm font-semibold text-pitch-950">
                  {ORDER_STATUS_LABELS[entry.status]}
                </p>
                <p className="text-xs text-pitch-950/50">
                  {new Intl.DateTimeFormat("nl-NL", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(entry.tijdstip)}
                </p>
                {entry.toelichting && (
                  <p className="mt-1 text-sm text-pitch-950/70">{entry.toelichting}</p>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
