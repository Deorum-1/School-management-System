"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, deleteSession } from "@/lib/auth";
import db from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { LOGIN_ROLES } from "@/lib/permissions";

const credentialsSchema = z.object({
  email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
  password: z.string().min(1).max(256),
  role: z.enum(LOGIN_ROLES),
});

export async function loginAction(formData: FormData): Promise<void> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    redirect("/login?error=invalid");
  }

  let authenticated = false;

  try {
    const user = await db.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true, password: true, role: true },
    });

    if (
      user &&
      user.role === parsed.data.role &&
      (await verifyPassword(parsed.data.password, user.password))
    ) {
      await deleteSession();
      await createSession(user.id);
      authenticated = true;
    }
  } catch (error: unknown) {
    console.error(
      "loginAction failed.",
      error instanceof Error ? error.name : "Unknown error",
    );
    redirect("/login?error=unavailable");
  }

  if (!authenticated) {
    redirect("/login?error=invalid");
  }

  redirect("/");
}

export async function logoutAction(): Promise<void> {
  await deleteSession();
  redirect("/login");
}
