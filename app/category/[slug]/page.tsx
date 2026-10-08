import Link from "next/link";

import { getCategory } from "@/lib/api";

function bn(value: number) {
  return value.toLocaleString("bn-BD");
}

function unitName(unit: string) {
  const units: Record<string, string> = {
    kg: "কেজি",
    litre: "লিটার",
    dozen: "ডজন",
    piece: "পিস",
  };

  return units[unit] || unit;
}

function ProductCard({ product }: { product: any }) {
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
            {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
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
  searchParams: Promise<{ sort?: string }>;
}) {
  const { slug } = await params;
  const { sort } = await searchParams;

  let category;

  try {
    category = await getCategory(slug);
  } catch {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl">🛒</div>

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
      </main>
    );
  }

  const products = [...(category.products || category)];

  if (sort === "low") {
    products.sort((a, b) => a.today - b.today);
  }

  if (sort === "high") {
    products.sort((a, b) => b.today - a.today);
  }

  return (
    <main className="min-h-screen bg-[#fafbf8]">
      <header className="bazar-header">
        <div className="bazar-container">
          <div className="bazar-header-top">
            <Link href="/" className="bazar-logo">
              <span className="bazar-logo-icon">
                🛒
              </span>

              <div>
                <div className="bazar-logo-title">
                  বাজার দর
                </div>

                <div className="bazar-logo-date">
                  ৮ অক্টোবর ২০২৬
                </div>
              </div>
            </Link>

            <div className="bazar-auth">
              <Link
                href="/signin"
                className="bazar-signin"
              >
                সাইন ইন
              </Link>

              <Link
                href="/signup"
                className="bazar-signup"
              >
                সাইন আপ
              </Link>
            </div>
          </div>

          <nav className="bazar-categories">
            <Link
              href="/"
              className="bazar-category"
            >
              সব
            </Link>

            <Link
              href="/category/chal"
              className={`bazar-category ${
                slug === "chal" ? "active" : ""
              }`}
            >
              চাল
            </Link>

            <Link
              href="/category/dal"
              className={`bazar-category ${
                slug === "dal" ? "active" : ""
              }`}
            >
              ডাল
            </Link>

            <Link
              href="/category/tel"
              className={`bazar-category ${
                slug === "tel" ? "active" : ""
              }`}
            >
              তেল
            </Link>

            <Link
              href="/category/sobji"
              className={`bazar-category ${
                slug === "sobji" ? "active" : ""
              }`}
            >
              সবজি
            </Link>

            <Link
              href="/category/mach"
              className={`bazar-category ${
                slug === "mach" ? "active" : ""
              }`}
            >
              মাছ
            </Link>

            <Link
              href="/category/mangsho"
              className={`bazar-category ${
                slug === "mangsho" ? "active" : ""
              }`}
            >
              মাংস
            </Link>

            <Link
              href="/category/dim-dui"
              className={`bazar-category ${
                slug === "dim-dui" ? "active" : ""
              }`}
            >
              ডিম-দুধ
            </Link>

            <Link
              href="/category/mosla"
              className={`bazar-category ${
                slug === "mosla" ? "active" : ""
              }`}
            >
              মসলা
            </Link>
          </nav>
        </div>
      </header>

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

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-600">
              সাজান:
            </span>

            <select
              defaultValue={sort || "default"}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 outline-none focus:border-green-600"
              onChange={(event) => {
                const value = event.target.value;

                if (value === "default") {
                  window.location.href = `/category/${slug}`;
                  return;
                }

                window.location.href = `/category/${slug}?sort=${value}`;
              }}
            >
              <option value="default">
                ডিফল্ট
              </option>

              <option value="low">
                দাম: কম থেকে বেশি
              </option>

              <option value="high">
                দাম: বেশি থেকে কম
              </option>
            </select>
          </div>
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
            {products.map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>

      <footer className="bazar-footer">
        <div className="bazar-container flex flex-col gap-3 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <div>
            <div className="bazar-footer-logo">
              🛒 বাজার দর
            </div>

            <div className="bazar-footer-text">
              বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
            </div>
          </div>

          <div className="bazar-footer-text">
            সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
          </div>
        </div>
      </footer>
    </main>
  );
}