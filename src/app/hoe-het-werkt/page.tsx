import Link from "next/link";

export const metadata = { title: "Hoe het werkt — Veldkeuze" };

const STAPPEN = [
  {
    titel: "1. Kies je schoen",
    tekst:
      "Vul merk, model, EU-maat (ook halve maten), kleur en het gewenste aantal paar in. Heb je een voorkeur voor kopjes of ondergrond? Zet het in de opmerkingen.",
  },
  {
    titel: "2. Bekijk het orderoverzicht",
    tekst:
      "Je ziet direct het servicebedrag en een indicatieve schoenprijs, inclusief BTW. Je gaat akkoord met de voorwaarde dat het definitieve bedrag pas na de beschikbaarheidscheck wordt bevestigd.",
  },
  {
    titel: "3. Betaal veilig via Mollie",
    tekst:
      "Reken vooraf af via iDEAL (of een andere ondersteunde betaalmethode). Zodra de betaling binnen is, gaan wij voor je aan de slag.",
  },
  {
    titel: "4. Wij checken de beschikbaarheid",
    tekst:
      "We nemen contact op met onze leveranciers om te controleren of de schoen in de gewenste maat en kleur beschikbaar is.",
  },
  {
    titel: "5. Bevestiging of terugbetaling",
    tekst:
      "Is de schoen beschikbaar? Dan bevestigen we je bestelling en gaan we bestellen. Is dat niet zo? Dan krijg je automatisch je geld terug.",
  },
  {
    titel: "6. Bestelling, verzending, levering",
    tekst:
      "Je volgt elke stap in je persoonlijke dashboard: besteld bij leverancier, onderweg (met trackingnummer) en geleverd.",
  },
];

export default function HoeHetWerktPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl text-pitch-950 sm:text-4xl">
        HOE HET WERKT
      </h1>
      <p className="mt-3 max-w-2xl text-pitch-950/70">
        Veldkeuze is geen webshop met eigen voorraad, maar een
        bestel-en-service-platform: jij vertelt ons welke voetbalschoen je
        zoekt, wij regelen de rest.
      </p>

      <ol className="mt-10 space-y-6">
        {STAPPEN.map((stap) => (
          <li
            key={stap.titel}
            className="rounded-2xl border border-pitch-950/10 bg-white p-6"
          >
            <h2 className="font-display text-lg text-pitch-950">
              {stap.titel}
            </h2>
            <p className="mt-2 text-sm text-pitch-950/70">{stap.tekst}</p>
          </li>
        ))}
      </ol>

      <Link
        href="/bestellen"
        className="mt-10 inline-flex rounded-full bg-flare-500 px-6 py-3 font-semibold text-white transition hover:bg-flare-600"
      >
        Start je bestelling
      </Link>
    </div>
  );
}
