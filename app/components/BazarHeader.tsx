"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

const categories = [
  ["সব", ""],
  ["চাল", "chal"],
  ["ডাল", "dal"],
  ["তেল", "tel"],
  ["সবজি", "sobji"],
  ["মাছ", "mach"],
  ["মাংস", "mangsho"],
  ["ডিম-দুধ", "dim-dui"],
  ["মসলা", "mosla"],
];

export default function BazarHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("সাইন আউট হয়েছে");
          router.push("/");
          router.refresh();
        },
        onError: (context) => {
          toast.error(context.error.message || "সাইন আউট করা যায়নি");
        },
      },
    });
  }

  return (
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
            {isPending ? (
              <div className="h-8 w-24 rounded-lg bg-gray-100 animate-pulse" />
            ) : session?.user ? (
              <>
                <Link href="/profile" className="bazar-signin">
                  {session.user.name}
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="bazar-signup border-0 cursor-pointer"
                >
                  সাইন আউট
                </button>
              </>
            ) : (
              <>
                <Link href="/signin" className="bazar-signin">
                  সাইন ইন
                </Link>

                <Link href="/signup" className="bazar-signup">
                  সাইন আপ
                </Link>
              </>
            )}
          </div>
        </div>

        <nav className="bazar-categories">
          {categories.map(([name, slug]) => {
            const isActive =
              slug === "" ? pathname === "/" : pathname === `/category/${slug}`;

            return (
              <Link
                key={name}
                href={slug ? `/category/${slug}` : "/"}
                className={`bazar-category ${isActive ? "active" : ""}`}
              >
                {name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
