import { cookies } from "next/headers";

export type AdminUser = {
  displayName: string;
  email: string;
};

const COOKIE_NAME = "raufi_cms_session";
const SESSION_SECONDS = 8 * 60 * 60;
const HASH_PREFIX = "pbkdf2-sha256";

type AdminConfiguration = {
  configured: boolean;
  emails: string[];
  passwordHash: string;
  sessionSecret: string;
};

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string): Uint8Array | null {
  try {
    const normal = value.replaceAll("-", "+").replaceAll("_", "/");
    const padded = normal.padEnd(Math.ceil(normal.length / 4) * 4, "=");
    return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
  } catch {
    return null;
  }
}

async function configuration(): Promise<AdminConfiguration> {
  const emails = String(process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  const passwordHash = String(process.env.ADMIN_PASSWORD_HASH ?? "").trim();
  const sessionSecret = String(process.env.ADMIN_SESSION_SECRET ?? "").trim();
  return {
    configured:
      emails.length > 0 &&
      passwordHash.startsWith(`${HASH_PREFIX}$`) &&
      sessionSecret.length >= 32,
    emails,
    passwordHash,
    sessionSecret,
  };
}

async function hmac(secret: string, value: string): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
}

async function validSignature(secret: string, value: string, signature: Uint8Array): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  return crypto.subtle.verify("HMAC", key, new Uint8Array(signature), encoder.encode(value));
}

async function passwordMatches(password: string, encodedHash: string): Promise<boolean> {
  const [algorithm, rawIterations, rawSalt, rawExpected] = encodedHash.split("$");
  const iterations = Number.parseInt(rawIterations, 10);
  const salt = base64UrlDecode(rawSalt ?? "");
  const expected = base64UrlDecode(rawExpected ?? "");
  if (
    algorithm !== HASH_PREFIX ||
    !Number.isInteger(iterations) ||
    iterations < 100_000 ||
    iterations > 1_000_000 ||
    !salt ||
    salt.length < 16 ||
    !expected ||
    expected.length !== 32
  ) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const actual = new Uint8Array(await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: new Uint8Array(salt), iterations },
    key,
    256,
  ));
  let difference = 0;
  for (let index = 0; index < expected.length; index += 1) difference |= expected[index] ^ actual[index];
  return difference === 0;
}

export async function getAdminConfiguration() {
  const config = await configuration();
  return { configured: config.configured, emails: config.emails };
}

export async function verifyAdminCredentials(email: string, password: string): Promise<AdminUser | null> {
  const config = await configuration();
  const normalizedEmail = email.trim().toLowerCase();
  if (!config.configured || !config.emails.includes(normalizedEmail) || password.length > 256) return null;
  if (!(await passwordMatches(password, config.passwordHash))) return null;
  return { email: normalizedEmail, displayName: normalizedEmail.split("@")[0] || "Administrator" };
}

export async function createAdminSession(user: AdminUser): Promise<string> {
  const config = await configuration();
  if (!config.configured) throw new Error("CMS authentication is not configured.");
  const payload = base64UrlEncode(new TextEncoder().encode(JSON.stringify({
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS,
  })));
  const signature = base64UrlEncode(await hmac(config.sessionSecret, payload));
  return `${payload}.${signature}`;
}

export async function getAdminUser(): Promise<AdminUser | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  const [payload, encodedSignature] = token.split(".");
  const signature = base64UrlDecode(encodedSignature ?? "");
  const payloadBytes = base64UrlDecode(payload ?? "");
  const config = await configuration();
  if (!config.configured || !payload || !signature || !payloadBytes) return null;
  if (!(await validSignature(config.sessionSecret, payload, signature))) return null;
  try {
    const session = JSON.parse(new TextDecoder().decode(payloadBytes)) as { email?: unknown; exp?: unknown };
    const email = String(session.email ?? "").toLowerCase();
    if (!config.emails.includes(email) || Number(session.exp) <= Math.floor(Date.now() / 1000)) return null;
    return { email, displayName: email.split("@")[0] || "Administrator" };
  } catch {
    return null;
  }
}

export function adminSessionCookie(token: string, secure: boolean): string {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_SECONDS}${secure ? "; Secure" : ""}`;
}

export function expiredAdminSessionCookie(secure: boolean): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure ? "; Secure" : ""}`;
}
