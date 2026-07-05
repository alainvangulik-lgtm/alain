import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    rol?: "KLANT" | "ADMIN";
  }

  interface Session {
    user: {
      id: string;
      rol: "KLANT" | "ADMIN";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    rol?: "KLANT" | "ADMIN";
  }
}
