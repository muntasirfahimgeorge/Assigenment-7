import { expect, test } from "@playwright/test";
import { randomBytes, randomUUID } from "node:crypto";
import { auth } from "../../lib/auth";

test.afterAll(async () => {
  await (auth.options.database as import("pg").Pool).end();
});

test("signup, login, profile update, protected refresh, 404 and logout", async ({
  page,
}) => {
  const email = `e2e-${randomUUID()}@example.com`;
  const name = "BazarDor E2E Check";
  const password = randomBytes(24).toString("hex");
  try {
    await page.goto("/signup");
    await page.getByLabel("নাম", { exact: true }).fill(name);
    await page.getByLabel("ইমেইল").fill(email);
    await page.getByLabel("পাসওয়ার্ড").fill(password);
    await page.getByRole("button", { name: "সাইন আপ", exact: true }).click();
    await expect(page).toHaveURL(/\/signin$/);
    expect(
      await (await page.request.get("/api/auth/get-session")).json(),
    ).toBeNull();

    await page.getByLabel("ইমেইল").fill(email);
    await page.getByLabel("পাসওয়ার্ড").fill(password);
    await page.getByRole("button", { name: "সাইন ইন", exact: true }).click();
    await expect(page).toHaveURL(/:3002\/$/);
    await expect(page.getByRole("link", { name, exact: true })).toBeVisible();

    await page.goto("/product/peyaj");
    await expect(
      page.getByRole("heading", { name: "পেঁয়াজ", exact: true }),
    ).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole("heading", { name: "বাজারভিত্তিক আজকের দাম" }),
    ).toBeVisible();
    await expect(
      page.locator(".product-market-table tbody tr").first(),
    ).toBeVisible();

    await page.goto("/product/unknown");
    await expect(
      page.getByRole("heading", { name: "404", exact: true }),
    ).toBeVisible();

    await page.goto("/profile");
    await expect(page.getByLabel("Name", { exact: true })).toHaveValue(name);
    await page.getByLabel("Name", { exact: true }).fill("Updated E2E Name");
    await page
      .getByRole("button", { name: "Update Information", exact: true })
      .click();
    await expect(page.locator('[role="status"]')).toContainText(
      "তথ্য সফলভাবে আপডেট হয়েছে",
    );
    await page.reload();
    await expect(page.getByLabel("Name", { exact: true })).toHaveValue(
      "Updated E2E Name",
    );

    await page.getByRole("button", { name: "সাইন আউট", exact: true }).click();
    await expect(page).toHaveURL(/:3002\/$/);
    expect(
      await (await page.request.get("/api/auth/get-session")).json(),
    ).toBeNull();
    await page.goto("/product/peyaj");
    await expect(page).toHaveURL(/\/signin\?callbackUrl=\/product\/peyaj$/);
  } finally {
    await (auth.options.database as import("pg").Pool).query(
      'DELETE FROM public."user" WHERE email = $1',
      [email],
    );
  }
});

for (const provider of ["google", "github"]) {
  test(`${provider} authorization uses the server origin callback`, async ({
    request,
    baseURL,
  }) => {
    const response = await request.post("/api/auth/sign-in/social", {
      headers: { Origin: baseURL! },
      data: { provider, callbackURL: "/", disableRedirect: true },
    });
    expect(response.status()).toBe(200);
    const url = new URL((await response.json()).url);
    expect(url.hostname).toBe(
      provider === "google" ? "accounts.google.com" : "github.com",
    );
    expect(url.searchParams.get("redirect_uri")).toBe(
      `${baseURL}/api/auth/callback/${provider}`,
    );
  });
}
