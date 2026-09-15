"use client";

import { useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "REGISTER",
    short: "Start here.",
    description:
      "Complete your player registration with your details, category and district.",
  },
  {
    number: "02",
    title: "VERIFY",
    short: "Get confirmed.",
    description:
      "Your registration is reviewed so your player profile is ready for the league.",
  },
  {
    number: "03",
    title: "REPRESENT",
    short: "Wear your district.",
    description:
      "Step onto the league stage representing your district and your game.",
  },
  {
    number: "04",
    title: "PLAY",
    short: "Make it count.",
    description:
      "Compete in the T10 format and make your performance part of the season.",
  },
];

export default function HowItWorks() {
  const [active, setActive] = useState(0);

  const current = steps[active];

  return (
    <section
      id="how-it-works"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#11120F] text-[#F4F2EC]"
    >
      <div className="mx-auto w-full max-w-[1500px] px-6 py-16 sm:px-10 lg:px-16">

        {/* ================================================
            HEADER
        ================================================= */}

        <div className="flex items-center justify-between border-b border-white/10 pb-5">

          <div className="flex items-center gap-3">

            <span className="size-1.5 rounded-full bg-[#C9A45C]" />

            <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/45">
              The Process
            </span>

          </div>

          <span className="text-[9px] tracking-[0.15em] text-white/25">
            02 / 04
          </span>

        </div>


        {/* ================================================
            MAIN
        ================================================= */}

        <div className="grid min-h-[570px] grid-cols-1 lg:grid-cols-[0.75fr_1.25fr]">

          {/* LEFT */}

          <div className="flex flex-col justify-between border-b border-white/10 py-14 lg:border-b-0 lg:border-r lg:py-20 lg:pr-16">

            <div>

              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#C9A45C]">
                Your journey
              </p>

             <h2
  className={`
mt-8
    max-w-[430px]
    font-[family-name:var(--font-display)]
    text-[clamp(4rem,7vw,7rem)]
    font-bold
    uppercase
    leading-[0.78]
    tracking-[-0.055em]
  `}
>
                Four
                <br />
                steps.
              </h2>

            </div>


            {/* Dynamic number */}

            <div className="mt-12">

              <span className="font-[family-name:var(--font-display)] text-[clamp(7rem,13vw,12rem)] font-black leading-none tracking-[-0.07em] text-white/[0.06]">
                {current.number}
              </span>

            </div>

          </div>


          {/* RIGHT */}

          <div className="flex flex-col justify-between py-14 lg:py-20 lg:pl-20">

            {/* Active content */}

            <div>

              <div className="flex items-center gap-4">

                <span className="font-[family-name:var(--font-display)] text-[13px] font-bold text-[#C9A45C]">
                  {current.number}
                </span>

                <span className="h-px w-8 bg-white/15" />

                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">
                  {current.short}
                </span>

              </div>


              <h3
                key={current.title}
                className={`
                  mt-7
                  font-[family-name:var(--font-display)]
                  text-[clamp(3.5rem,6vw,6.5rem)]
                  font-medium
                  uppercase
                  leading-[0.82]
                  tracking-[-0.045em]
                  animate-[fadeIn_350ms_ease-out]
                `}
              >
                {current.title}
              </h3>


              <p
                key={current.description}
                className={`
                  mt-8
                  max-w-[440px]
                  text-[13px]
                  leading-[1.8]
                  text-white/45
                  animate-[fadeIn_450ms_ease-out]
                `}
              >
                {current.description}
              </p>

            </div>


            {/* Step navigation */}

            <div className="mt-14 border-t border-white/10">

              {steps.map((step, index) => {

                const isActive = active === index;

                return (
                  <button
                    key={step.number}
                    type="button"
                    onClick={() => setActive(index)}
                    className={`
                      group
                      flex
                      min-h-[72px]
                      w-full
                      items-center
                      justify-between
                      border-b
                      border-white/10
                      text-left
                    `}
                  >

                    <div className="flex items-center gap-6">

                      <span
                        className={`
                          font-[family-name:var(--font-display)]
                          text-[12px]
                          font-bold
                          transition-colors
                          duration-300
                          ${
                            isActive
                              ? "text-[#C9A45C]"
                              : "text-white/20"
                          }
                        `}
                      >
                        {step.number}
                      </span>

                      <span
                        className={`
                          font-[family-name:var(--font-display)]
                          text-[22px]
                          font-semibold
                          uppercase
                          tracking-[-0.01em]
                          transition-all
                          duration-300
                          ${
                            isActive
                              ? "translate-x-2 text-white"
                              : "text-white/25 group-hover:text-white/55"
                          }
                        `}
                      >
                        {step.title}
                      </span>

                    </div>


                    <ArrowRight
                      size={16}
                      strokeWidth={1.4}
                      className={`
                        transition-all
                        duration-300
                        ${
                          isActive
                            ? "translate-x-0 text-[#C9A45C]"
                            : "-translate-x-2 text-white/10 group-hover:translate-x-0 group-hover:text-white/30"
                        }
                      `}
                    />

                  </button>

                );

              })}

            </div>


            {/* CTA */}

            <div className="flex items-center justify-between pt-7">

              <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-white/20">
                Entry fee · ₹999
              </span>

              <a
                href="/register"
                className={`
                  group
                  flex
                  items-center
                  gap-3
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                `}
              >

                <span className="border-b border-white/20 pb-2">
                  Begin registration
                </span>

                <ArrowUpRight
                  size={14}
                  strokeWidth={1.5}
                  className="text-[#C9A45C] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />

              </a>

            </div>

          </div>

        </div>

      </div>


      {/* Animation */}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </section>
  );
}