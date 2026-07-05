import { createMollieClient } from "@mollie/api-client";

let client: ReturnType<typeof createMollieClient> | null = null;

export function getMollieClient() {
  if (!process.env.MOLLIE_API_KEY) {
    throw new Error("MOLLIE_API_KEY ontbreekt in de omgevingsvariabelen");
  }
  if (!client) {
    client = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });
  }
  return client;
}

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}
