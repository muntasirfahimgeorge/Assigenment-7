import Image from "next/image";
import Link from "next/link";
import { getProducts, Product } from "@/lib/api";
import BazarHeader from "@/app/components/BazarHeader";

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

function ProductCard({ product }: { product: Product }) {
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

export default async function Home() {
  const products = await getProducts();

  const rising = products
    .filter((product) => product.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  const falling = products
    .filter((product) => product.change.dir === "down")
    .sort((a, b) => a.change.pct - b.change.pct)
    .slice(0, 6);

  const tickerProducts = [...products, ...products];

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <BazarHeader />

      <div className="bazar-ticker">
        <div className="bazar-ticker-inner">
          {tickerProducts.map((product, index) => (
            <span key={`${product.id}-${index}`}>
              {product.image} {product.nameBn} —{" "}
              {bn(product.today)} টাকা/
              {unitName(product.unit)}{" "}
              {product.change.dir === "up"
                ? `▲ ${bn(Math.abs(product.change.pct))}%`
                : product.change.dir === "down"
                  ? `▼ ${bn(Math.abs(product.change.pct))}%`
                  : "— ০%"}
            </span>
          ))}
        </div>
      </div>

      <div className="bazar-container">
        <section className="bazar-hero">
          <div className="bazar-hero-text">
            <p className="bazar-eyebrow">
              প্রতিদিনের বাজারের সহজ সমাধান
            </p>

            <h1 className="bazar-hero-title">
              আজকের বাজার দর
              <br />
              এক নজরে দেখুন
            </h1>

            <p className="bazar-hero-description">
              প্রয়োজনীয় পণ্যের সর্বশেষ বাজার মূল্য
              সহজেই দেখে নিন।
            </p>

            <a
              href="#সব-পণ্য"
              className="bazar-hero-button"
            >
              সব পণ্য দেখুন
            </a>
          </div>

          <div className="bazar-hero-image">
            <Image
              src="/bazar-hero.png"
              alt="বাজার দর"
              width={390}
              height={290}
              priority
            />
          </div>
        </section>

        <section className="bazar-section">
          <div className="bazar-section-header">
            <h2 className="bazar-section-title">
              আজ দাম বেড়েছে{" "}
              <span className="text-red-500">▲</span>
            </h2>

            <p className="bazar-section-subtitle">
              যেসব পণ্যের দাম আজ বেড়েছে
            </p>
          </div>

          <div className="bazar-product-grid bazar-product-grid-small">
            {rising.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </section>

        <section className="bazar-section">
          <div className="bazar-section-header">
            <h2 className="bazar-section-title">
              আজ দাম কমেছে{" "}
              <span className="text-green-600">▼</span>
            </h2>

            <p className="bazar-section-subtitle">
              যেসব পণ্যের দাম আজ কমেছে
            </p>
          </div>

          <div className="bazar-product-grid bazar-product-grid-small">
            {falling.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </section>

        <section
          id="সব-পণ্য"
          className="bazar-section"
        >
          <div className="bazar-section-header">
            <h2 className="bazar-section-title">
              সব পণ্য
            </h2>

            <p className="bazar-section-subtitle">
              প্রয়োজনীয় সব পণ্যের আজকের বাজার মূল্য
            </p>
          </div>

          <div className="bazar-product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </section>
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
            সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর
            নির্ভর করে পরিবর্তিত হয়।
          </p>
        </div>
      </footer>
    </main>
  );
}