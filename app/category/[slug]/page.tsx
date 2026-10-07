import Link from "next/link";
import { getCategory } from "@/lib/api";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

type CategoryData = {
  slug: string;
  nameBn: string;
  icon: string;
  products: Product[];
};

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

function ProductCard({
  product,
}: {
  product: Product;
}) {
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
              product.change.dir === "up"
                ? "bazar-change-up"
                : product.change.dir === "down"
                  ? "bazar-change-down"
                  : "bazar-change-flat"
            }`}
          >
            {product.change.dir === "up"
              ? "▲"
              : product.change.dir === "down"
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
  searchParams: Promise<{ sort?: string }>;
}) {
  const { slug } = await params;
  const { sort } = await searchParams;

  let category: CategoryData;

  try {
    category = await getCategory(slug);
  } catch {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fafbf8] px-5">
        <div className="text-center">
          <div className="text-6xl">😕</div>

          <h1 className="mt-5 text-2xl font-black">
            ক্যাটাগরি পাওয়া যায়নি
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            আপনি যে ক্যাটাগরিটি খুঁজছেন সেটি নেই।
          </p>

          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-green-700 px-5 py-3 text-sm font-bold text-white"
          >
            হোমে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  let products = [...category.products];

  if (sort === "low") {
    products.sort((a, b) => a.today - b.today);
  }

  if (sort === "high") {
    products.sort((a, b) => b.today - a.today);
  }

  return (
    <main className="min-h-screen bg-[#fafbf8]">

      {/* HEADER */}
      <header className="bazar-header">
        <div className="bazar-container">

          <div className="bazar-header-top">
            <Link
              href="/"
              className="bazar-logo"
            >
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

            {[
              ["চাল", "chal"],
              ["ডাল", "dal"],
              ["তেল", "tel"],
              ["সবজি", "sobji"],
              ["মাছ", "mach"],
              ["মাংস", "mangsho"],
              ["ডিম-দুধ", "dim-dui"],
              ["মসলা", "mosla"],
            ].map(([name, categorySlug]) => (
              <Link
                key={categorySlug}
                href={`/category/${categorySlug}`}
                className={`bazar-category ${
                  categorySlug === slug ? "active" : ""
                }`}
              >
                {name}
              </Link>
            ))}
          </nav>

        </div>
      </header>

      {/* CONTENT */}
      <div className="bazar-container py-10">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

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
              {category.nameBn} বিভাগের আজকের বাজার দর
            </p>
          </div>

          <form method="GET">
            <label className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-gray-600">
                সাজান:
              </span>

              <select
                name="sort"
                defaultValue={sort || "default"}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-green-600"
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

              <button
                type="submit"
                className="rounded-lg bg-green-700 px-4 py-2 text-sm font-bold text-white"
              >
                সাজান
              </button>
            </label>
          </form>

        </div>

        {/* EMPTY STATE */}
        {products.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-gray-200 bg-white px-5 py-16 text-center">

            <div className="text-5xl">
              📦
            </div>

            <h2 className="mt-5 text-xl font-black">
              কোনো পণ্য পাওয়া যায়নি
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য নেই।
            </p>

            <Link
              href="/"
              className="mt-6 inline-block rounded-lg bg-green-700 px-5 py-3 text-sm font-bold text-white"
            >
              সব পণ্য দেখুন
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

      {/* FOOTER */}
      <footer className="bazar-footer">
        <div className="bazar-container">

          <div className="bazar-footer-logo">
            🛒 বাজার দর
          </div>

          <div className="bazar-footer-text">
            প্রয়োজনীয় পণ্যের দাম এক নজরে
          </div>

          <div className="bazar-footer-text">
            © ২০২৬ বাজার দর
          </div>

        </div>
      </footer>

    </main>
  );
}