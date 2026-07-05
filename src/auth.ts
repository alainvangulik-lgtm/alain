import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";

const providers: Provider[] = [
  Credentials({
    credentials: {
      email: { label: "E-mailadres", type: "email" },
      wachtwoord: { label: "Wachtwoord", type: "password" },
    },
    async authorize(credentials) {
      const email = credentials?.email as string | undefined;
      const wachtwoord = credentials?.wachtwoord as string | undefined;
      if (!email || !wachtwoord) return null;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user?.wachtwoordHash) return null;

      const klopt = await bcrypt.compare(wachtwoord, user.wachtwoordHash);
      if (!klopt) return null;

      return {
        id: user.id,
        name: user.naam,
        email: user.email,
        rol: user.rol,
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user }) {
      if (user?.email && adminEmails.includes(user.email.toLowerCase())) {
        await prisma.user.updateMany({
          where: { email: user.email, rol: "KLANT" },
          data: { rol: "ADMIN" },
        });
        user.rol = "ADMIN";
      }
      return true;
    },
  },
});
