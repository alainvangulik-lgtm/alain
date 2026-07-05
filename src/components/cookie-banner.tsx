"use client";

import { useState, useSyncExternalStore } from "react";

const COOKIE_CONSENT_KEY = "veldkeuze-cookie-consent";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(COOKIE_CONSENT_KEY);
}

function getServerSnapshot() {
  return null;
}

export function CookieBanner() {
  const opgeslagenKeuze = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const [gesloten, setGesloten] = useState(false);

  function kies(waarde: "geaccepteerd" | "geweigerd") {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, waarde);
    setGesloten(true);
  }

  if (opgeslagenKeuze || gesloten) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-pitch-950/10 bg-chalk px-4 py-4 shadow-[0_-8px_24px_rgba(11,20,16,0.12)] sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-pitch-950/80">
          We gebruiken alleen functionele cookies om de webshop te laten
          werken, en optioneel analytische cookies om de site te
          verbeteren. Zie ons{" "}
          <a href="/privacybeleid" className="underline">
            privacybeleid
          </a>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => kies("geweigerd")}
            className="rounded-full border border-pitch-950/20 px-4 py-2 text-sm font-semibold text-pitch-950"
          >
            Alleen noodzakelijk
          </button>
          <button
            onClick={() => kies("geaccepteerd")}
            className="rounded-full bg-flare-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Alles accepteren
          </button>
        </div>
      </div>
    </div>
  );
}
