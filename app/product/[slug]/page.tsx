import Link from "next/link";
import { Suspense } from "react";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import BazarHeader from "@/app/components/BazarHeader";
import { auth } from "@/lib/auth";
import { getProduct, Product } from "@/lib/api";

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

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <main className="product-details-page">
      <BazarHeader />
      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetails params={params} />
      </Suspense>
      <footer className="bazar-footer">
        <div className="bazar-container bazar-footer-content">
          <div>
            <div className="bazar-footer-logo">বাজার দর</div>
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

function ProductSkeleton() {
  return (
    <div
      className="bazar-container py-8"
      role="status"
      aria-label="পণ্যের তথ্য লোড হচ্ছে"
    >
      <span className="sr-only">পণ্যের তথ্য লোড হচ্ছে</span>
      <div className="h-32 rounded-xl bazar-skeleton" />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <div key={index} className="h-28 rounded-xl bazar-skeleton" />
        ))}
      </div>
      <div className="mt-8 h-64 rounded-xl bazar-skeleton" />
    </div>
  );
}

async function ProductDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let session;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    if (
      !error ||
      typeof error !== "object" ||
      !("code" in error) ||
      error.code !== "28P01"
    ) {
      throw error;
    }

    return (
      <section className="bazar-container py-16" role="alert">
        <h1 className="text-2xl font-bold">লগইন সেবা সাময়িকভাবে অনুপলব্ধ</h1>
        <p className="mt-3 text-gray-600">
          এই মুহূর্তে আপনার লগইন যাচাই করা যাচ্ছে না। পরে আবার চেষ্টা করুন।
        </p>
        <Link href="/" className="mt-6 inline-block text-green-700">
          হোম পেজে ফিরে যান
        </Link>
      </section>
    );
  }

  if (!session?.user) {
    redirect(`/signin?callbackUrl=/product/${slug}`);
  }

  let product: Product;

  try {
    product = await getProduct(slug);
  } catch {
    notFound();
  }

  const marketPrices = product.markets.flatMap((market) => [
    market.min,
    market.max,
  ]);

  const minimum = Math.min(...marketPrices);
  const maximum = Math.max(...marketPrices);

  const average =
    marketPrices.reduce((total, price) => total + price, 0) /
    marketPrices.length;

  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";

  return (
    <>
      {/* Price ticker */}
      <div className="bazar-ticker">
        <div className="bazar-ticker-inner">
          {[...product.markets.slice(0, 6), ...product.markets.slice(0, 6)].map(
            (market, index) => (
              <span key={`${market.market}-${index}`}>
                📈 {market.market} — {bn(market.min)}-{bn(market.max)} টাকা
              </span>
            ),
          )}
        </div>
      </div>

      <div className="bazar-container">
        {/* Breadcrumb */}
        <div className="product-breadcrumb">
          <Link href="/">হোম</Link>

          <span>›</span>

          <Link href={`/category/${product.category}`}>
            {product.categoryNameBn}
          </Link>

          <span>›</span>

          <span>{product.nameBn}</span>
        </div>

        {/* Product summary */}
        <section className="product-summary-card">
          <div className="product-summary-left">
            <div className="product-summary-image">{product.image}</div>

            <div>
              <div className="product-category-label">
                {product.categoryIcon} {product.categoryNameBn}
              </div>

              <h1 className="product-details-title">{product.nameBn}</h1>

              <p className="product-details-unit">
                প্রতি {unitName(product.unit)}
              </p>

              <p className="product-details-description">
                {product.nameBn} এর আজকের বাজার মূল্য ও বিভিন্ন বাজারের দাম এক
                নজরে দেখুন।
              </p>
            </div>
          </div>

          <div className="product-today-price">
            <span>আজকের দাম</span>

            <strong>{bn(product.today)}</strong>

            <small>টাকা / {unitName(product.unit)}</small>

            <div
              className={`product-price-change ${
                isUp ? "up" : isDown ? "down" : "flat"
              }`}
            >
              {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
              {bn(Math.abs(product.change.pct))}%
            </div>
          </div>
        </section>

        {/* Price summary */}
        <section className="product-price-summary">
          <h2 className="product-section-title">দামের সারসংক্ষেপ</h2>

          <div className="product-summary-grid">
            <div className="product-stat-card">
              <span className="product-stat-label">সর্বনিম্ন দাম</span>

              <strong className="product-stat-value green">
                {bn(minimum)} টাকা
              </strong>

              <small>বাজারের সর্বনিম্ন মূল্য</small>
            </div>

            <div className="product-stat-card">
              <span className="product-stat-label">সর্বোচ্চ দাম</span>

              <strong className="product-stat-value red">
                {bn(maximum)} টাকা
              </strong>

              <small>বাজারের সর্বোচ্চ মূল্য</small>
            </div>

            <div className="product-stat-card">
              <span className="product-stat-label">গড় দাম</span>

              <strong className="product-stat-value green">
                {bn(Math.round(average))} টাকা
              </strong>

              <small>সব বাজারের গড় মূল্য</small>
            </div>
          </div>
        </section>

        {/* Market table */}
        <section className="product-market-section">
          <h2 className="product-section-title">বাজারভিত্তিক আজকের দাম</h2>

          <div className="product-market-table-wrapper">
            <table className="product-market-table">
              <thead>
                <tr>
                  <th>বাজার</th>
                  <th>বিভাগ</th>
                  <th>সর্বনিম্ন</th>
                  <th>সর্বোচ্চ</th>
                  <th>গড়</th>
                </tr>
              </thead>

              <tbody>
                {product.markets.map((market) => (
                  <tr key={market.market}>
                    <td>{market.market}</td>

                    <td>{market.division}</td>

                    <td>{bn(market.min)} টাকা</td>

                    <td>{bn(market.max)} টাকা</td>

                    <td>
                      {bn(Math.round((market.min + market.max) / 2))} টাকা
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
