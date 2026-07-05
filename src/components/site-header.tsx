import Link from "next/link";
import { auth, signOut } from "@/auth";

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 border-b border-pitch-950/10 bg-chalk/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-pitch-950 text-chalk">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M12 2 3 8.5 6 20h12l3-11.5L12 2Zm0 3.2 5.7 4.1-2.2 3.9H8.5l-2.2-3.9L12 5.2Z" />
            </svg>
          </span>
          <span className="font-display text-xl tracking-wide text-pitch-950">
            VELDKEUZE
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-pitch-950/80 sm:flex">
          <Link href="/bestellen" className="hover:text-flare-600">
            Bestellen
          </Link>
          <Link href="/hoe-het-werkt" className="hover:text-flare-600">
            Hoe het werkt
          </Link>
          {session?.user?.rol === "ADMIN" && (
            <Link href="/admin" className="hover:text-flare-600">
              Admin
            </Link>
          )}
          {session?.user && (
            <Link href="/dashboard" className="hover:text-flare-600">
              Mijn bestellingen
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="rounded-full border border-pitch-950/20 px-4 py-2 text-sm font-semibold text-pitch-950 transition hover:border-pitch-950/40"
              >
                Uitloggen
              </button>
            </form>
          ) : (
            <Link
              href="/inloggen"
              className="rounded-full border border-pitch-950/20 px-4 py-2 text-sm font-semibold text-pitch-950 transition hover:border-pitch-950/40"
            >
              Inloggen
            </Link>
          )}
          <Link
            href="/bestellen"
            className="rounded-full bg-flare-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-flare-600"
          >
            Schoen bestellen
          </Link>
        </div>
      </div>
    </header>
  );
}
