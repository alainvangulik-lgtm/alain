import { LegalPage, JuridischeTodo } from "@/components/legal-page";

export const metadata = { title: "Privacybeleid — Veldkeuze" };

export default function PrivacybeleidPage() {
  return (
    <LegalPage titel="Privacybeleid" laatstBijgewerkt="TODO — datum invullen">
      <JuridischeTodo>
        Dit is een placeholdertekst conform de AVG/GDPR. Laat dit beleid
        controleren door een jurist en vul de ontbrekende gegevens in.
      </JuridischeTodo>

      <h2>Wie is verantwoordelijk voor je gegevens</h2>
      <p>
        Veldkeuze, KVK-nummer TODO, is verwerkingsverantwoordelijke voor de
        persoonsgegevens die via deze website worden verzameld.
      </p>

      <h2>Welke gegevens verzamelen we</h2>
      <ul>
        <li>Naam en e-mailadres (account)</li>
        <li>Bestelgegevens: merk, model, maat, kleur, opmerkingen</li>
        <li>Betaalgegevens verwerkt via Mollie (wij slaan geen kaartgegevens op)</li>
        <li>Eventuele analytische cookiegegevens (alleen met jouw toestemming)</li>
      </ul>

      <h2>Waarvoor gebruiken we je gegevens</h2>
      <p>
        Om je bestelling te verwerken, de beschikbaarheid te checken bij
        leveranciers, je op de hoogte te houden van de orderstatus en om aan
        wettelijke (boekhoudkundige) verplichtingen te voldoen.
      </p>

      <h2>Delen met derden</h2>
      <p>
        We delen gegevens met Mollie (betalingen), onze e-mailleverancier
        (transactionele e-mails) en, waar nodig voor het bestellen van de
        schoen, met de betreffende leverancier.
      </p>

      <h2>Bewaartermijn</h2>
      <JuridischeTodo>
        Bepaal en vul de concrete bewaartermijnen in per gegevenscategorie
        (o.a. wettelijke fiscale bewaarplicht van 7 jaar voor administratie).
      </JuridischeTodo>

      <h2>Jouw rechten</h2>
      <p>
        Je hebt recht op inzage, correctie en verwijdering van je
        persoonsgegevens. Neem hiervoor contact op via TODO e-mailadres.
      </p>

      <h2>Cookies</h2>
      <p>
        We gebruiken functionele cookies om de website te laten werken.
        Alleen met jouw toestemming plaatsen we daarnaast analytische
        cookies.
      </p>
    </LegalPage>
  );
}
