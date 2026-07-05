import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registratieSchema } from "@/lib/validation";
import { verstuurWelkomstmail } from "@/lib/email";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registratieSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ongeldige invoer" },
      { status: 400 }
    );
  }

  const { naam, email, wachtwoord } = parsed.data;

  const bestaandeGebruiker = await prisma.user.findUnique({ where: { email } });
  if (bestaandeGebruiker) {
    return NextResponse.json(
      { error: "Er bestaat al een account met dit e-mailadres" },
      { status: 409 }
    );
  }

  const wachtwoordHash = await bcrypt.hash(wachtwoord, 12);
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const rol = adminEmails.includes(email.toLowerCase()) ? "ADMIN" : "KLANT";

  await prisma.user.create({
    data: { naam, email, wachtwoordHash, rol },
  });

  await verstuurWelkomstmail(email, naam).catch(() => null);

  return NextResponse.json({ success: true });
}
