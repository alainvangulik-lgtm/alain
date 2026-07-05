import type { NextAuthConfig } from "next-auth";

// Basisconfiguratie die ook in de Edge-middleware gebruikt mag worden.
// Bevat geen providers die Node-only code (bcrypt, Prisma) nodig hebben.
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/inloggen",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;

      if (pathname.startsWith("/admin")) {
        return isLoggedIn && auth?.user?.rol === "ADMIN";
      }
      if (pathname.startsWith("/dashboard")) {
        return isLoggedIn;
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.rol = user.rol;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.rol = token.rol as "KLANT" | "ADMIN";
      }
      return session;
    },
  },
  providers: [],
};
