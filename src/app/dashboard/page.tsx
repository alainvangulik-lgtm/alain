import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUS_LABELS, statusKleur } from "@/lib/order-status";
import { toEuro } from "@/lib/pricing";

export const metadata = { title: "Mijn bestellingen — Veldkeuze" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) return null;

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { aangemaaktOp: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-pitch-950">
          MIJN BESTELLINGEN
        </h1>
        <Link
          href="/bestellen"
          className="rounded-full bg-flare-500 px-4 py-2 text-sm font-semibold text-white"
        >
          Nieuwe bestelling
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="mt-8 text-pitch-950/70">
          Je hebt nog geen bestellingen geplaatst.
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/dashboard/bestellingen/${order.id}`}
                className="flex flex-col gap-2 rounded-2xl border border-pitch-950/10 bg-white p-5 transition hover:border-flare-500/50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-pitch-950">
                    {order.merk} {order.model}
                  </p>
                  <p className="text-sm text-pitch-950/60">
                    Maat {order.maat} · {order.kleur} · {order.aantal}{" "}
                    paar
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-pitch-950/70">
                    {toEuro(
                      (order.schoenprijsDefinitief ??
                        order.schoenprijsIndicatief) + order.servicebedrag
                    )}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusKleur(order.status)}`}
                  >
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
