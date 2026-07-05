import { LegalPage, JuridischeTodo } from "@/components/legal-page";

export const metadata = { title: "Retour- en herroepingsbeleid — Veldkeuze" };

export default function RetourbeleidPage() {
  return (
    <LegalPage
      titel="Retour- en herroepingsbeleid"
      laatstBijgewerkt="TODO — datum invullen"
    >
      <JuridischeTodo>
        Dit is een placeholdertekst. Laat dit beleid juridisch controleren.
        Bestellingen op verzoek (custom sourcing) kunnen wettelijk anders
        behandeld worden dan reguliere webshopaankopen uit voorraad — check
        dit specifiek voor jouw situatie.
      </JuridischeTodo>

      <h2>Herroepingsrecht (bedenktijd)</h2>
      <p>
        Bij een gewone aankoop op afstand heb je als consument 14 dagen
        bedenktijd na ontvangst van het product, waarbinnen je de koop
        zonder opgave van redenen kunt herroepen.
      </p>
      <JuridischeTodo>
        Omdat wij schoenen op specifiek verzoek van de klant bij een
        leverancier bestellen (merk, model, maat, kleur — mogelijk zelfs op
        aanvraag lastig verkrijgbare varianten), kan dit kwalificeren als een
        product dat &ldquo;volgens specificaties van de consument is
        vervaardigd&rdquo;, waarop het herroepingsrecht mogelijk niet van
        toepassing is. Laat dit juridisch beoordelen en pas deze tekst aan
        voordat je live gaat.
      </JuridischeTodo>

      <h2>Betaling vooraf en terugbetaling</h2>
      <p>
        Je betaalt vooraf een servicebedrag en een indicatieve schoenprijs.
        Als de schoen niet beschikbaar blijkt te zijn bij onze leveranciers,
        of als wij de bestelling annuleren, ontvang je het volledige bedrag
        automatisch terug via Mollie op de rekening waarmee je hebt betaald.
      </p>

      <h2>Retourneren na levering</h2>
      <JuridischeTodo>
        Beschrijf hier het beleid voor retourneren na levering (bijv. bij
        transportschade of een verkeerd geleverd product) en wie de
        retourkosten draagt.
      </JuridischeTodo>

      <h2>Contact</h2>
      <p>
        Vragen over een retour of terugbetaling? Neem contact op via TODO
        e-mailadres.
      </p>
    </LegalPage>
  );
}
