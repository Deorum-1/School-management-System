import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";

const KEY_LENGTH = 64;
const SCRYPT_OPTIONS = {
  N: 16384,
  r: 8,
  p: 1,
  maxmem: 64 * 1024 * 1024,
};

function deriveKey(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, KEY_LENGTH, SCRYPT_OPTIONS, (error, key) => {
      if (error) {
        reject(error);
      } else {
        resolve(key);
      }
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await deriveKey(password, salt);
  return `scrypt-v1$${salt.toString("base64url")}$${key.toString("base64url")}`;
}

export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  const [version, saltText, keyText, extra] = storedHash.split("$");
  if (
    version !== "scrypt-v1" ||
    !saltText ||
    !keyText ||
    extra !== undefined ||
    !/^[A-Za-z0-9_-]+$/.test(saltText) ||
    !/^[A-Za-z0-9_-]+$/.test(keyText)
  ) {
    return false;
  }

  const salt = Buffer.from(saltText, "base64url");
  const expectedKey = Buffer.from(keyText, "base64url");
  if (
    salt.length !== 16 ||
    expectedKey.length !== KEY_LENGTH ||
    salt.toString("base64url") !== saltText ||
    expectedKey.toString("base64url") !== keyText
  ) {
    return false;
  }

  const actualKey = await deriveKey(password, salt);
  return timingSafeEqual(actualKey, expectedKey);
}

export function verifyLegacyPassword(
  password: string,
  storedPassword: string,
): boolean {
  if (!storedPassword || storedPassword.startsWith("scrypt-v1$")) {
    return false;
  }

  const passwordBytes = Buffer.from(password, "utf8");
  const storedPasswordBytes = Buffer.from(storedPassword, "utf8");
  return (
    passwordBytes.length === storedPasswordBytes.length &&
    timingSafeEqual(passwordBytes, storedPasswordBytes)
  );
}
