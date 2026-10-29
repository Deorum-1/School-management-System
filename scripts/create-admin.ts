import { loadEnvConfig } from "@next/env";
import { createInterface } from "node:readline/promises";
import { randomBytes } from "node:crypto";
import { stdin, stdout } from "node:process";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { hashPassword } from "../src/lib/password";

loadEnvConfig(process.cwd());

const prisma = new PrismaClient();
const adminSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
});

async function main() {
  const args = process.argv.slice(2);
  let name: string;
  let email: string;

  if (args.length === 2) {
    [name, email] = args;
  } else if (args.length === 0 && stdin.isTTY) {
    const prompt = createInterface({ input: stdin, output: stdout });
    name = await prompt.question("Admin name: ");
    email = await prompt.question("Admin email: ");
    prompt.close();
  } else {
    throw new Error(
      'Run this command in an interactive terminal or provide "name" and "email".',
    );
  }

  const parsed = adminSchema.safeParse({ name, email });
  if (!parsed.success) {
    throw new Error("Enter a valid name and email address.");
  }

  const existingUser = await prisma.user.findUnique({
    where: { username: parsed.data.email },
    select: { id: true },
  });
  if (existingUser) {
    throw new Error(
      "An account with that email already exists. No account was changed.",
    );
  }

  const password = randomBytes(32).toString("base64url");
  await prisma.user.create({
    data: {
      name: parsed.data.name,
      username: parsed.data.email,
      email: parsed.data.email,
      role: "ADMIN",
      password: await hashPassword(password),
    },
  });

  console.info("Admin account created in the database.");
  console.info(`Sign-in email: ${parsed.data.email}`);
  console.info(`Generated password (shown once): ${password}`);
  console.info("Save this password securely; it cannot be recovered.");
}

main()
  .catch((error: unknown) => {
    console.error(
      error instanceof Error ? error.message : "Admin account setup failed.",
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
