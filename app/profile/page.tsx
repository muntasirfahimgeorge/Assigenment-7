"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!signingOut && !isPending && !session?.user) {
      router.replace("/signin?callbackUrl=/profile");
      return;
    }
  }, [session, isPending, router, signingOut]);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      const { error } = await authClient.signOut();
      if (error) {
        toast.error(error.message || "সাইন আউট করা যায়নি");
        setSigningOut(false);
        return;
      }
      toast.success("সাইন আউট হয়েছে");
      router.replace("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট করা যাচ্ছে না। পরে আবার চেষ্টা করুন।");
      setSigningOut(false);
    }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedName = (name ?? session?.user.name ?? "").trim();

    if (!trimmedName) {
      toast.error("নাম লিখুন");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.updateUser({ name: trimmedName });
      if (error) {
        toast.error(error.message || "তথ্য আপডেট করা যায়নি");
        return;
      }
      toast.success("তথ্য সফলভাবে আপডেট হয়েছে");
      await authClient.getSession();
      setName(null);
      router.refresh();
    } catch {
      toast.error("তথ্য আপডেট করা যাচ্ছে না। পরে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  if (isPending || !session?.user) {
    return (
      <main className="min-h-screen bg-[#fafbf8]">
        <div className="bazar-container py-10">
          <div className="mx-auto max-w-lg animate-pulse">
            <div className="h-8 w-40 rounded bg-gray-200" />
            <div className="mt-6 h-64 rounded-2xl bg-gray-200" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafbf8]">
      <header className="bazar-header">
        <div className="bazar-container">
          <div className="bazar-header-top">
            <Link href="/" className="bazar-logo">
              <span className="bazar-logo-icon">🛒</span>

              <div>
                <div className="bazar-logo-title">বাজার দর</div>

                <div className="bazar-logo-date">৮ অক্টোবর ২০২৬</div>
              </div>
            </Link>

            <div className="bazar-auth">
              <Link href="/" className="bazar-signin">
                হোম
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="bazar-signup border-0 cursor-pointer"
              >
                সাইন আউট
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="bazar-container py-10">
        <div className="mx-auto max-w-lg">
          <Link
            href="/"
            className="mb-6 inline-block text-sm font-semibold text-green-700"
          >
            ← হোম পেজে ফিরে যান
          </Link>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h1 className="text-2xl font-black text-gray-900">My Profile</h1>

              <p className="mt-2 text-sm text-gray-500">
                আপনার প্রোফাইলের তথ্য আপডেট করুন।
              </p>
            </div>

            <div className="mb-6 rounded-xl bg-[#f7f8f3] p-4">
              <p className="text-xs text-gray-400">ইমেইল</p>

              <p className="mt-1 text-sm font-semibold text-gray-800">
                {session.user.email}
              </p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  Name
                </label>

                <input
                  id="name"
                  type="text"
                  value={name ?? session.user.name ?? ""}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="আপনার নাম"
                  required
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-green-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "আপডেট হচ্ছে..." : "Update Information"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <footer className="bazar-footer">
        <div className="bazar-container flex flex-col gap-3 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <div>
            <div className="bazar-footer-logo">🛒 বাজার দর</div>

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
