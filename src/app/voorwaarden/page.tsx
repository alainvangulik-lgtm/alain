import { LegalPage, JuridischeTodo } from "@/components/legal-page";

export const metadata = { title: "Algemene voorwaarden — Veldkeuze" };

export default function VoorwaardenPage() {
  return (
    <LegalPage titel="Algemene voorwaarden" laatstBijgewerkt="TODO — datum invullen">
      <JuridischeTodo>
        Dit is een placeholdertekst. Laat deze algemene voorwaarden opstellen
        of controleren door een jurist voordat je live gaat, specifiek gericht
        op het &ldquo;bestellen op verzoek&rdquo;-model (geen eigen voorraad).
      </JuridischeTodo>

      <h2>1. Wie zijn wij</h2>
      <p>
        Veldkeuze (hierna: &ldquo;wij&rdquo;) is een bestel-en-service-platform voor
        voetbalschoenen. KVK-nummer: TODO. Vestigingsadres: TODO.
      </p>

      <h2>2. Ons bestelmodel</h2>
      <p>
        Wij houden geen eigen voorraad. Wanneer je een bestelling plaatst,
        controleren wij na ontvangst van je (aan)betaling de beschikbaarheid
        van de gewenste schoen bij onze leveranciers, bestellen wij deze en
        verzorgen wij de verzending naar jou.
      </p>

      <h2>3. Prijzen en betaling</h2>
      <p>
        Alle vermelde prijzen zijn inclusief BTW. Bij het plaatsen van een
        bestelling betaal je een servicebedrag en een indicatieve
        schoenprijs. Het definitieve bedrag wordt vastgesteld na de
        beschikbaarheidscheck. Wijkt dit af van het reeds betaalde bedrag,
        dan ontvang je een aanvullende betaallink (bij een hoger bedrag) of
        een terugbetaling (bij een lager bedrag).
      </p>

      <h2>4. Niet beschikbaar of geannuleerd</h2>
      <p>
        Is de gewenste schoen niet beschikbaar bij onze leveranciers, of
        annuleren wij de bestelling, dan ontvang je het volledige betaalde
        bedrag automatisch retour via Mollie.
      </p>

      <h2>5. Herroepingsrecht</h2>
      <JuridischeTodo>
        Bepaal juridisch in hoeverre het wettelijke herroepingsrecht van 14
        dagen van toepassing is op schoenen die specifiek op verzoek van de
        klant worden ingekocht (mogelijk maatwerk-uitzondering, art. 6:230p
        BW). Zie ook ons retourbeleid.
      </JuridischeTodo>

      <h2>6. Aansprakelijkheid</h2>
      <JuridischeTodo>
        Vul aansprakelijkheidsbepalingen in, o.a. voor leveringstermijnen die
        afhankelijk zijn van derde leveranciers.
      </JuridischeTodo>

      <h2>7. Contact en klachten</h2>
      <p>E-mail: TODO. Telefoon: TODO.</p>
    </LegalPage>
  );
}
