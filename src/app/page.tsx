import Link from "next/link";
import { MaatkiezerHero } from "@/components/maatkiezer-hero";

export default function HomePage() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <MaatkiezerHero />
      </div>

      <section className="mx-auto mt-16 max-w-6xl">
        <h2 className="font-display text-2xl text-pitch-950 sm:text-3xl">
          HOE HET WERKT
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STAPPEN.map((stap, i) => (
            <div
              key={stap.titel}
              className="turf-stripes rounded-2xl border border-pitch-950/10 bg-white p-6"
            >
              <span className="font-display text-3xl text-flare-500">
                0{i + 1}
              </span>
              <h3 className="mt-3 font-semibold text-pitch-950">
                {stap.titel}
              </h3>
              <p className="mt-2 text-sm text-pitch-950/70">{stap.tekst}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl rounded-3xl bg-pitch-800 px-6 py-12 text-chalk sm:px-10">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl">
              GEEN VOORRAAD. WEL ZEKERHEID.
            </h2>
            <p className="mt-4 text-chalk-400">
              Wij houden geen schoenen op de plank liggen. In plaats daarvan
              zoeken we jouw exacte model, maat en kleur bij onze
              leveranciers op het moment dat jij bestelt — zo kun je ook
              schoenen bestellen die net wat lastiger te vinden zijn.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl sm:text-3xl">
              JIJ BETAALT PAS DEFINITIEF NA CHECK
            </h2>
            <p className="mt-4 text-chalk-400">
              Je rekent vooraf een indicatief bedrag af. Blijkt de schoen niet
              beschikbaar? Dan krijg je automatisch een volledige
              terugbetaling. Wijkt de definitieve prijs af? Dan hoor je dat
              eerst van ons.
            </p>
          </div>
        </div>
        <Link
          href="/bestellen"
          className="mt-8 inline-flex rounded-full bg-flare-500 px-6 py-3 font-semibold text-white transition hover:bg-flare-600"
        >
          Bestel jouw schoen
        </Link>
      </section>
    </div>
  );
}

const STAPPEN = [
  {
    titel: "Kies je schoen",
    tekst: "Merk, model, maat (ook halve maten) en kleur — jij bepaalt.",
  },
  {
    titel: "Betaal vooraf",
    tekst: "Reken het servicebedrag en indicatieve schoenprijs af via iDEAL.",
  },
  {
    titel: "Wij checken & bestellen",
    tekst: "We controleren de beschikbaarheid bij leveranciers en bestellen.",
  },
  {
    titel: "Volg & ontvang",
    tekst: "Volg elke statuswijziging in je dashboard tot de schoen bezorgd is.",
  },
];
