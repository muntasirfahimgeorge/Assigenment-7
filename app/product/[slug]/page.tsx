import Link from "next/link";
import { getProduct } from "@/lib/api";

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

export default async function ProductDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";

  const minPrice = Math.min(
    ...product.markets.map((market) => market.min)
  );

  const maxPrice = Math.max(
    ...product.markets.map((market) => market.max)
  );

  const averagePrice =
    product.markets.length > 0
      ? product.markets.reduce(
          (total, market) =>
            total + (market.min + market.max) / 2,
          0
        ) / product.markets.length
      : product.today;

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

        </div>
      </header>

      {/* CONTENT */}
      <div className="bazar-container py-10">

        <Link
          href="/"
          className="mb-6 inline-block text-sm font-semibold text-green-700"
        >
          ← সব পণ্যে ফিরে যান
        </Link>

        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">

          {/* PRODUCT */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex min-h-[330px] items-center justify-center rounded-xl bg-[#f7f8f3] text-8xl">
              {product.image}
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  {product.categoryNameBn}
                </span>

                <span className="text-xs text-gray-400">
                  প্রতি {unitName(product.unit)}
                </span>
              </div>

              <h1 className="text-3xl font-black text-gray-900">
                {product.nameBn}
              </h1>

              <div className="mt-5 flex items-end justify-between">
                <div>
                  <p className="text-xs text-gray-400">
                    আজকের দাম
                  </p>

                  <p className="text-3xl font-black text-gray-900">
                    {bn(product.today)} টাকা
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-sm font-bold ${
                    isUp
                      ? "bg-red-50 text-red-600"
                      : isDown
                        ? "bg-green-50 text-green-600"
                        : "bg-gray-100 text-gray-500"
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
          </div>

          {/* PRICE SUMMARY */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">

            <h2 className="text-xl font-black">
              দামের বিস্তারিত
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              বিভিন্ন বাজারের আজকের মূল্য
            </p>

            <div className="mt-6 grid grid-cols-3 gap-3">

              <div className="rounded-xl bg-[#f7f8f3] p-4">
                <p className="text-xs text-gray-400">
                  সর্বনিম্ন
                </p>

                <p className="mt-2 text-lg font-black">
                  {bn(minPrice)}
                </p>

                <p className="text-xs text-gray-400">
                  টাকা
                </p>
              </div>

              <div className="rounded-xl bg-[#f7f8f3] p-4">
                <p className="text-xs text-gray-400">
                  সর্বোচ্চ
                </p>

                <p className="mt-2 text-lg font-black">
                  {bn(maxPrice)}
                </p>

                <p className="text-xs text-gray-400">
                  টাকা
                </p>
              </div>

              <div className="rounded-xl bg-[#f7f8f3] p-4">
                <p className="text-xs text-gray-400">
                  গড়
                </p>

                <p className="mt-2 text-lg font-black">
                  {bn(Math.round(averagePrice))}
                </p>

                <p className="text-xs text-gray-400">
                  টাকা
                </p>
              </div>

            </div>

            {/* MARKET TABLE */}
            <div className="mt-8">

              <h3 className="mb-3 text-base font-bold">
                বাজারভিত্তিক দাম
              </h3>

              <div className="overflow-hidden rounded-xl border border-gray-200">

                <div className="grid grid-cols-3 bg-gray-50 px-4 py-3 text-xs font-bold text-gray-500">
                  <span>বাজার</span>
                  <span>সর্বনিম্ন</span>
                  <span>সর্বোচ্চ</span>
                </div>

                {product.markets.map((market) => (
                  <div
                    key={market.market}
                    className="grid grid-cols-3 border-t border-gray-100 px-4 py-3 text-sm"
                  >
                    <span className="font-semibold">
                      {market.market}
                    </span>

                    <span>
                      {bn(market.min)} টাকা
                    </span>

                    <span>
                      {bn(market.max)} টাকা
                    </span>
                  </div>
                ))}

              </div>

            </div>

          </div>

        </section>

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