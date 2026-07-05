import { z } from "zod";

export const registratieSchema = z.object({
  naam: z.string().min(2, "Vul je volledige naam in").max(100),
  email: z.string().email("Vul een geldig e-mailadres in"),
  wachtwoord: z.string().min(8, "Wachtwoord moet minimaal 8 tekens zijn"),
});

export type RegistratieInput = z.infer<typeof registratieSchema>;

const EU_MAAT_MIN = 30;
const EU_MAAT_MAX = 50;

export const bestelSchema = z.object({
  merk: z.string().min(1, "Kies of vul een merk in").max(60),
  model: z.string().min(1, "Vul het model in").max(100),
  maat: z
    .number({ error: "Kies een maat" })
    .min(EU_MAAT_MIN, "Kies een geldige EU-maat")
    .max(EU_MAAT_MAX, "Kies een geldige EU-maat")
    .refine((v) => Math.round(v * 2) === v * 2, "Alleen halve maten zijn mogelijk"),
  kleur: z.string().min(1, "Vul een kleur in").max(60),
  aantal: z.number().int().min(1).max(10),
  opmerkingen: z.string().max(500).optional().or(z.literal("")),
  akkoordVoorwaarden: z.literal(true, {
    error: "Je moet akkoord gaan met de voorwaarden om te bestellen",
  }),
});

export type BestelInput = z.infer<typeof bestelSchema>;
