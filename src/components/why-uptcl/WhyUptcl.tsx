"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

const chapters = [
  {
    number: "01",
    label: "THE CHANCE",
    title: "It starts with\nan opportunity.",
    description:
      "Every player needs a stage. UPTCL brings district cricket into one competitive platform where you get the chance to step forward.",
    word: "ENTER",
  },
  {
    number: "02",
    label: "THE TEST",
    title: "Then,\nyou compete.",
    description:
      "Talent means more when it is tested. Represent your district, face competition and discover what your game can really do.",
    word: "COMPETE",
  },
  {
    number: "03",
    label: "THE MOMENT",
    title: "And your\ngame speaks.",
    description:
      "Performance creates possibilities. Every innings, every spell and every moment becomes part of your journey.",
    word: "RISE",
  },
];

export default function WhyUptcl() {
  const [active, setActive] = useState(0);
  const chapter = chapters[active];

  return (
    <section
      id="why-uptcl"
      className="relative min-h-[100svh] overflow-hidden bg-[#F4F2EC] text-[#11120F]"
    >
      <div className="mx-auto flex min-h-[100svh] w-[90%] max-w-[1450px] flex-col py-7 sm:py-9 lg:py-10">

        {/* Header */}
        <div className="flex items-center justify-between border-t border-[#11120F]/15 pt-4">
          <div className="flex items-center gap-4">
            <span className="font-[family-name:var(--font-display)] text-xs font-semibold tracking-[0.2em] text-[#A9473C]">
              04
            </span>

            <span className="text-[10px] font-semibold tracking-[0.22em] text-[#11120F]/45">
              WHY UPTCL
            </span>
          </div>

          <span className="hidden text-[10px] tracking-[0.2em] text-[#11120F]/30 sm:block">
            YOUR GAME / YOUR STAGE
          </span>
        </div>

        {/* Intro */}
        <div className="grid gap-8 py-12 sm:py-14 lg:grid-cols-[1fr_auto] lg:items-end lg:py-16">
          <div>
            <p className="mb-5 text-[10px] font-semibold tracking-[0.22em] text-[#11120F]/40">
              THE STORY
            </p>

            <h2 className="max-w-[900px] font-[family-name:var(--font-display)] text-[clamp(3.7rem,7vw,7.5rem)] font-medium uppercase leading-[0.82] tracking-[-0.05em]">
              You bring
              <br />
              <span className="text-[#11120F]/25">the game.</span>
            </h2>
          </div>

          <p className="max-w-[270px] text-sm leading-6 text-[#11120F]/50 lg:pb-2">
            UPTCL brings the stage.
            <br />
            What happens next is up to you.
          </p>
        </div>

        {/* Story */}
        <div className="flex flex-1 flex-col justify-end">

          {/* Main story panel */}
          <div className="relative grid min-h-[310px] overflow-hidden border-y border-[#11120F]/15 lg:grid-cols-[0.8fr_1.2fr]">

            {/* Giant background word */}
            <div
              key={chapter.word}
              className="pointer-events-none absolute -bottom-8 right-[-2%] select-none font-[family-name:var(--font-display)] text-[clamp(9rem,22vw,23rem)] font-bold uppercase leading-none tracking-[-0.08em] text-[#11120F]/[0.035]"
            >
              {chapter.word}
            </div>

            {/* Number */}
            <div className="relative flex items-start border-b border-[#11120F]/10 py-7 lg:border-b-0 lg:border-r lg:py-9">
              <span className="font-[family-name:var(--font-display)] text-[clamp(5rem,10vw,9rem)] font-medium leading-none tracking-[-0.06em] text-[#11120F]/10">
                {chapter.number}
              </span>
            </div>

            {/* Content */}
            <div
              key={`${chapter.number}-content`}
              className="why-content relative flex flex-col justify-between py-8 lg:px-12 lg:py-9"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-[0.22em] text-[#A9473C]">
                  {chapter.label}
                </span>

                <span className="text-[10px] tracking-[0.2em] text-[#11120F]/30">
                  0{active + 1} / 03
                </span>
              </div>

              <div className="mt-10">
                <h3 className="whitespace-pre-line font-[family-name:var(--font-display)] text-[clamp(2.6rem,5vw,5.2rem)] font-medium uppercase leading-[0.87] tracking-[-0.04em]">
                  {chapter.title}
                </h3>

                <p className="mt-6 max-w-[520px] text-sm leading-6 text-[#11120F]/50">
                  {chapter.description}
                </p>
              </div>
            </div>
          </div>

          {/* Story navigation */}
          <div className="grid grid-cols-3 border-b border-[#11120F]/15">
            {chapters.map((item, index) => {
              const isActive = active === index;

              return (
                <button
                  key={item.number}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`group relative min-h-[76px] border-r border-[#11120F]/10 px-3 text-left transition-all last:border-r-0 sm:min-h-[88px] sm:px-5 ${
                    isActive
                      ? "bg-[#11120F] text-[#F4F2EC]"
                      : "text-[#11120F]/40 hover:bg-[#11120F]/5 hover:text-[#11120F]"
                  }`}
                >
                  <div className="flex h-full items-center justify-between gap-3">
                    <div className="flex items-center gap-3 sm:gap-5">
                      <span className="font-[family-name:var(--font-display)] text-sm">
                        {item.number}
                      </span>

                      <span className="text-[9px] font-semibold tracking-[0.16em] sm:text-[10px] sm:tracking-[0.2em]">
                        {item.label}
                      </span>
                    </div>

                    <ArrowUpRight
                      size={15}
                      strokeWidth={1.4}
                      className={`transition-transform ${
                        isActive
                          ? "translate-x-0 -translate-y-0"
                          : "group-hover:-translate-y-1 group-hover:translate-x-1"
                      }`}
                    />
                  </div>

                  {/* Progress */}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] transition-all duration-500 ${
                      isActive ? "w-full bg-[#C9A45C]" : "w-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Bottom line */}
          <div className="flex items-center justify-between pt-5">
            <span className="text-[9px] tracking-[0.2em] text-[#11120F]/30 sm:text-[10px]">
              DISTRICT • COMPETITION • PERFORMANCE
            </span>

            <span className="hidden text-[10px] tracking-[0.2em] text-[#11120F]/30 sm:block">
              KEEP GOING →
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .why-content {
          animation: storyIn 450ms ease-out;
        }

        @keyframes storyIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .why-content {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}