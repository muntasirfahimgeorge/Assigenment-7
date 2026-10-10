import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import {
  getProducts,
  getProduct,
  getCategories,
  getCategory,
} from "../../lib/api.ts";

afterEach(() => mock.restoreAll());

function respond(products, categories = []) {
  return mock.method(globalThis, "fetch", async (url) =>
    Response.json(url.endsWith("/categories") ? categories : products),
  );
}

test("products retain numeric prices for Bengali display and sorting", async () => {
  const products = [
    { slug: "peyaj", today: 54 },
    { slug: "alu", today: 30 },
  ];
  const fetch = respond(products);
  assert.deepEqual(await getProducts(), products);
  assert.equal(fetch.mock.calls[0].arguments[1].cache, "no-store");
});

test("a failed products response is rejected", async () => {
  mock.method(
    globalThis,
    "fetch",
    async () => new Response(null, { status: 503 }),
  );
  await assert.rejects(getProducts(), /Failed to fetch products/);
});

test("a rate-limited primary API falls back to the PRD alternative", async () => {
  const fetch = mock.method(globalThis, "fetch", async (url) =>
    url.includes("api.api-store")
      ? new Response(null, { status: 429 })
      : Response.json([{ slug: "peyaj" }]),
  );
  assert.equal((await getProducts())[0].slug, "peyaj");
  assert.equal(fetch.mock.calls.length, 2);
  assert.match(fetch.mock.calls[1].arguments[0], /api\.abcz/);
});

test("a primary network timeout falls back to the alternative", async () => {
  mock.method(globalThis, "fetch", async (url, options) => {
    assert.ok(options.signal instanceof AbortSignal);
    if (url.includes("api.api-store"))
      throw new DOMException("Timeout", "TimeoutError");
    return Response.json([{ slug: "alu" }]);
  });
  assert.equal((await getProducts())[0].slug, "alu");
});

test("malformed API payloads fall back rather than reaching product rendering", async () => {
  mock.method(globalThis, "fetch", async (url) =>
    Response.json(
      url.includes("api.api-store") ? { error: "unavailable" } : [],
    ),
  );
  assert.deepEqual(await getProducts(), []);
});

test("product lookup resolves a slug rather than an array position", async () => {
  respond([
    { id: 1, slug: "alu" },
    { id: 2, slug: "peyaj" },
  ]);
  assert.equal((await getProduct("peyaj")).id, 2);
});

test("unknown products are rejected", async () => {
  respond([{ slug: "alu" }]);
  await assert.rejects(getProduct("unknown"), /Product not found/);
});

test("category lookup filters out products from other categories", async () => {
  respond(
    [
      { slug: "peyaj", category: "sobji" },
      { slug: "chal", category: "chal" },
    ],
    [{ id: "sobji", slug: "sobji", nameBn: "সবজি" }],
  );
  const category = await getCategory("sobji");
  assert.deepEqual(
    category.products.map((product) => product.slug),
    ["peyaj"],
  );
});

test("category slug aliases use the resolved category id to filter products", async () => {
  respond(
    [{ slug: "miniket", category: "rice" }],
    [{ id: "rice", slug: "chal" }],
  );
  assert.equal((await getCategory("chal")).products.length, 1);
  assert.equal((await getCategory("rice")).products.length, 1);
});

test("unknown and valid empty categories remain distinguishable", async () => {
  respond([], [{ id: "sobji", slug: "sobji" }]);
  assert.deepEqual((await getCategory("sobji")).products, []);
  await assert.rejects(getCategory("invalid"), /Category not found/);
});

test("a failed categories response is rejected", async () => {
  mock.method(
    globalThis,
    "fetch",
    async () => new Response(null, { status: 500 }),
  );
  await assert.rejects(getCategories(), /Failed to fetch categories/);
});
