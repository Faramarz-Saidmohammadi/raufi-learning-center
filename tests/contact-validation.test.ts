import { describe, expect, it } from "vitest";
import { normalizePhone, parseContactPayload } from "../lib/contact-validation";

const now = new Date("2026-08-20T10:00:00.000Z");
const validPayload = {
  name: "Faramarz Said", phone: "+93 79 672 2727", interest: "Computer & ICDL",
  educationLevel: "University graduate", preferredTime: "Afternoon",
  message: "Please share the next class schedule.", sourceLanguage: "en", consent: true,
};

describe("normalizePhone", () => {
  it("normalizes Dari and Arabic digits", () => {
    expect(normalizePhone("+۹۳ (۷۹) ۶۷۲-۲۷۲۷")).toBe("+93 (79) 672-2727");
  });
  it("removes invalid characters", () => {
    expect(normalizePhone("+93 79 abc 672 2727")).toBe("+93 79 672 2727");
  });
});

describe("parseContactPayload", () => {
  it("accepts and normalizes a valid enquiry", () => {
    expect(parseContactPayload(validPayload, now)).toEqual({ ok: true, spam: false, data: {
      name: "Faramarz Said", phone: "+93 79 672 2727", interest: "Computer & ICDL",
      educationLevel: "University graduate", preferredTime: "Afternoon",
      message: "Please share the next class schedule.", sourceLanguage: "en", consentAt: now.toISOString(),
    }});
  });
  it("quietly accepts honeypot submissions", () => {
    const result = parseContactPayload({ ...validPayload, website: "spam.example" }, now);
    expect(result.ok && result.spam).toBe(true);
  });
  it.each([
    [{ ...validPayload, name: "A" }, "invalid_name"],
    [{ ...validPayload, phone: "123" }, "invalid_phone"],
    [{ ...validPayload, interest: "" }, "missing_programme"],
    [{ ...validPayload, consent: false }, "consent_required"],
  ])("rejects invalid form data", (payload, code) => {
    const result = parseContactPayload(payload, now);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe(code);
  });
  it("uses Dari as the safe language fallback", () => {
    const result = parseContactPayload({ ...validPayload, sourceLanguage: "unknown" }, now);
    expect(result.ok && result.data.sourceLanguage).toBe("fa");
  });
});
