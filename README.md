# Veldkeuze — voetbalschoenen bestel- en serviceplatform

Webapplicatie waarmee klanten een voetbalschoen (merk, model, EU-maat incl.
halve maten, kleur, aantal) op verzoek kunnen laten bestellen. Er is geen
eigen voorraad: na betaling wordt de beschikbaarheid handmatig gecheckt bij
leveranciers, waarna de schoen besteld en verzonden wordt.

## Tech stack

- **Next.js (App Router) + TypeScript**
- **Tailwind CSS v4** (CSS-first theme in `src/app/globals.css`)
- **Prisma ORM** + PostgreSQL (via de `pg` driver-adapter, compatibel met Neon/Supabase)
- **Auth.js (NextAuth v5)** — e-mail/wachtwoord (Credentials) + optioneel Google
- **Mollie API** — iDEAL, aanvullende methodes instelbaar in je Mollie-dashboard
- **Resend** — transactionele e-mails
- Hosting-doel: **Vercel**

## Projectstructuur (belangrijkste onderdelen)

```
prisma/schema.prisma              Database schema (User, Order, StatusHistorie, ...)
src/auth.ts, src/auth.config.ts   Auth.js configuratie (rollen KLANT/ADMIN)
src/middleware.ts                 Route-bescherming voor /dashboard en /admin
src/lib/mollie.ts                 Mollie client + helpers
src/lib/order-service.ts          Statuswijzigingen, refunds, bijbetaal-links
src/lib/email.ts                  Resend e-mailtemplates
src/app/bestellen                 Bestelformulier + server action (Mollie payment)
src/app/api/webhooks/mollie       Mollie webhook (betaalstatus -> orderstatus)
src/app/dashboard                 Klantdashboard met statustijdlijn
src/app/admin                     Admin-dashboard (rol-afgeschermd)
src/app/voorwaarden, /retourbeleid, /privacybeleid   Juridische pagina's (placeholders)
```

## Opstarten (lokale ontwikkeling)

1. **Installeer dependencies**

   ```bash
   npm install
   ```

2. **Maak een `.env` bestand** op basis van `.env.example` en vul in:

   - `DATABASE_URL` — connectiestring van je Neon of Supabase PostgreSQL database
   - `NEXTAUTH_SECRET` — genereer met `npx auth secret`
   - `NEXT_PUBLIC_APP_URL` — `http://localhost:3000` tijdens development
   - `ADMIN_EMAILS` — jouw e-mailadres, komma-gescheiden voor meerdere admins
   - `MOLLIE_API_KEY` — je **test** API-key (begint met `test_`) uit het Mollie-dashboard
   - `RESEND_API_KEY` en `EMAIL_FROM` — optioneel; zonder deze variabelen worden
     e-mails overgeslagen (handig tijdens lokaal testen) in plaats van te falen
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — optioneel, voor Google-login

3. **Database schema toepassen**

   ```bash
   npx prisma migrate dev --name init
   ```

4. **Start de dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

5. **Word admin**: registreer een account met het e-mailadres dat je in
   `ADMIN_EMAILS` hebt gezet. Bij registratie (of de eerste login via Google)
   krijgt dit account automatisch de `ADMIN`-rol en toegang tot `/admin`.

## Mollie: testen en live gaan

- Test eerst volledig in **testmodus** met de `test_...` API-key. Gebruik de
  Mollie test-iDEAL-flow om betaalde, verlopen en geannuleerde betalingen te
  simuleren.
- Voor de webhook (`/api/webhooks/mollie`) heb je tijdens lokale ontwikkeling
  een publiek bereikbare URL nodig (bijv. via een tunnel-tool), of test de
  betaalflow op een Vercel preview-deployment.
- **Overschakelen naar live**: koppel je Mollie-account aan je KVK-nummer en
  bankrekening, en vervang in de productieomgeving (Vercel project settings)
  de env var `MOLLIE_API_KEY` door je `live_...` key. Er is geen code die
  aangepast hoeft te worden — de key bepaalt de modus.
- Controleer voor livegang de checklist onderaan dit document.

## E-mails

`src/lib/email.ts` gebruikt Resend. Zonder `RESEND_API_KEY` worden e-mails
stil overgeslagen (geen crash), zodat je lokaal zonder e-mailconfiguratie kunt
ontwikkelen. E-mails worden verstuurd bij: registratie, elke statuswijziging
van een bestelling, en bij een aanvullende betaallink (prijsverhoging na
beschikbaarheidscheck).

## Deployen op Vercel

1. Push de repository naar GitHub en importeer het project in Vercel.
2. Zet alle variabelen uit `.env.example` in de Vercel project settings.
3. Vercel draait `prisma generate` automatisch via de `postinstall`-hook zodra
   je die toevoegt, of run migraties handmatig via `npx prisma migrate deploy`
   tegen je productie-database vóór de eerste deploy.
4. Stel bij Mollie de webhook-URL in als `https://<jouw-domein>/api/webhooks/mollie`.

## Nog te doen voordat je live gaat

- [ ] Mollie-account koppelen aan je KVK en bankrekening, eerst uitgebreid in testmodus draaien
- [ ] Algemene voorwaarden, retourbeleid en privacybeleid (zie de TODO's op die pagina's) juridisch laten opstellen of controleren — let specifiek op het "bestellen op verzoek"-model versus een gewone voorraad-webshop
- [ ] Nagaan of grootschalige doorverkoop van bepaalde merken conflicteert met exclusiviteits- of distributieafspraken van die merken/retailers
- [ ] KVK-nummer en contactgegevens invullen in de footer en juridische pagina's
- [ ] Analytics-cookies (indien gewenst) daadwerkelijk implementeren en aan de cookiebanner-keuze koppelen
