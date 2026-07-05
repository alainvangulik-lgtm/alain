import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@/generated/prisma/client";
import { ORDER_STATUS_LABELS, statusKleur } from "@/lib/order-status";
import { toEuro } from "@/lib/pricing";

export const metadata = { title: "Admin — Bestellingen" };

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const status = params?.status as OrderStatus | undefined;

  const orders = await prisma.order.findMany({
    where: status ? { status } : undefined,
    include: { user: true },
    orderBy: { aangemaaktOp: "desc" },
  });

  const alleStatussen = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl text-pitch-950">
        ADMIN — BESTELLINGEN
      </h1>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/admin"
          className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
            !status ? "bg-pitch-950 text-chalk" : "bg-pitch-950/10 text-pitch-950"
          }`}
        >
          Alle
        </Link>
        {alleStatussen.map((s) => (
          <Link
            key={s}
            href={`/admin?status=${s}`}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
              status === s ? "bg-pitch-950 text-chalk" : "bg-pitch-950/10 text-pitch-950"
            }`}
          >
            {ORDER_STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-pitch-950/10 bg-white">
        <table className="w-full min-w-[840px] text-left text-sm">
          <thead className="bg-pitch-950/5 text-pitch-950/70">
            <tr>
              <th className="px-4 py-3">Klant</th>
              <th className="px-4 py-3">Schoen</th>
              <th className="px-4 py-3">Maat</th>
              <th className="px-4 py-3">Bedrag</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Datum</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-pitch-950/5">
                <td className="px-4 py-3">
                  <p className="font-medium text-pitch-950">{order.user.naam}</p>
                  <p className="text-xs text-pitch-950/50">{order.user.email}</p>
                </td>
                <td className="px-4 py-3">
                  {order.merk} {order.model}
                  <p className="text-xs text-pitch-950/50">{order.kleur}</p>
                </td>
                <td className="px-4 py-3">{order.maat}</td>
                <td className="px-4 py-3">
                  {toEuro(
                    (order.schoenprijsDefinitief ?? order.schoenprijsIndicatief) +
                      order.servicebedrag
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusKleur(order.status)}`}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-pitch-950/60">
                  {new Intl.DateTimeFormat("nl-NL", { dateStyle: "short" }).format(
                    order.aangemaaktOp
                  )}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/bestellingen/${order.id}`}
                    className="font-semibold text-flare-600 hover:underline"
                  >
                    Beheren
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-pitch-950/50">
                  Geen bestellingen gevonden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
