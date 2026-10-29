import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { hasPermission, Role, UserSession } from "@/lib/permissions";

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const SESSION_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;
const SESSION_COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Host-apex-session"
    : "apex-session";

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function isRole(value: string): value is Role {
  return (
    value === "ADMIN" ||
    value === "TEACHER" ||
    value === "PARENT" ||
    value === "STUDENT" ||
    value === "ACCOUNTANT"
  );
}

export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await db.session.create({
    data: {
      tokenHash: hashToken(token),
      userId,
      expiresAt,
    },
  });

  cookies().set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function getSessionUser(): Promise<UserSession | null> {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!token || !SESSION_TOKEN_PATTERN.test(token)) {
    return null;
  }

  const session = await db.session.findUnique({
    where: { tokenHash: hashToken(token) },
    select: {
      expiresAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt <= new Date() || !isRole(session.user.role)) {
    await db.session.deleteMany({
      where: { tokenHash: hashToken(token) },
    });
    return null;
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role,
    avatar: session.user.avatar ?? undefined,
  };
}

export async function deleteSession(): Promise<void> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token && SESSION_TOKEN_PATTERN.test(token)) {
    await db.session.deleteMany({
      where: { tokenHash: hashToken(token) },
    });
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function requireAuth(): Promise<UserSession> {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireRole(
  allowedRoles: readonly Role[],
): Promise<UserSession> {
  const user = await getSessionUser();
  if (!user) {
    throw new AuthorizationError("Your session has expired. Please sign in.");
  }
  if (!allowedRoles.includes(user.role)) {
    throw new AuthorizationError("You do not have permission to do that.");
  }
  return user;
}

export async function requirePermission(
  permission: string,
): Promise<UserSession> {
  const user = await getSessionUser();
  if (!user) {
    throw new AuthorizationError("Your session has expired. Please sign in.");
  }
  if (!hasPermission(user.role, permission)) {
    throw new AuthorizationError("You do not have permission to do that.");
  }
  return user;
}
