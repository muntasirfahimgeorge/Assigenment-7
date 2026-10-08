import Link from "next/link";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";

import { getProduct } from "@/lib/api";
import { auth } from "@/lib/auth";

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

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect(`/signin?callbackUrl=/product/${slug}`);
  }

  let product;

  try {
    product = await getProduct(slug);
  } catch {
    notFound();
  }

  if (!product) {
    notFound();
  }

  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";

  const minPrice =
    product.markets.length > 0
      ? Math.min(...product.markets.map((market) => market.min))
      : product.today;

  const maxPrice =
    product.markets.length > 0
      ? Math.max(...product.markets.map((market) => market.max))
      : product.today;

  const averagePrice =
    product.markets.length > 0
      ? product.markets.reduce(
          (total, market) =>
            total + (market.min + market.max) / 2,
          0,
        ) / product.markets.length
      : product.today;

  return (
    <main className="min-h-screen bg-[#fafbf8]">
      <header className="bazar-header">
        <div className="bazar-container">
          <div className="bazar-header-top">
            <Link href="/" className="bazar-logo">
              <span className="bazar-logo-icon">🛒</span>

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
                href="/"
                className="bazar-signin"
              >
                হোম
              </Link>

              <span className="bazar-signup">
                {session.user.name}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="bazar-container py-10">
        <Link
          href="/"
          className="mb-6 inline-block text-sm font-semibold text-green-700"
        >
          ← সব পণ্যে ফিরে যান
        </Link>

        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex min-h-[330px] items-center justify-center rounded-xl bg-[#f7f8f3] text-8xl">
              {product.image}
            </div>

            <div className="mt-6">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  {product.categoryIcon}{" "}
                  {product.categoryNameBn}
                </span>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                  প্রতি {unitName(product.unit)}
                </span>
              </div>

              <h1 className="text-3xl font-black text-gray-900">
                {product.nameBn}
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                বিভিন্ন বাজারে আজকের {product.nameBn} এর
                সম্ভাব্য বাজারদর।
              </p>

              <div className="mt-5 flex items-end justify-between gap-4">
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

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-black">
              দামের বিস্তারিত
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              বিভিন্ন বাজারের আজকের মূল্য
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
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

            <div className="mt-8">
              <h3 className="mb-3 text-base font-bold">
                বাজারভিত্তিক আজকের দাম
              </h3>

              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <div className="min-w-[620px]">
                  <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] bg-gray-50 px-4 py-3 text-xs font-bold text-gray-500">
                    <span>বাজার</span>
                    <span>বিভাগ</span>
                    <span>সর্বনিম্ন</span>
                    <span>সর্বোচ্চ</span>
                  </div>

                  {product.markets.map((market) => (
                    <div
                      key={`${market.market}-${market.division}`}
                      className="grid grid-cols-[1.5fr_1fr_1fr_1fr] border-t border-gray-100 px-4 py-3 text-sm"
                    >
                      <span className="font-semibold">
                        {market.market}
                      </span>

                      <span className="text-gray-500">
                        {market.division}
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
          </div>
        </section>
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