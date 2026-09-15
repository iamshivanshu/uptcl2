"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError || !data.user) {
        setError("Invalid email or password.");
        return;
      }

      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

      if (
        profileError ||
        !profile ||
        profile.role !== "ADMIN"
      ) {
        await supabase.auth.signOut();
        setError("You do not have admin access.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch (error) {
      console.error("Admin login error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#070B14] text-[#F5F1E8]">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Brand side */}
        <section className="hidden border-r border-white/10 lg:flex lg:flex-col lg:justify-between lg:p-12">
          <div>
            <p className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-[-0.05em]">
              updtcl<span className="text-[#C9A45C]">.</span>
            </p>

            <p className="mt-2 text-[9px] tracking-[0.2em] text-white/30">
              ADMINISTRATION
            </p>
          </div>

          <div>
            <p className="mb-5 text-[9px] font-semibold tracking-[0.2em] text-[#C9A45C]">
              updtcl T10
            </p>

            <h1 className="font-[family-name:var(--font-display)] text-[clamp(4rem,7vw,7rem)] font-medium uppercase leading-[0.82] tracking-[-0.05em]">
              League
              <br />
              control.
            </h1>

            <p className="mt-7 max-w-sm text-sm leading-6 text-white/40">
              Secure access to player registrations
              and payment status.
            </p>
          </div>

          <p className="text-[9px] tracking-[0.15em] text-white/20">
            updtcl T10 / ADMIN PORTAL
          </p>
        </section>

        {/* Login side */}
        <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
          <div className="w-full max-w-[420px]">

            {/* Mobile logo */}
            <div className="mb-16 lg:hidden">
              <p className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-[-0.05em]">
                updtcl<span className="text-[#C9A45C]">.</span>
              </p>

              <p className="mt-1 text-[9px] tracking-[0.2em] text-white/30">
                ADMINISTRATION
              </p>
            </div>

            <div className="border-t border-white/15 pt-5">
              <p className="text-[9px] font-semibold tracking-[0.2em] text-[#C9A45C]">
                ADMIN ACCESS
              </p>

              <h2 className="mt-3 font-[family-name:var(--font-display)] text-5xl font-medium uppercase leading-none tracking-[-0.04em]">
                Sign in
              </h2>

              <p className="mt-4 text-sm leading-6 text-white/35">
                Access the updtcl registration dashboard.
              </p>
            </div>

            <form
              onSubmit={handleLogin}
              className="mt-12"
            >
              <div className="border-t border-white/10">

                {/* Email */}
                <div className="border-b border-white/10 py-5">
                  <label
                    htmlFor="email"
                    className="mb-3 block text-[9px] font-semibold tracking-[0.18em] text-white/30"
                  >
                    EMAIL
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="admin@example.com"
                    autoComplete="email"
                    required
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20"
                  />
                </div>

                {/* Password */}
                <div className="border-b border-white/10 py-5">
                  <label
                    htmlFor="password"
                    className="mb-3 block text-[9px] font-semibold tracking-[0.18em] text-white/30"
                  >
                    PASSWORD
                  </label>

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-5 border border-[#A9473C]/30 bg-[#A9473C]/10 px-4 py-3">
                  <p className="text-xs text-[#D98276]">
                    {error}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group mt-7 flex w-full items-center justify-between bg-[#F5F1E8] px-5 py-4 text-[10px] font-bold tracking-[0.18em] text-[#070B14] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>
                  {loading ? "AUTHENTICATING..." : "SIGN IN"}
                </span>

                <ArrowRight
                  size={16}
                  strokeWidth={1.5}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </form>

            <p className="mt-8 text-center text-[9px] tracking-[0.12em] text-white/20">
              AUTHORIZED ADMINISTRATORS ONLY
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}