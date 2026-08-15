const fallbackUrl = "http://localhost:3000";

export function getSiteUrl(): string {
  const candidate = process.env.NEXT_PUBLIC_SITE_URL?.trim() || fallbackUrl;
  try {
    return new URL(candidate).origin;
  } catch {
    return fallbackUrl;
  }
}
