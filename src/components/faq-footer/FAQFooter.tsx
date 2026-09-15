"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Who can register?",
    answer:
      "Players can register under the available updtcl age groups: Under 19, Under 23, and Above 23.",
  },
  {
    question: "What is the registration fee?",
    answer:
      "The registration fee for updtcl T10 is ₹999.",
  },
  {
    question: "What information is required?",
    answer:
      "Registration requires your name, date of birth, age group, playing speciality, email, mobile number, district, state, and photograph.",
  },
  {
    question: "What playing specialities are available?",
    answer:
      "You can register as a Batsman, Bowler, All-rounder, or Wicketkeeper.",
  },
  {
    question: "How do I register?",
    answer:
      "Start your registration from the button above and complete the required player information.",
  },
];

export default function FAQFooter() {
  const [active, setActive] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActive((current) => (current === index ? null : index));
  };

  return (
    <section
      id="faq"
      className="bg-[#F4F2EC] text-[#11120F]"
    >
      <div className="mx-auto w-[90%] max-w-[1450px]">

        {/* Section header */}
        <div className="flex items-center justify-between border-t border-[#11120F]/15 py-5">
          <div className="flex items-center gap-4">
            <span className="font-[family-name:var(--font-display)] text-xs font-semibold tracking-[0.2em] text-[#A9473C]">
              06
            </span>

            <span className="text-[10px] font-semibold tracking-[0.22em] text-[#11120F]/45">
              FAQ
            </span>
          </div>

          <span className="hidden text-[10px] tracking-[0.2em] text-[#11120F]/30 sm:block">
            GOOD TO KNOW
          </span>
        </div>

        {/* FAQ intro */}
        <div className="grid gap-10 py-16 lg:grid-cols-[1fr_1.2fr] lg:py-24">
          <div>
            <p className="mb-6 text-[10px] font-semibold tracking-[0.22em] text-[#11120F]/35">
              BEFORE YOU ENTER
            </p>

            <h2 className="font-[family-name:var(--font-display)] text-[clamp(4rem,8vw,8rem)] font-medium uppercase leading-[0.8] tracking-[-0.055em]">
              Everything
              <br />
              <span className="text-[#11120F]/25">you need</span>
              <br />
              to know.
            </h2>
          </div>

          {/* Questions */}
          <div className="border-t border-[#11120F]/15">
            {faqs.map((faq, index) => {
              const isOpen = active === index;

              return (
                <div
                  key={faq.question}
                  className="border-b border-[#11120F]/15"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    className="group flex min-h-[72px] w-full items-center justify-between gap-6 text-left sm:min-h-[82px]"
                  >
                    <div className="flex items-center gap-5">
                      <span className="font-[family-name:var(--font-display)] text-sm text-[#11120F]/30">
                        0{index + 1}
                      </span>

                      <span
                        className={`font-[family-name:var(--font-display)] text-[clamp(1.15rem,2vw,1.65rem)] font-medium uppercase tracking-[-0.015em] transition-colors ${
                          isOpen
                            ? "text-[#A9473C]"
                            : "text-[#11120F] group-hover:text-[#A9473C]"
                        }`}
                      >
                        {faq.question}
                      </span>
                    </div>

                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#11120F]/15 transition-all duration-300 ${
                        isOpen
                          ? "rotate-45 border-[#A9473C] bg-[#A9473C] text-[#F4F2EC]"
                          : "group-hover:border-[#11120F]/40"
                      }`}
                    >
                      <Plus size={16} strokeWidth={1.5} />
                    </span>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[600px] pb-7 pl-10 text-sm leading-6 text-[#11120F]/50 sm:pl-12">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Closing CTA */}
      

        {/* Footer */}
        <footer className="border-t border-[#11120F]/15 py-7">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            {/* Brand */}
            <div>
              <p className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-[-0.04em]">
                updtcl<span className="text-[#A9473C]">.</span>
              </p>

              <p className="mt-2 max-w-[260px] text-[10px] leading-5 tracking-[0.08em] text-[#11120F]/40">
                UTTAR PRADESH DISTRICT
                <br />
                Tenish CRICKET LEAGUE
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-x-7 gap-y-3">
              <Link
                href="#home"
                className="text-[10px] font-semibold tracking-[0.16em] text-[#11120F]/45 transition-colors hover:text-[#11120F]"
              >
                HOME
              </Link>

              <Link
                href="#league"
                className="text-[10px] font-semibold tracking-[0.16em] text-[#11120F]/45 transition-colors hover:text-[#11120F]"
              >
                THE LEAGUE
              </Link>

              <Link
                href="#why-updtcl"
                className="text-[10px] font-semibold tracking-[0.16em] text-[#11120F]/45 transition-colors hover:text-[#11120F]"
              >
                WHY updtcl
              </Link>

              <Link
                href="/register"
                className="text-[10px] font-semibold tracking-[0.16em] text-[#A9473C]"
              >
                REGISTER
              </Link>
            </div>

            {/* Contact */}
            <div className="lg:text-right">
              <p className="text-[10px] tracking-[0.18em] text-[#11120F]/30">
                REGISTRATION ENQUIRIES
              </p>

              <a
                href="tel:9981330383"
                className="mt-2 block font-[family-name:var(--font-display)] text-xl font-medium tracking-[0.02em]"
              >
                9981330383
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 flex flex-col gap-2 border-t border-[#11120F]/10 pt-5 text-[9px] tracking-[0.14em] text-[#11120F]/25 sm:flex-row sm:items-center sm:justify-between">
            <span>
              © {new Date().getFullYear()} updtcl T10
            </span>

            <span>
              UTTAR PRADESH
            </span>
          </div>
        </footer>
      </div>
    </section>
  );
}