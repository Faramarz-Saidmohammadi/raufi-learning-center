import { afterEach, describe, expect, it } from "vitest";
import { adminSessionCookie, createAdminSession, expiredAdminSessionCookie, getAdminConfiguration, verifyAdminCredentials } from "../lib/admin-session";

const environment = { ADMIN_EMAILS: process.env.ADMIN_EMAILS, ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH, ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET };
const encode = (bytes: Uint8Array) => Buffer.from(bytes).toString("base64url");
async function passwordHash(password: string) {
  const salt = new TextEncoder().encode("0123456789abcdef"), iterations = 100_000;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const derived = new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256));
  return `pbkdf2-sha256$${iterations}$${encode(salt)}$${encode(derived)}`;
}
async function configure() {
  process.env.ADMIN_EMAILS = "admin@example.com, owner@example.com";
  process.env.ADMIN_PASSWORD_HASH = await passwordHash("StrongPassword!2026");
  process.env.ADMIN_SESSION_SECRET = "a-test-session-secret-that-is-longer-than-32-characters";
}
afterEach(() => { for (const [key, value] of Object.entries(environment)) { if (value === undefined) delete process.env[key]; else process.env[key] = value; } });

describe("administrator configuration and credentials", () => {
  it("reports incomplete configuration as unavailable", async () => {
    delete process.env.ADMIN_EMAILS; delete process.env.ADMIN_PASSWORD_HASH; delete process.env.ADMIN_SESSION_SECRET;
    expect(await getAdminConfiguration()).toEqual({ configured: false, emails: [] });
  });
  it("accepts an allowlisted email and correct password", async () => {
    await configure();
    await expect(verifyAdminCredentials(" Admin@Example.com ", "StrongPassword!2026")).resolves.toEqual({ email: "admin@example.com", displayName: "admin" });
  });
  it("rejects wrong credentials", async () => {
    await configure();
    await expect(verifyAdminCredentials("admin@example.com", "wrong-password")).resolves.toBeNull();
    await expect(verifyAdminCredentials("other@example.com", "StrongPassword!2026")).resolves.toBeNull();
  });
  it("creates a signed session and secure cookie", async () => {
    await configure();
    const token = await createAdminSession({ email: "admin@example.com", displayName: "admin" });
    expect(token.split(".")).toHaveLength(2);
    expect(adminSessionCookie(token, true)).toContain("HttpOnly; SameSite=Strict");
    expect(adminSessionCookie(token, true)).toContain("; Secure");
    expect(expiredAdminSessionCookie(true)).toContain("Max-Age=0; Secure");
  });
});
