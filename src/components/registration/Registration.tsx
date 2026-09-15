import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Registration() {
  return (
    <section
      id="register"
      className="relative min-h-[100svh] overflow-hidden bg-[#070B14] text-[#F5F1E8]"
    >
      <div className="mx-auto flex min-h-[100svh] w-[90%] max-w-[1450px] flex-col py-7 sm:py-9 lg:py-10">

        {/* Header */}
        <div className="flex items-center justify-between border-t border-white/15 pt-4">
          <div className="flex items-center gap-4">
            <span className="font-[family-name:var(--font-display)] text-xs font-semibold tracking-[0.2em] text-[#C9A45C]">
              05
            </span>

            <span className="text-[10px] font-semibold tracking-[0.22em] text-white/45">
              REGISTRATION
            </span>
          </div>

          <span className="hidden text-[10px] tracking-[0.2em] text-white/30 sm:block">
            UPTCL T20
          </span>
        </div>

        {/* Main */}
        <div className="flex flex-1 flex-col justify-center py-14 lg:py-20">
          <div className="grid items-end gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-24">

            {/* Statement */}
            <div>
              <p className="mb-7 text-[10px] font-semibold tracking-[0.24em] text-white/35">
                YOUR NEXT CHAPTER
              </p>

              <h2 className="font-[family-name:var(--font-display)] text-[clamp(4.2rem,9vw,10rem)] font-medium uppercase leading-[0.78] tracking-[-0.06em]">
                The stage
                <br />
                <span className="text-white/30">is ready.</span>
              </h2>

              <p className="mt-8 max-w-[430px] text-sm leading-6 text-white/45">
                Your district. Your game. Your opportunity to compete.
              </p>
            </div>

            {/* Registration panel */}
            <div className="border-t border-white/15 lg:border-l lg:border-t-0 lg:pl-12">
              <div className="flex items-start justify-between pt-7 lg:pt-0">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.2em] text-white/35">
                    REGISTRATION FEE
                  </p>

                  <p className="mt-3 font-[family-name:var(--font-display)] text-[clamp(4rem,7vw,7rem)] font-medium leading-none tracking-[-0.05em]">
                    ₹999
                  </p>
                </div>

                <span className="mt-1 text-[10px] tracking-[0.18em] text-[#C9A45C]">
                  OPEN
                </span>
              </div>

              <div className="mt-10 border-t border-white/10">
                <div className="flex items-center justify-between border-b border-white/10 py-5">
                  <span className="text-[10px] tracking-[0.18em] text-white/35">
                    01
                  </span>
                  <span className="text-xs text-white/65">
                    Player details
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 py-5">
                  <span className="text-[10px] tracking-[0.18em] text-white/35">
                    02
                  </span>
                  <span className="text-xs text-white/65">
                    Playing speciality
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 py-5">
                  <span className="text-[10px] tracking-[0.18em] text-white/35">
                    03
                  </span>
                  <span className="text-xs text-white/65">
                    District &amp; state
                  </span>
                </div>
              </div>

              <Link
                href="/register"
                className="group mt-8 flex w-full items-center justify-between border border-[#C9A45C]/60 px-5 py-4 transition-all duration-300 hover:bg-[#C9A45C] hover:text-[#070B14]"
              >
                <span className="text-[10px] font-bold tracking-[0.2em]">
                  START REGISTRATION
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-current transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                  <ArrowUpRight size={16} strokeWidth={1.5} />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex items-center justify-between border-t border-white/15 pt-5">
          <span className="text-[9px] tracking-[0.2em] text-white/25 sm:text-[10px]">
            UTTAR PRADESH DISTRICT TENNIS CRICKET LEAGUE
          </span>

          <span className="hidden text-[10px] tracking-[0.2em] text-white/25 sm:block">
            9981330383
          </span>
        </div>
      </div>
    </section>
  );
}