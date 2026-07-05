export const SERVICEBEDRAG_PER_PAAR_CENTEN = 1_500; // €15,- servicekosten per paar
export const INDICATIEVE_SCHOENPRIJS_PER_PAAR_CENTEN = 12_000; // €120,- gemiddelde richtprijs per paar

export function berekenServicebedrag(aantal: number) {
  return SERVICEBEDRAG_PER_PAAR_CENTEN * aantal;
}

export function berekenIndicatieveSchoenprijs(aantal: number) {
  return INDICATIEVE_SCHOENPRIJS_PER_PAAR_CENTEN * aantal;
}

export function toEuro(centen: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(centen / 100);
}
