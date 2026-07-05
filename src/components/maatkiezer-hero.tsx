"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const MAAT_MIN = 36;
const MAAT_MAX = 47;
const STAP = 0.5;

export function MaatkiezerHero() {
  const [maat, setMaat] = useState(42);

  const percentage = useMemo(
    () => ((maat - MAAT_MIN) / (MAAT_MAX - MAAT_MIN)) * 100,
    [maat]
  );

  return (
    <div className="relative overflow-hidden rounded-3xl bg-pitch-950 studs-pattern">
      {/* Snelheidsstrepen die de dynamiek van een sprint suggereren */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="speed-streak absolute left-[-20%] top-[18%] h-1 w-2/3 rounded-full bg-flare-500/40" />
        <div className="speed-streak absolute left-[-30%] top-[42%] h-1.5 w-1/2 rounded-full bg-gold-500/30 [animation-delay:0.4s]" />
        <div className="speed-streak absolute left-[-25%] top-[68%] h-1 w-2/5 rounded-full bg-flare-400/30 [animation-delay:0.8s]" />
      </div>

      <div className="relative grid gap-10 px-6 py-14 sm:px-10 sm:py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="inline-flex items-center rounded-full bg-flare-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-flare-400">
            Bestel op verzoek — geen voorraad, wel service
          </p>
          <h1 className="mt-5 font-display text-4xl leading-[1.05] text-chalk sm:text-5xl lg:text-6xl">
            JOUW SCHOEN.
            <br />
            <span className="text-flare-500">ONZE ZOEKTOCHT.</span>
          </h1>
          <p className="mt-5 max-w-md text-base text-chalk-400 sm:text-lg">
            Kies merk, model en maat. Wij checken direct na je bestelling de
            beschikbaarheid bij leveranciers, bestellen de schoen en
            verzorgen de verzending naar jouw voordeur.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/bestellen?maat=${maat}`}
              className="rounded-full bg-flare-500 px-6 py-3 font-semibold text-white shadow-lg shadow-flare-500/20 transition hover:bg-flare-600"
            >
              Start je bestelling — maat {maat}
            </Link>
            <Link
              href="/hoe-het-werkt"
              className="rounded-full border border-chalk/25 px-6 py-3 font-semibold text-chalk transition hover:border-chalk/50"
            >
              Hoe het werkt
            </Link>
          </div>
        </div>

        <div className="relative flex flex-col items-center">
          <BootIllustration maat={maat} />

          <div className="mt-8 w-full max-w-sm">
            <div className="flex items-center justify-between text-sm text-chalk-400">
              <span>Jouw maat (EU)</span>
              <span className="font-display text-2xl text-chalk">{maat}</span>
            </div>
            <input
              type="range"
              min={MAAT_MIN}
              max={MAAT_MAX}
              step={STAP}
              value={maat}
              onChange={(e) => setMaat(Number(e.target.value))}
              className="mt-3 w-full accent-flare-500"
              style={{
                background: `linear-gradient(to right, var(--color-flare-500) ${percentage}%, rgba(245,241,231,0.15) ${percentage}%)`,
              }}
              aria-label="Kies jouw EU-schoenmaat"
            />
            <div className="mt-1 flex justify-between text-xs text-chalk-400/70">
              <span>{MAAT_MIN}</span>
              <span>{MAAT_MAX}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BootIllustration({ maat }: { maat: number }) {
  // De schoen "groeit" licht mee met de gekozen maat en veert bij verandering.
  const schaal = 0.85 + ((maat - MAAT_MIN) / (MAAT_MAX - MAAT_MIN)) * 0.3;

  return (
    <div
      className="relative h-48 w-64 transition-transform duration-300 ease-out sm:h-56 sm:w-72"
      style={{ transform: `scale(${schaal})` }}
    >
      <svg
        viewBox="0 0 260 160"
        className="kick-motion h-full w-full drop-shadow-2xl"
      >
        {/* Zool en studs */}
        <path
          d="M20 132 C 20 120, 40 118, 60 118 L 210 118 C 230 118, 245 126, 248 138 C 250 146, 244 150, 232 150 L 40 150 C 26 150, 20 142, 20 132 Z"
          fill="#0b1410"
        />
        {[45, 75, 105, 135, 165, 195, 220].map((cx) => (
          <circle key={cx} cx={cx} cy={144} r={4.5} fill="#ffb13d" />
        ))}

        {/* Schoenlichaam */}
        <path
          d="M28 128 C 22 96, 34 60, 66 40 C 88 26, 118 20, 146 24 C 176 28, 202 44, 214 70 C 222 88, 224 106, 220 122 L 210 120 C 214 96, 206 74, 188 60 C 200 84, 200 104, 194 120 L 60 122 C 46 122, 34 126, 28 128 Z"
          fill="#ff5a36"
        />
        <path
          d="M66 40 C 88 26, 118 20, 146 24 C 176 28, 202 44, 214 70 C 206 58, 188 46, 164 40 C 132 32, 96 34, 70 50 C 68 47, 67 43, 66 40 Z"
          fill="#c23716"
        />

        {/* Veterpaneel */}
        <path
          d="M78 46 L 168 46 L 176 118 L 70 118 Z"
          fill="#f5f1e7"
          opacity={0.92}
        />
        {[54, 66, 78, 90, 102].map((y, i) => (
          <line
            key={y}
            x1={i % 2 === 0 ? 82 : 168}
            y1={y}
            x2={i % 2 === 0 ? 168 : 82}
            y2={y + 6}
            stroke="#0b1410"
            strokeWidth={3}
            strokeLinecap="round"
          />
        ))}

        {/* Merkstreep */}
        <path
          d="M204 76 C 214 84, 218 96, 214 110"
          stroke="#f5f1e7"
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
