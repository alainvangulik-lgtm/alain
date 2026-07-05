import Link from "next/link";
import { auth } from "@/auth";
import { BestelFormulier } from "@/components/bestel-formulier";
import { plaatsBestelling } from "./actions";

export const metadata = { title: "Bestellen — Veldkeuze" };

export default async function BestellenPage({
  searchParams,
}: {
  searchParams: Promise<{ maat?: string; fout?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const standaardMaat = params?.maat ? Number(params.maat) : undefined;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl text-pitch-950 sm:text-4xl">
        SCHOEN BESTELLEN
      </h1>
      <p className="mt-2 max-w-2xl text-pitch-950/70">
        Vertel ons welke schoen je zoekt. Na betaling van het onderstaande
        bedrag checken we de beschikbaarheid en bevestigen we je bestelling.
      </p>

      {!session?.user ? (
        <div className="mt-8 rounded-2xl border border-pitch-950/10 bg-white p-8 text-center">
          <p className="text-pitch-950">
            Log in of maak een account aan om een bestelling te plaatsen.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link
              href="/inloggen?callbackUrl=/bestellen"
              className="rounded-full border border-pitch-950/20 px-5 py-2.5 font-semibold text-pitch-950"
            >
              Inloggen
            </Link>
            <Link
              href="/registreren"
              className="rounded-full bg-flare-500 px-5 py-2.5 font-semibold text-white"
            >
              Account aanmaken
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <BestelFormulier
            action={plaatsBestelling}
            standaardMaat={standaardMaat}
            foutmelding={params?.fout}
          />
        </div>
      )}
    </div>
  );
}
