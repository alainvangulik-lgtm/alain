import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="studs-pattern bg-pitch-950 text-chalk">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-display text-lg tracking-wide">VELDKEUZE</p>
          <p className="mt-2 max-w-xs text-sm text-chalk-400">
            Wij zoeken en bestellen jouw voetbalschoen op maat bij de
            leverancier. Geen voorraad, wel persoonlijke service.
          </p>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-semibold text-chalk">Informatie</p>
          <ul className="space-y-2 text-chalk-400">
            <li>
              <Link href="/hoe-het-werkt" className="hover:text-flare-400">
                Hoe het werkt
              </Link>
            </li>
            <li>
              <Link href="/voorwaarden" className="hover:text-flare-400">
                Algemene voorwaarden
              </Link>
            </li>
            <li>
              <Link href="/retourbeleid" className="hover:text-flare-400">
                Retour- en herroepingsbeleid
              </Link>
            </li>
            <li>
              <Link href="/privacybeleid" className="hover:text-flare-400">
                Privacybeleid
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-semibold text-chalk">Contact</p>
          <ul className="space-y-2 text-chalk-400">
            <li>KVK: TODO — vul je KVK-nummer in</li>
            <li>E-mail: TODO — vul je contact e-mailadres in</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-chalk/10 px-4 py-4 text-center text-xs text-chalk-400 sm:px-6">
        © {new Date().getFullYear()} Veldkeuze. Alle prijzen zijn inclusief
        BTW.
      </div>
    </footer>
  );
}
