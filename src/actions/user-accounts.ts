"use server";

import { Prisma } from "@prisma/client";
import { z } from "zod";
import { AuthorizationError, requireRole } from "@/lib/auth";
import db from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { ROLE_LABELS } from "@/lib/permissions";

const accountCredentialsSchema = {
  name: z.string().trim().min(2).max(120),
  password: z.string().min(12).max(256),
  confirmPassword: z.string().min(12).max(256),
};
const emailSchema = z.string().trim().email().max(254).transform((email) => email.toLowerCase());
const usernameSchema = z
  .string()
  .trim()
  .min(3)
  .max(40)
  .regex(/^[a-zA-Z0-9._-]+$/, "Use letters, numbers, dots, underscores, or hyphens for the username.")
  .transform((username) => username.toLowerCase());

const createAccountSchema = z
  .discriminatedUnion("role", [
    z.object({
      ...accountCredentialsSchema,
      role: z.enum(["ADMIN", "TEACHER"]),
      email: emailSchema,
    }),
    z.object({
      ...accountCredentialsSchema,
      role: z.enum(["STUDENT", "PARENT"]),
      username: usernameSchema,
    }),
  ])
  .refine((account) => account.password === account.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export async function createAccountAction(input: unknown) {
  try {
    await requireRole(["ADMIN"]);
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false as const, error: error.message };
    }

    console.error(
      "createAccountAction authorization check failed.",
      error instanceof Error ? error.name : "Unknown error",
    );
    return {
      success: false as const,
      error: "Unable to verify administrator access. Please try again.",
    };
  }

  const parsed = createAccountSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Account details are invalid.",
    };
  }

  try {
    const account = await db.user.create({
      data: {
        name: parsed.data.name,
        role: parsed.data.role,
        username: "email" in parsed.data ? parsed.data.email : parsed.data.username,
        email: "email" in parsed.data ? parsed.data.email : null,
        password: await hashPassword(parsed.data.password),
      },
      select: { id: true, name: true, username: true, email: true, role: true },
    });

    return {
      success: true as const,
      account: {
        ...account,
        username:
          "email" in parsed.data ? parsed.data.email : parsed.data.username,
        roleLabel: ROLE_LABELS[parsed.data.role],
      },
    };
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false as const,
        error: "An account with this username or email already exists.",
      };
    }

    console.error(
      "createAccountAction failed.",
      error instanceof Error ? error.name : "Unknown error",
    );
    return {
      success: false as const,
      error: "Unable to create the account. Please try again.",
    };
  }
}
