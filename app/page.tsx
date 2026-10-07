import Image from "next/image";
import Link from "next/link";

const navItems = [
  { label: "সব", href: "/" },
  { label: "চাল", href: "/category/chal" },
  { label: "ডাল", href: "/category/dal" },
  { label: "তেল", href: "/category/tel" },
  { label: "সবজি", href: "/category/shobji" },
  { label: "মাছ", href: "/category/mach" },
  { label: "মাংস", href: "/category/mangsho" },
];

const tickerItems = [
  "🍚 চাল — ৭২ টাকা/কেজি ▲ ২.১%",
  "🥔 আলু — ৩৮ টাকা/কেজি ▼ ১.৫%",
  "🧅 পেঁয়াজ — ৯৫ টাকা/কেজি ▲ ৩.২%",
  "🌶️ মরিচ — ২২০ টাকা/কেজি ▲ ১.৮%",
  "🐟 ইলিশ — ১,৮৫০ টাকা/কেজি ▼ ২.৯%",
  "🥚 ডিম — ১৩৫ টাকা/ডজন — ০.০%",
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Navbar */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container-main">
          <div className="flex min-h-[76px] items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex shrink-0 items-center gap-3">
              <Image
                src="/logo-icon.png"
                alt="বাজার দর"
                width={46}
                height={46}
                className="h-11 w-11 object-contain"
              />

              <div>
                <div className="text-xl font-extrabold text-green-800 sm:text-2xl">
                  বাজার দর
                </div>

                <div className="text-xs text-gray-500">
                  ৮ অক্টোবর ২০২৬
                </div>
              </div>
            </Link>

            {/* Auth */}
            <div className="flex items-center gap-2">
              <Link
                href="/signin"
                className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 sm:block"
              >
                সাইন ইন
              </Link>

              <Link
                href="/signup"
                className="rounded-lg bg-green-700 px-3 py-2 text-sm font-semibold text-white hover:bg-green-800 sm:px-4"
              >
                সাইন আপ
              </Link>
            </div>
          </div>

          {/* Category navigation */}
          <nav className="flex gap-1 overflow-x-auto border-t border-gray-100 py-2">
            {navItems.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  index === 0
                    ? "bg-green-700 text-white"
                    : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Price ticker */}
        <div className="border-t border-gray-100 bg-green-900 py-2 text-sm text-white">
          <div className="ticker-wrapper">
            <div className="ticker-track">
              {[...tickerItems, ...tickerItems].map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="mx-8 inline-block"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container-main py-10 sm:py-14 lg:py-20">
        <div className="grid items-center gap-10 overflow-hidden rounded-3xl bg-green-50 px-6 py-10 sm:px-10 lg:grid-cols-2 lg:px-14">
          <div>
            <p className="mb-3 text-sm font-bold text-green-700">
              প্রতিদিনের বাজারের সহজ সমাধান
            </p>

            <h1 className="max-w-xl text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
              আজকের বাজার দর
              <br />
              এক নজরে দেখুন
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-gray-600 sm:text-lg">
              চাল, ডাল, তেল, সবজি, মাছ ও মাংসসহ প্রয়োজনীয় পণ্যের
              সর্বশেষ বাজার মূল্য সহজেই জেনে নিন।
            </p>

            <a
              href="#সব-পণ্য"
              className="mt-7 inline-flex rounded-xl bg-green-700 px-6 py-3 font-bold text-white shadow-sm transition hover:bg-green-800"
            >
              সব পণ্য দেখুন
            </a>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <Image
              src="/bazar-hero.png"
              alt="বাজার দর"
              width={600}
              height={500}
              priority
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      </section>

      {/* Temporary sections */}
      <section className="container-main pb-16">
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-gray-900">
            আজকের বাজার
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            API থেকে পণ্যের তথ্য এখানে দেখানো হবে।
          </p>
        </div>

        <div
          id="সব-পণ্য"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-gray-200 bg-white p-5"
            >
              <div className="mb-4 flex h-28 items-center justify-center rounded-xl bg-gray-50 text-5xl">
                🛒
              </div>

              <h3 className="font-bold text-gray-900">
                পণ্যের নাম
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                প্রতি কেজি
              </p>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">আজকের দাম</p>
                  <p className="font-extrabold text-gray-900">
                    ১৪৮ টাকা
                  </p>
                </div>

                <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700">
                  ▲ ২.১%
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="container-main flex flex-col gap-3 py-7 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
          </p>

          <p>
            সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
          </p>
        </div>
      </footer>
    </main>
  );
}