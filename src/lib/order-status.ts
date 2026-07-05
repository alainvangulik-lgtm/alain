import type { OrderStatus } from "@/generated/prisma/client";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  WACHTEND_OP_BETALING: "Wachtend op betaling",
  WACHTEND_OP_BEVESTIGING: "Wachtend op bevestiging",
  BEVESTIGD: "Beschikbaarheid gecheckt, bevestigd",
  NIET_BESCHIKBAAR: "Niet beschikbaar",
  BESTELD_BIJ_LEVERANCIER: "Besteld bij leverancier",
  ONDERWEG: "Onderweg",
  GELEVERD: "Geleverd",
  GEANNULEERD: "Geannuleerd",
};

export const ORDER_STATUS_BESCHRIJVING: Record<OrderStatus, string> = {
  WACHTEND_OP_BETALING: "We wachten op je betaling via Mollie.",
  WACHTEND_OP_BEVESTIGING:
    "Betaling ontvangen. We checken de beschikbaarheid bij onze leveranciers.",
  BEVESTIGD:
    "De schoen is beschikbaar bevestigd en wordt binnenkort besteld.",
  NIET_BESCHIKBAAR:
    "Helaas niet beschikbaar bij onze leveranciers. Je betaling is (of wordt) automatisch teruggestort.",
  BESTELD_BIJ_LEVERANCIER: "De schoen is besteld bij de leverancier.",
  ONDERWEG: "Je schoen is onderweg naar jou.",
  GELEVERD: "Je schoen is geleverd. Speel ze in!",
  GEANNULEERD: "Deze bestelling is geannuleerd.",
};

export const KLANT_ZICHTBARE_STATUSSEN: OrderStatus[] = [
  "WACHTEND_OP_BETALING",
  "WACHTEND_OP_BEVESTIGING",
  "BEVESTIGD",
  "NIET_BESCHIKBAAR",
  "BESTELD_BIJ_LEVERANCIER",
  "ONDERWEG",
  "GELEVERD",
  "GEANNULEERD",
];

export function statusKleur(status: OrderStatus): string {
  switch (status) {
    case "GELEVERD":
    case "BEVESTIGD":
      return "bg-pitch-600 text-chalk";
    case "NIET_BESCHIKBAAR":
    case "GEANNULEERD":
      return "bg-flare-600 text-white";
    case "ONDERWEG":
    case "BESTELD_BIJ_LEVERANCIER":
      return "bg-gold-500 text-pitch-950";
    default:
      return "bg-pitch-950/10 text-pitch-950";
  }
}
