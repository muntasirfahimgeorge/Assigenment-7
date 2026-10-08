"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const callbackUrl =
    searchParams.get("callbackUrl") || "/";

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("ইমেইল লিখুন");
      return;
    }

    if (!password) {
      toast.error("পাসওয়ার্ড লিখুন");
      return;
    }

    setLoading(true);

    const { error } = await authClient.signIn.email({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      toast.error(
        error.message || "সাইন ইন করা যায়নি",
      );
      return;
    }

    toast.success("সফলভাবে সাইন ইন হয়েছে");

    router.push(callbackUrl);
    router.refresh();
  }

  async function handleGoogle() {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });
    } catch {
      toast.error("Google দিয়ে সাইন ইন করা যায়নি");
    }
  }

  async function handleGithub() {
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: callbackUrl,
      });
    } catch {
      toast.error("GitHub দিয়ে সাইন ইন করা যায়নি");
    }
  }

  return (
    <main className="min-h-screen bg-[#f8faf9] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="block text-center text-2xl font-extrabold text-green-700"
        >
          🛒 বাজার দর
        </Link>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-gray-900">
              সাইন ইন
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              আপনার অ্যাকাউন্টে প্রবেশ করুন
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleGoogle}
              className="rounded-lg border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Google
            </button>

            <button
              type="button"
              onClick={handleGithub}
              className="rounded-lg border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              GitHub
            </button>
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />

            <span className="text-xs text-gray-400">
              অথবা
            </span>

            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                ইমেইল
              </label>

              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="আপনার ইমেইল"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                পাসওয়ার্ড
              </label>

              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="আপনার পাসওয়ার্ড"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-600 py-2.5 text-sm font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "সাইন ইন হচ্ছে..."
                : "সাইন ইন"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            অ্যাকাউন্ট নেই?{" "}
            <Link
              href="/signup"
              className="font-bold text-green-600 hover:underline"
            >
              সাইন আপ করুন
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}