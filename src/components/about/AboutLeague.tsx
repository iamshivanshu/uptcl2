"use client";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

const points = [
  {
    number: "01",
    title: "DISTRICT",
    headline: "Represent where you play.",
    description:
      "Bring your district identity to a league built around competitive tennis cricket.",
  },
  {
    number: "02",
    title: "COMPETE",
    headline: "Play on a bigger stage.",
    description:
      "Step into a structured T20 environment designed for players who want to compete.",
  },
  {
    number: "03",
    title: "RISE",
    headline: "Make your game count.",
    description:
      "Perform, build your presence and make your season one to remember.",
  },
];

export default function AboutLeague() {
  const [active, setActive] = useState(0);

  const current = points[active];

  return (
    <section
      id="league"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#F4F2EC] text-[#11120F]"
    >
      <div className="relative mx-auto flex w-full max-w-7xl flex-col px-6 py-20 sm:px-8 lg:px-12 xl:px-16">
        {/* Top line */}
        <div className="mb-10 flex items-center justify-between border-b border-black/10 pb-5 lg:mb-14">
          <div className="flex items-center gap-3">
            <span className="size-1.5 rounded-full bg-[#A9473C]" />
            <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-black/45">
              The League
            </span>
          </div>

          <span className="text-[9px] font-medium tracking-[0.15em] text-black/30">
            01 / 03
          </span>
        </div>

        {/* Main content */}
        <div className="grid min-h-[560px] grid-cols-1 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Left editorial column */}
          <div className="flex flex-col justify-between border-b border-black/10 pb-12 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-16">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#A9473C]">
                UPTCL T20
              </p>

              <h2 className="mt-7 max-w-[430px] font-[family-name:var(--font-display)] text-[clamp(4rem,7vw,7rem)] font-bold uppercase leading-[0.78] tracking-[-0.055em]">
                More
                <br />
                than
                <br />
                cricket.
              </h2>
            </div>

            <div className="mt-12 flex items-end justify-between lg:mt-0">
              <div>
                <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-black/30">
                  Uttar Pradesh
                </p>

                <p className="mt-2 text-[11px] text-black/45">
                  District Tennis Cricket League
                </p>
              </div>

              <span className="font-[family-name:var(--font-display)] text-[54px] font-bold leading-none tracking-[-0.05em] text-black/[0.08]">
                01
              </span>
            </div>
          </div>

          {/* Right interactive area */}
          <div className="flex flex-col justify-between pt-14 lg:pl-20 lg:pt-0">
            {/* Dynamic headline */}
            <div>
              <div key={current.number} className="animate-[fadeIn_400ms_ease-out]">
                <span className="font-[family-name:var(--font-display)] text-[14px] font-bold text-[#A9473C]">
                  {current.number}
                </span>

                <h3 className="mt-6 max-w-[750px] font-[family-name:var(--font-display)] text-[clamp(3rem,5.5vw,6rem)] font-medium uppercase leading-[0.88] tracking-[-0.045em]">
                  {current.headline}
                </h3>

                <p className="mt-7 max-w-[430px] text-[13px] leading-[1.75] text-black/45">
                  {current.description}
                </p>
              </div>
            </div>

            {/* Interactive navigation */}
            <div className="mt-14 border-t border-black/10">
              {points.map((point, index) => {
                const isActive = index === active;

                return (
                  <button
                    key={point.number}
                    type="button"
                    onClick={() => setActive(index)}
                    className="group flex min-h-[76px] w-full items-center justify-between border-b border-black/10 text-left"
                  >
                    <div className="flex items-center gap-6">
                      <span
                        className={`font-[family-name:var(--font-display)] text-[12px] font-bold transition-colors duration-300 ${
                          isActive ? "text-[#A9473C]" : "text-black/25"
                        }`}
                      >
                        {point.number}
                      </span>

                      <span
                        className={`font-[family-name:var(--font-display)] text-[25px] font-semibold uppercase tracking-[-0.01em] transition-all duration-300 ${
                          isActive
                            ? "translate-x-2 text-[#11120F]"
                            : "text-black/30 group-hover:text-black/60"
                        }`}
                      >
                        {point.title}
                      </span>
                    </div>

                    <span
                      className={`flex size-9 items-center justify-center rounded-full border transition-all duration-300 ${
                        isActive
                          ? "border-[#A9473C] bg-[#A9473C] text-white"
                          : "border-black/10 text-black/25"
                      }`}
                    >
                      <ArrowUpRight
                        size={14}
                        strokeWidth={1.5}
                        className={`transition-transform duration-300 ${
                          isActive ? "rotate-0" : "rotate-[-45deg]"
                        }`}
                      />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom metadata */}
            <div className="flex items-center justify-between pt-7">
              <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-black/25">
                2026 Season
              </span>

              <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-black/25">
                Uttar Pradesh
              </span>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}