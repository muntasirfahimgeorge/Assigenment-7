"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

import BazarHeader from "@/app/components/BazarHeader";
import { authClient } from "@/lib/auth-client";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.35 12.23c0-.72-.06-1.42-.18-2.09H12v3.96h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.26Z"
      />
      <path
        fill="#34A853"
        d="M12 21.99c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.29v2.53A9.74 9.74 0 0 0 12 21.99Z"
      />
      <path
        fill="#FBBC05"
        d="M6.53 14.08A5.85 5.85 0 0 1 6.23 12c0-.72.12-1.42.3-2.08V7.39H3.29A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.06 1.04 4.61l3.24-2.53Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.89c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 2.98 14.63 2 12 2a9.74 9.74 0 0 0-8.71 5.39l3.24 2.53 3.24 2.53C7.3 7.61 9.46 5.89 12 5.89Z"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5A11.5 11.5 0 0 0 8.36 22.9c.58.1.79-.25.79-.56v-2.18c-3.22.7-3.9-1.37-3.9-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.04 1.78 2.73 1.27 3.4.97.1-.76.4-1.27.74-1.56-2.57-.29-5.27-1.29-5.27-5.75 0-1.27.45-2.3 1.19-3.11-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.17 1.19a11 11 0 0 1 5.77 0c2.2-1.5 3.17-1.19 3.17-1.19.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.11 0 4.47-2.7 5.46-5.28 5.75.41.35.78 1.04.78 2.1v3.11c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const requestedCallback = searchParams.get("callbackUrl") || "/";
  const callbackUrl =
    requestedCallback.startsWith("/") &&
    !requestedCallback.startsWith("//") &&
    !requestedCallback.includes("\\") &&
    !/[\u0000-\u0020\u007f]/.test(requestedCallback)
      ? requestedCallback
      : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("ইমেইল দিন");
      return;
    }

    if (!password) {
      toast.error("পাসওয়ার্ড দিন");
      return;
    }

    setLoading(true);

    try {
      await authClient.signIn.email(
        {
          email: email.trim(),
          password,
        },
        {
          onSuccess: () => {
            toast.success("সফলভাবে সাইন ইন হয়েছে");
            router.push(callbackUrl);
            router.refresh();
          },
          onError: (context) => {
            toast.error(context.error.message || "সাইন ইন করা যায়নি");
          },
        },
      );
    } catch {
      toast.error("সাইন ইন করা যাচ্ছে না। পরে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialSignIn(provider: "google" | "github") {
    setSocialLoading(provider);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: callbackUrl,
      });
      if (error) {
        toast.error(error.message || "সাইন ইন করা যায়নি");
        setSocialLoading("");
      }
    } catch {
      toast.error(
        `${
          provider === "google" ? "Google" : "GitHub"
        } দিয়ে সাইন ইন করা যায়নি`,
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

              <h1 className="auth-title">সাইন ইন করুন</h1>

              <p className="auth-subtitle">
                আপনার বাজার দর অ্যাকাউন্টে প্রবেশ করুন
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-field">
                <label htmlFor="email">ইমেইল</label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="আপনার ইমেইল"
                  autoComplete="email"
                />
              </div>

              <div className="auth-field">
                <label htmlFor="password">পাসওয়ার্ড</label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="আপনার পাসওয়ার্ড"
                  autoComplete="current-password"
                />
              </div>

              <button type="submit" disabled={loading} className="auth-submit">
                {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
              </button>
            </form>

            <div className="auth-divider">
              <span>অথবা</span>
            </div>

            <div className="auth-social-grid">
              <button
                type="button"
                disabled={!!socialLoading}
                onClick={() => handleSocialSignIn("google")}
                className="auth-social-button"
              >
                <span className="auth-social-icon google-icon">
                  <GoogleIcon />
                </span>

                <span>Google</span>
              </button>

              <button
                type="button"
                disabled={!!socialLoading}
                onClick={() => handleSocialSignIn("github")}
                className="auth-social-button"
              >
                <span className="auth-social-icon github-icon">
                  <GithubIcon />
                </span>

                <span>GitHub</span>
              </button>
            </div>

            <p className="auth-footer-text">
              অ্যাকাউন্ট নেই? <Link href="/signup">সাইন আপ করুন</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
