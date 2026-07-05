export function LegalPage({
  titel,
  laatstBijgewerkt,
  children,
}: {
  titel: string;
  laatstBijgewerkt: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl text-pitch-950 sm:text-4xl">
        {titel}
      </h1>
      <p className="mt-2 text-sm text-pitch-950/50">
        Laatst bijgewerkt: {laatstBijgewerkt}
      </p>
      <div className="prose prose-sm mt-8 max-w-none space-y-4 text-pitch-950/80 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-pitch-950 [&_strong]:text-pitch-950">
        {children}
      </div>
    </div>
  );
}

export function JuridischeTodo({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl border border-flare-500/30 bg-flare-500/5 px-4 py-3 text-sm text-flare-700">
      <strong>TODO (juridisch te checken):</strong> {children}
    </p>
  );
}
