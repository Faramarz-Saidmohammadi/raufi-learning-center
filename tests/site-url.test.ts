import { afterEach, describe, expect, it } from "vitest";
import { getSiteUrl } from "../lib/site-url";

const original = process.env.NEXT_PUBLIC_SITE_URL;
afterEach(() => { if (original === undefined) delete process.env.NEXT_PUBLIC_SITE_URL; else process.env.NEXT_PUBLIC_SITE_URL = original; });

describe("getSiteUrl", () => {
  it("returns a normalized configured origin", () => {
    process.env.NEXT_PUBLIC_SITE_URL = " https://example.com/path ";
    expect(getSiteUrl()).toBe("https://example.com");
  });
  it("falls back safely for invalid configuration", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "not a URL";
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });
});
