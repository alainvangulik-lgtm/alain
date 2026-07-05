"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegistrerenPage() {
  const router = useRouter();
  const [fout, setFout] = useState<string | null>(null);
  const [laden, setLaden] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFout(null);
    setLaden(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      naam: formData.get("naam"),
      email: formData.get("email"),
      wachtwoord: formData.get("wachtwoord"),
    };

    const res = await fetch("/api/registreren", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setFout(data.error ?? "Registreren is mislukt");
      setLaden(false);
      return;
    }

    const result = await signIn("credentials", {
      email: payload.email,
      wachtwoord: payload.wachtwoord,
      redirect: false,
    });

    setLaden(false);

    if (result?.error) {
      setFout("Account aangemaakt, maar inloggen is mislukt. Log handmatig in.");
      router.push("/inloggen");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl text-pitch-950">Account aanmaken</h1>
      <p className="mt-2 text-sm text-pitch-950/70">
        Maak een account om een schoen te bestellen en de status te volgen.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {fout && (
          <p className="rounded-lg bg-flare-500/10 px-4 py-3 text-sm text-flare-700">
            {fout}
          </p>
        )}
        <div>
          <label htmlFor="naam" className="block text-sm font-medium text-pitch-950">
            Naam
          </label>
          <input
            id="naam"
            name="naam"
            type="text"
            required
            className="mt-1 w-full rounded-lg border border-pitch-950/20 px-3 py-2 focus:border-flare-500 focus:outline-none"
          />
        </div>
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
            minLength={8}
            className="mt-1 w-full rounded-lg border border-pitch-950/20 px-3 py-2 focus:border-flare-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={laden}
          className="w-full rounded-full bg-flare-500 px-4 py-2.5 font-semibold text-white transition hover:bg-flare-600 disabled:opacity-60"
        >
          {laden ? "Even geduld..." : "Account aanmaken"}
        </button>
      </form>

      <p className="mt-6 text-sm text-pitch-950/70">
        Heb je al een account?{" "}
        <Link href="/inloggen" className="font-semibold text-flare-600 underline">
          Log hier in
        </Link>
      </p>
    </div>
  );
}
