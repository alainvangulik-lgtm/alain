"use client";

import { useMemo, useState } from "react";
import {
  berekenIndicatieveSchoenprijs,
  berekenServicebedrag,
  toEuro,
} from "@/lib/pricing";

const MAAT_OPTIES = Array.from({ length: 23 }, (_, i) => 36 + i * 0.5);
const BEKENDE_MERKEN = [
  "Nike",
  "adidas",
  "Puma",
  "New Balance",
  "Mizuno",
  "Under Armour",
];

export function BestelFormulier({
  action,
  standaardMaat,
  foutmelding,
}: {
  action: (formData: FormData) => void;
  standaardMaat?: number;
  foutmelding?: string;
}) {
  const [aantal, setAantal] = useState(1);
  const [akkoord, setAkkoord] = useState(false);

  const servicebedrag = useMemo(() => berekenServicebedrag(aantal), [aantal]);
  const schoenprijsIndicatief = useMemo(
    () => berekenIndicatieveSchoenprijs(aantal),
    [aantal]
  );
  const totaal = servicebedrag + schoenprijsIndicatief;

  return (
    <form action={action} className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-5 rounded-2xl border border-pitch-950/10 bg-white p-6">
        {foutmelding && (
          <p className="rounded-lg bg-flare-500/10 px-4 py-3 text-sm text-flare-700">
            {foutmelding}
          </p>
        )}

        <div>
          <label htmlFor="merk" className="block text-sm font-medium text-pitch-950">
            Merk
          </label>
          <input
            id="merk"
            name="merk"
            list="merken"
            required
            placeholder="Bijv. Nike"
            className="mt-1 w-full rounded-lg border border-pitch-950/20 px-3 py-2 focus:border-flare-500 focus:outline-none"
          />
          <datalist id="merken">
            {BEKENDE_MERKEN.map((merk) => (
              <option key={merk} value={merk} />
            ))}
          </datalist>
        </div>

        <div>
          <label htmlFor="model" className="block text-sm font-medium text-pitch-950">
            Model
          </label>
          <input
            id="model"
            name="model"
            required
            placeholder="Bijv. Mercurial Vapor 16"
            className="mt-1 w-full rounded-lg border border-pitch-950/20 px-3 py-2 focus:border-flare-500 focus:outline-none"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="maat" className="block text-sm font-medium text-pitch-950">
              EU-maat
            </label>
            <select
              id="maat"
              name="maat"
              required
              defaultValue={standaardMaat ?? 42}
              className="mt-1 w-full rounded-lg border border-pitch-950/20 px-3 py-2 focus:border-flare-500 focus:outline-none"
            >
              {MAAT_OPTIES.map((maat) => (
                <option key={maat} value={maat}>
                  {maat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="kleur" className="block text-sm font-medium text-pitch-950">
              Kleur
            </label>
            <input
              id="kleur"
              name="kleur"
              required
              placeholder="Bijv. zwart/felgeel"
              className="mt-1 w-full rounded-lg border border-pitch-950/20 px-3 py-2 focus:border-flare-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="aantal" className="block text-sm font-medium text-pitch-950">
            Aantal paar
          </label>
          <input
            id="aantal"
            name="aantal"
            type="number"
            min={1}
            max={10}
            required
            value={aantal}
            onChange={(e) => setAantal(Number(e.target.value) || 1)}
            className="mt-1 w-32 rounded-lg border border-pitch-950/20 px-3 py-2 focus:border-flare-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="opmerkingen" className="block text-sm font-medium text-pitch-950">
            Opmerkingen (optioneel)
          </label>
          <textarea
            id="opmerkingen"
            name="opmerkingen"
            rows={3}
            placeholder="Bijv. gewenst kopjes-type of ondergrond (FG, SG, AG, TF)"
            className="mt-1 w-full rounded-lg border border-pitch-950/20 px-3 py-2 focus:border-flare-500 focus:outline-none"
          />
        </div>
      </div>

      <aside className="h-fit rounded-2xl bg-pitch-950 p-6 text-chalk">
        <h2 className="font-display text-xl">ORDEROVERZICHT</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-chalk-400">Servicebedrag</dt>
            <dd>{toEuro(servicebedrag)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-chalk-400">Indicatieve schoenprijs</dt>
            <dd>{toEuro(schoenprijsIndicatief)}</dd>
          </div>
          <div className="mt-2 flex justify-between border-t border-chalk/15 pt-2 font-semibold">
            <dt>Nu te betalen</dt>
            <dd>{toEuro(totaal)}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-chalk-400">
          Prijzen zijn inclusief BTW. De schoenprijs is indicatief: na
          beschikbaarheidscheck bevestigen we het definitieve bedrag. Wijkt
          dit af, dan ontvang je een aparte (bij)betaallink of restitutie.
        </p>

        <div className="mt-5 rounded-xl bg-chalk/10 p-4 text-xs leading-relaxed text-chalk-400">
          <p className="font-semibold text-chalk">Herroepingsrecht</p>
          <p className="mt-1">
            Bij gewone aankopen op afstand geldt 14 dagen bedenktijd. Omdat
            deze schoen speciaal op jouw verzoek wordt besteld, kan dit recht
            beperkt zijn. Dit laten we juridisch bevestigen — zie ons{" "}
            <a href="/retourbeleid" className="underline">
              retourbeleid
            </a>
            .
          </p>
        </div>

        <label className="mt-5 flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            name="akkoordVoorwaarden"
            required
            checked={akkoord}
            onChange={(e) => setAkkoord(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-flare-500"
          />
          <span>
            Ik ga akkoord met de{" "}
            <a href="/voorwaarden" className="underline">
              algemene voorwaarden
            </a>{" "}
            en begrijp dat het definitieve bedrag pas na beschikbaarheidscheck
            wordt bevestigd.
          </span>
        </label>

        <button
          type="submit"
          disabled={!akkoord}
          className="mt-5 w-full rounded-full bg-flare-500 px-4 py-3 font-semibold text-white transition hover:bg-flare-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Ga naar betalen — {toEuro(totaal)}
        </button>
      </aside>
    </form>
  );
}
