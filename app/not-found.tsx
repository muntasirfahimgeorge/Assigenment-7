import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🛒</div>

        <h1 className="text-4xl font-extrabold text-gray-900">404</h1>

        <h2 className="mt-3 text-xl font-bold text-gray-800">
          পেজটি পাওয়া যায়নি
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          আপনি যে পেজটি খুঁজছেন সেটি হয়তো আর নেই।
        </p>

        <Link
          href="/"
          className="inline-block mt-6 rounded-lg bg-green-600 px-5 py-3 text-sm font-bold text-white hover:bg-green-700"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}
