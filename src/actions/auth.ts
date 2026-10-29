"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { createSession, deleteSession } from "@/lib/auth";
import db from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { LOGIN_ROLES, PUBLIC_SIGNUP_ROLES } from "@/lib/permissions";

const credentialsSchema = z.object({
  email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
  password: z.string().min(1).max(256),
  role: z.enum(LOGIN_ROLES),
});

const signupSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
  phone: z.string().trim().max(30).optional(),
  password: z.string().min(12).max(256),
  role: z.enum(PUBLIC_SIGNUP_ROLES),
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

export async function signupAction(formData: FormData): Promise<void> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    redirect("/signup?error=invalid");
  }

  let signupError: "exists" | "unavailable" | null = null;
  try {
    await db.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        role: parsed.data.role,
        password: await hashPassword(parsed.data.password),
      },
      select: { id: true },
    });
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      signupError = "exists";
    } else {
      console.error(
        "signupAction failed.",
        error instanceof Error ? error.name : "Unknown error",
      );
      signupError = "unavailable";
    }
  }

  if (signupError) {
    redirect(`/signup?error=${signupError}`);
  }

  redirect("/login?registered=1");
}

export async function logoutAction(): Promise<void> {
  await deleteSession();
  redirect("/login");
}
