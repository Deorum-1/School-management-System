import { loadEnvConfig } from "@next/env";
import { createInterface } from "node:readline/promises";
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

function promptSecret(label: string): Promise<string> {
  if (!stdin.isTTY) {
    return Promise.reject(
      new Error("Run this command from an interactive terminal."),
    );
  }

  stdout.write(label);
  stdin.setRawMode(true);
  stdin.resume();

  return new Promise((resolve, reject) => {
    let value = "";

    const finish = (error?: Error) => {
      stdin.off("data", onData);
      stdin.setRawMode(false);
      stdin.pause();
      stdout.write("\n");
      if (error) {
        reject(error);
      } else {
        resolve(value);
      }
    };

    const onData = (chunk: Buffer | string) => {
      for (const character of chunk.toString()) {
        if (character === "\u0003") {
          finish(new Error("Admin setup canceled."));
          return;
        }
        if (character === "\r" || character === "\n") {
          finish();
          return;
        }
        if (character === "\u007f" || character === "\b") {
          value = value.slice(0, -1);
        } else if (character >= " ") {
          value += character;
        }
      }
    };

    stdin.on("data", onData);
  });
}

async function main() {
  const prompt = createInterface({ input: stdin, output: stdout });
  const name = await prompt.question("Admin name: ");
  const email = await prompt.question("Admin email: ");
  prompt.close();

  const parsed = adminSchema.safeParse({ name, email });
  if (!parsed.success) {
    throw new Error("Enter a valid name and email address.");
  }

  const password = await promptSecret("Admin password (minimum 12 characters): ");
  const confirmation = await promptSecret("Confirm password: ");
  if (password.length < 12 || password !== confirmation) {
    throw new Error("Passwords must match and contain at least 12 characters.");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true },
  });
  if (existingUser) {
    throw new Error(
      "An account with that email already exists. No account was changed.",
    );
  }

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      role: "ADMIN",
      password: await hashPassword(password),
    },
  });

  console.info("Admin account created. You can now sign in.");
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
