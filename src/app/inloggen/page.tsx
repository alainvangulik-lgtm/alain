import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export const metadata = { title: "Inloggen — Veldkeuze" };

export default function InloggenPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl text-pitch-950">Inloggen</h1>
      <p className="mt-2 text-sm text-pitch-950/70">
        Log in om je bestellingen en orderstatus te bekijken.
      </p>

      <LoginForm searchParams={searchParams} />

      <p className="mt-6 text-sm text-pitch-950/70">
        Nog geen account?{" "}
        <Link href="/registreren" className="font-semibold text-flare-600 underline">
          Registreer hier
        </Link>
      </p>
    </div>
  );
}

async function LoginForm({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  async function login(formData: FormData) {
    "use server";
    try {
      await signIn("credentials", {
        email: formData.get("email"),
        wachtwoord: formData.get("wachtwoord"),
        redirectTo: "/dashboard",
      });
    } catch (error) {
      if (error instanceof AuthError) {
        redirect("/inloggen?error=credentials");
      }
      throw error;
    }
  }

  return (
    <form action={login} className="mt-8 space-y-4">
      {params?.error && (
        <p className="rounded-lg bg-flare-500/10 px-4 py-3 text-sm text-flare-700">
          Inloggen mislukt. Controleer je e-mailadres en wachtwoord.
        </p>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-pitch-950">
          E-mailadres
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-lg border border-pitch-950/20 px-3 py-2 focus:border-flare-500 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="wachtwoord" className="block text-sm font-medium text-pitch-950">
          Wachtwoord
        </label>
        <input
          id="wachtwoord"
          name="wachtwoord"
          type="password"
          required
          className="mt-1 w-full rounded-lg border border-pitch-950/20 px-3 py-2 focus:border-flare-500 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-full bg-flare-500 px-4 py-2.5 font-semibold text-white transition hover:bg-flare-600"
      >
        Inloggen
      </button>
    </form>
  );
}
