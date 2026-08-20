import { expect, test } from "@playwright/test";

async function switchToEnglish(page: import("@playwright/test").Page) {
  await page.getByRole("button", { name: /دری/ }).click();
  await page.getByRole("button", { name: "English", exact: true }).click();
}

test("public site supports language direction and programme discovery", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("آینده");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await switchToEnglish(page);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Build your future");
  const search = page.getByPlaceholder("Search programmes...");
  await search.fill("QuickBooks");
  await expect(page.locator(".program-card")).toHaveCount(1);
  await expect(page.locator(".program-card")).toContainText("QuickBooks Accounting");
  await search.fill("a programme that does not exist");
  await expect(page.getByText("No programme matches this search.")).toBeVisible();
});

test("course details and comparison remain usable", async ({ page }) => {
  await page.goto("/"); await switchToEnglish(page);
  const cards = page.locator(".program-card");
  await cards.nth(0).getByRole("button", { name: /Full details/ }).click();
  await expect(page.getByRole("dialog")).toContainText("Kankor Preparation");
  await page.getByRole("button", { name: "Close" }).click();
  await cards.nth(0).getByRole("button", { name: "Compare" }).click();
  await cards.nth(1).getByRole("button", { name: "Compare" }).click();
  await page.getByRole("button", { name: "Compare selections" }).click();
  await expect(page.getByRole("dialog")).toContainText("Kankor Preparation");
  await expect(page.getByRole("dialog")).toContainText("English Language");
});

test("spam honeypot succeeds without writing personal data", async ({ request }) => {
  const response = await request.post("/api/contact", { data: { website: "automated.example", name: "Bot", phone: "0000000", interest: "Test", sourceLanguage: "en", consent: true } });
  expect(response.status()).toBe(200);
  await expect(response.json()).resolves.toEqual({ ok: true });
});
