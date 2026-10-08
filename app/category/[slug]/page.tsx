import Link from "next/link";

import BazarHeader from "@/app/components/BazarHeader";
import {
  getCategory,
  Product,
} from "@/lib/api";
import SortControl from "./SortControl";

function bn(value: number) {
  return value.toLocaleString("bn-BD");
}

function unitName(unit: Product["unit"]) {
  const units = {
    kg: "কেজি",
    litre: "লিটার",
    dozen: "ডজন",
    piece: "পিস",
  };

  return units[unit];
}

function ProductCard({
  product,
}: {
  product: Product;
}) {
  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="bazar-product-card"
    >
      <div className="bazar-product-image">
        {product.image}
      </div>

      <div className="bazar-product-body">
        <h3 className="bazar-product-name">
          {product.nameBn}
        </h3>

        <p className="bazar-product-unit">
          প্রতি {unitName(product.unit)}
        </p>

        <div className="bazar-product-bottom">
          <div>
            <p className="bazar-price-label">
              আজকের দাম
            </p>

            <p className="bazar-price">
              {bn(product.today)} টাকা
            </p>
          </div>

          <span
            className={`bazar-change ${
              isUp
                ? "bazar-change-up"
                : isDown
                  ? "bazar-change-down"
                  : "bazar-change-flat"
            }`}
          >
            {isUp
              ? "▲"
              : isDown
                ? "▼"
                : "—"}{" "}
            {bn(Math.abs(product.change.pct))}%
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    sort?: string;
  }>;
}) {
  const { slug } = await params;
  const { sort } = await searchParams;

  let category;

  try {
    category = await getCategory(slug);
  } catch {
    return (
      <main className="min-h-screen bg-white">
        <BazarHeader />

        <div className="bazar-container">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <div className="text-6xl">
                🛒
              </div>

              <h1 className="mt-4 text-4xl font-black text-gray-900">
                404
              </h1>

              <h2 className="mt-3 text-xl font-bold text-gray-800">
                ক্যাটাগরি পাওয়া যায়নি
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                আপনি যে ক্যাটাগরিটি খুঁজছেন সেটি পাওয়া যায়নি।
              </p>

              <Link
                href="/"
                className="mt-6 inline-block rounded-lg bg-green-600 px-5 py-3 text-sm font-bold text-white"
              >
                হোম পেজে ফিরে যান
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const products = [...category.products];

  if (sort === "low") {
    products.sort(
      (a, b) => a.today - b.today,
    );
  }

  if (sort === "high") {
    products.sort(
      (a, b) => b.today - a.today,
    );
  }

  return (
    <main className="min-h-screen bg-[#fafbf8]">
      <BazarHeader />

      <div className="bazar-container py-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">
                {category.icon}
              </span>

              <h1 className="text-3xl font-black text-gray-900">
                {category.nameBn}
              </h1>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              {category.nameBn} বিভাগের সব পণ্যের আজকের বাজার মূল্য
            </p>
          </div>

          <SortControl
            slug={slug}
            sort={sort || "default"}
          />
        </div>

        {products.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <div className="text-5xl">
              🛒
            </div>

            <h2 className="mt-4 text-xl font-black text-gray-900">
              কোনো পণ্য পাওয়া যায়নি
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য নেই।
            </p>

            <Link
              href="/"
              className="mt-6 inline-block rounded-lg bg-green-600 px-5 py-3 text-sm font-bold text-white"
            >
              হোম পেজে ফিরে যান
            </Link>
          </div>
        ) : (
          <div className="bazar-product-grid mt-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>

      <footer className="bazar-footer">
        <div className="bazar-container bazar-footer-content">
          <div>
            <div className="bazar-footer-logo">
              বাজার দর
            </div>

            <p className="bazar-footer-description">
              বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
            </p>
          </div>

          <p className="bazar-footer-disclaimer">
            সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
          </p>
        </div>
      </footer>
    </main>
  );
}