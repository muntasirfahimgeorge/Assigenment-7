import { expect, test } from "@playwright/test";

for (const viewport of [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
]) {
  test(`home renders and anchors to products at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(page.locator(".bazar-product-card").first()).toBeVisible();
    await expect(page.locator(".bazar-hero img")).toBeVisible();
    await expect(
      page.locator(".bazar-section").nth(0).locator(".bazar-product-card"),
    ).toHaveCount(6);
    await expect(
      page.locator(".bazar-section").nth(1).locator(".bazar-product-card"),
    ).toHaveCount(6);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page
      .getByRole("link", { name: "সব পণ্য দেখুন", exact: true })
      .click();
    expect(decodeURIComponent(new URL(page.url()).hash)).toBe("#সব-পণ্য");
    await expect(page.locator('[id="সব-পণ্য"]')).toBeInViewport();
  });
}

test("category sorts Bengali prices numerically and survives refresh", async ({
  page,
}) => {
  await page.goto("/category/sobji");
  const prices = async () =>
    page
      .locator(".bazar-price")
      .evaluateAll((nodes) =>
        nodes.map((node) =>
          Number(
            (node.textContent || "")
              .replace(/[০-৯]/g, (digit) => String("০১২৩৪৫৬৭৮৯".indexOf(digit)))
              .replace(/[^\d.]/g, ""),
          ),
        ),
      );
  for (const direction of ["low", "high", "default"]) {
    await page.getByLabel("সাজান:").selectOption(direction);
    await expect(page).toHaveURL(
      direction === "default"
        ? /\/category\/sobji$/
        : new RegExp(`sort=${direction}$`),
    );
    if (direction !== "default") {
      await expect
        .poll(prices)
        .toEqual(
          (await prices()).sort((a, b) =>
            direction === "low" ? a - b : b - a,
          ),
        );
      await page.reload();
      await expect(page.getByLabel("সাজান:")).toHaveValue(direction);
    }
  }
});

test("invalid category and unknown routes offer a home link", async ({
  page,
}) => {
  for (const route of ["/category/invalid", "/unknown-route"]) {
    await page.goto(route);
    await expect(
      page.getByRole("heading", { name: "404", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "হোম পেজে ফিরে যান" }),
    ).toHaveAttribute("href", "/");
  }
});

test("protected product and profile routes redirect signed-out visitors", async ({
  page,
}) => {
  for (const route of ["/product/peyaj", "/profile"]) {
    await page.goto(route);
    await expect(page).toHaveURL(new RegExp(`/signin\\?callbackUrl=${route}$`));
    await expect(
      page.getByRole("heading", { name: "সাইন ইন করুন" }),
    ).toBeVisible();
  }
});

test("failed login displays an error and re-enables the submit button", async ({
  page,
}) => {
  await page.goto("/signin");
  await page.getByLabel("ইমেইল").fill("does-not-exist@example.com");
  await page.getByLabel("পাসওয়ার্ড").fill("incorrect-password");
  const response = page.waitForResponse((r) =>
    r.url().endsWith("/api/auth/sign-in/email"),
  );
  await page.getByRole("button", { name: "সাইন ইন", exact: true }).click();
  expect((await response).status()).toBe(401);
  await expect(page.locator('[role="status"]')).toContainText(/invalid/i);
  await expect(
    page.getByRole("button", { name: "সাইন ইন", exact: true }),
  ).toBeEnabled();
});

test("network login errors display a toast and restore the form", async ({
  page,
}) => {
  await page.goto("/signin");
  await page.route("**/api/auth/sign-in/email", (route) => route.abort());
  await page.getByLabel("ইমেইল").fill("test@example.com");
  await page.getByLabel("পাসওয়ার্ড").fill("some-password");
  await page.getByRole("button", { name: "সাইন ইন", exact: true }).click();
  await expect(page.locator('[role="status"]')).toBeVisible();
  await expect(
    page.getByRole("button", { name: "সাইন ইন", exact: true }),
  ).toBeEnabled();
});
