import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import RegistrationForm from "@/components/registration/RegistrationForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#070B14] text-[#F5F1E8]">
      <div className="mx-auto w-[92%] max-w-[1200px] py-6 sm:py-8">

        {/* Top bar */}
        <header className="flex items-center justify-between border-t border-white/15 pt-5">
          <Link
            href="/"
            className="group flex items-center gap-3 text-[10px] font-semibold tracking-[0.2em] text-white/50 transition-colors hover:text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 transition-transform group-hover:-translate-x-1">
              <ArrowLeft size={14} strokeWidth={1.5} />
            </span>

            BACK
          </Link>

          <div className="text-right">
            <p className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-[-0.04em]">
              updtcl<span className="text-[#C9A45C]">.</span>
            </p>

            <p className="hidden text-[9px] tracking-[0.18em] text-white/30 sm:block">
              T10 REGISTRATION
            </p>
          </div>
        </header>

        {/* Intro */}
        <section className="py-14 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_280px] lg:items-end">
            <div>
              <p className="mb-5 text-[10px] font-semibold tracking-[0.25em] text-[#C9A45C]">
                PLAYER REGISTRATION / 01
              </p>

              <h1 className="font-[family-name:var(--font-display)] text-[clamp(4rem,9vw,8rem)] font-medium uppercase leading-[0.78] tracking-[-0.055em]">
                Your game
                <br />
                <span className="text-white/25">starts here.</span>
              </h1>
            </div>

            <div className="border-t border-white/15 pt-5">
              <p className="text-sm leading-6 text-white/45">
                Complete your player profile to begin your updtcl T10
                registration.
              </p>
            </div>
          </div>
        </section>

        {/* Form */}
        <RegistrationForm />

        {/* Footer */}
        <footer className="mt-16 border-t border-white/10 py-6">
          <div className="flex flex-col gap-3 text-[9px] tracking-[0.15em] text-white/25 sm:flex-row sm:items-center sm:justify-between">
            <span>updtcl T10</span>
            <span>UTTAR PRADESH</span>
            <a href="tel:9981330383" className="hover:text-white/50">
              9981330383
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}