import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fafbf8] px-5">
      <div className="text-center">

        <div className="text-7xl">
          404
        </div>

        <h1 className="mt-5 text-2xl font-black text-gray-900">
          পেজটি পাওয়া যায়নি
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          আপনি যে পেজটি খুঁজছেন সেটি নেই অথবা সরিয়ে ফেলা হয়েছে।
        </p>

        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-green-700 px-6 py-3 text-sm font-bold text-white"
        >
          হোমে ফিরে যান
        </Link>

      </div>
    </main>
  );
}import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fafbf8] px-5">
      <div className="text-center">

        <div className="text-7xl">
          404
        </div>

        <h1 className="mt-5 text-2xl font-black text-gray-900">
          পেজটি পাওয়া যায়নি
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          আপনি যে পেজটি খুঁজছেন সেটি নেই অথবা সরিয়ে ফেলা হয়েছে।
        </p>

        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-green-700 px-6 py-3 text-sm font-bold text-white"
        >
          হোমে ফিরে যান
        </Link>

      </div>
    </main>
  );
}