"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

import BazarHeader from "@/app/components/BazarHeader";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      toast.error("নাম দিন");
      return;
    }

    if (!trimmedEmail) {
      toast.error("ইমেইল দিন");
      return;
    }

    if (password.length < 8) {
      toast.error(
        "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে",
      );
      return;
    }

    setLoading(true);

    await authClient.signUp.email(
      {
        name: trimmedName,
        email: trimmedEmail,
        password,
      },
      {
        onSuccess: () => {
          toast.success(
            "অ্যাকাউন্ট তৈরি হয়েছে। এখন সাইন ইন করুন।",
          );

          router.push("/signin");
        },

        onError: (context) => {
          toast.error(
            context.error.message ||
              "সাইন আপ করা যায়নি",
          );
        },
      },
    );

    setLoading(false);
  }

  async function handleSocialSignUp(
    provider: "google" | "github",
  ) {
    setSocialLoading(provider);

    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch {
      toast.error(
        `${provider === "google" ? "Google" : "GitHub"} দিয়ে সাইন আপ করা যায়নি`,
      );

      setSocialLoading("");
    }
  }

  return (
    <main className="min-h-screen bg-[#fafbf8]">
      <BazarHeader />

      <div className="bazar-container">
        <div className="auth-page">
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-icon">🛒</div>

              <h1 className="auth-title">
                অ্যাকাউন্ট তৈরি করুন
              </h1>

              <p className="auth-subtitle">
                বাজার দর-এর সাথে যুক্ত হতে সাইন আপ করুন
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="auth-form"
            >
              <div className="auth-field">
                <label htmlFor="name">
                  নাম
                </label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="আপনার নাম"
                  autoComplete="name"
                />
              </div>

              <div className="auth-field">
                <label htmlFor="email">
                  ইমেইল
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="আপনার ইমেইল"
                  autoComplete="email"
                />
              </div>

              <div className="auth-field">
                <label htmlFor="password">
                  পাসওয়ার্ড
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="কমপক্ষে ৮ অক্ষর"
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="auth-submit"
              >
                {loading
                  ? "অ্যাকাউন্ট তৈরি হচ্ছে..."
                  : "সাইন আপ"}
              </button>
            </form>

            <div className="auth-divider">
              <span>অথবা</span>
            </div>

            <div className="auth-social-grid">
              <button
                type="button"
                disabled={!!socialLoading}
                onClick={() =>
                  handleSocialSignUp("google")
                }
                className="auth-social-button"
              >
                {socialLoading === "google"
                  ? "লোড হচ্ছে..."
                  : "Google দিয়ে সাইন আপ"}
              </button>

              <button
                type="button"
                disabled={!!socialLoading}
                onClick={() =>
                  handleSocialSignUp("github")
                }
                className="auth-social-button"
              >
                {socialLoading === "github"
                  ? "লোড হচ্ছে..."
                  : "GitHub দিয়ে সাইন আপ"}
              </button>
            </div>

            <p className="auth-footer-text">
              ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
              <Link href="/signin">
                সাইন ইন করুন
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}