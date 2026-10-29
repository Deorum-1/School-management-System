"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, deleteSession } from "@/lib/auth";
import db from "@/lib/db";
import {
  hashPassword,
  verifyLegacyPassword,
  verifyPassword,
} from "@/lib/password";
import { LOGIN_ROLES } from "@/lib/permissions";

const credentialsSchema = z.object({
  username: z.string().trim().min(1).max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(256),
  role: z.enum(LOGIN_ROLES),
});

export async function loginAction(formData: FormData): Promise<void> {
  const parsed = credentialsSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    redirect("/login?error=invalid");
  }

  let authenticated = false;

  try {
    const user = await db.user.findUnique({
      where: { username: parsed.data.username },
      select: { id: true, password: true, role: true },
    });

    if (user && user.role === parsed.data.role) {
      const passwordMatches = await verifyPassword(
        parsed.data.password,
        user.password,
      );
      const legacyAdminPassword =
        user.role === "ADMIN" &&
        !user.password.startsWith("scrypt-v1$") &&
        verifyLegacyPassword(parsed.data.password, user.password);

      if (passwordMatches) {
        authenticated = true;
      } else if (legacyAdminPassword) {
        const upgradedPassword = await hashPassword(parsed.data.password);
        const result = await db.user.updateMany({
          where: { id: user.id, password: user.password, role: "ADMIN" },
          data: { password: upgradedPassword },
        });
        authenticated = result.count === 1;
      }

      if (authenticated) {
        await deleteSession();
        await createSession(user.id);
      }
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
