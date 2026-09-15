"use client";

import { MouseEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDown } from "lucide-react";

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // One orchestrated reveal on load — everything else stays still.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Subtle cursor parallax on the ball only. Skipped entirely for
  // people who've asked their OS for reduced motion.
const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: relX * 26, y: relY * 18 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  // Reveal helper — same transition on every element, only the delay changes.
  const reveal = (delayClass = "") =>
    `transition-all duration-700 ease-out ${delayClass} ${
      mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    }`;

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[100svh] overflow-hidden bg-[#12130F] text-[#F5F1E6]"
    >

      <style>{`
        @keyframes ball-bob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes ball-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes arrow-bounce {
          0%, 100% { transform: translateY(0px); opacity: 0.6; }
          50% { transform: translateY(4px); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .motion-bob, .motion-spin, .motion-arrow { animation: none !important; }
        }
      `}</style>

      {/* =========================================================
          BACKGROUND
      ========================================================= */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,#171812_0%,#12130F_45%,#0D0E0A_100%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[6%] top-[8%] h-[520px] w-[520px] rounded-full bg-[#C98A3E]/[0.07] blur-[130px]"
      />

      <svg
        aria-hidden="true"
        viewBox="0 0 1000 1000"
        className="pointer-events-none absolute -right-[28%] -bottom-[38%] h-[1100px] w-[1100px] opacity-[0.10]"
      >
        <circle cx="500" cy="500" r="480" fill="none" stroke="#C98A3E" strokeWidth="1.5" />
      </svg>

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.03]
          [background-image:url('data:image/svg+xml,%3Csvg_viewBox=%220_0_160_160%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22n%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%22.9%22_numOctaves=%224%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23n)%22_opacity=%22.7%22/%3E%3C/svg%3E')]
        "
      />


      {/* =========================================================
          MAIN CONTAINER
      ========================================================= */}

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1600px] flex-col px-6 sm:px-10 lg:px-16 xl:px-20">


        {/* HEADER */}
       


        {/* HERO CONTENT */}
        <main className="relative flex flex-1 items-center">

          {/* Left content */}
          <div className="relative z-20 w-full max-w-[720px] py-20 lg:py-0">

            <h1 className="font-[family-name:var(--font-display)] uppercase font-black leading-[0.8] tracking-[-0.03em]">
              <span className={`block text-[clamp(5rem,12vw,10.5rem)] text-[#F5F1E6] ${reveal("delay-100")}`}>
                UPTCL
              </span>
              <span className={`block text-[clamp(3.4rem,8vw,7rem)] text-[#9C3F2A] ${reveal("delay-200")}`}>
                T20
              </span>
            </h1>

            <p className={`mt-8 max-w-[440px] text-[15px] leading-[1.7] text-[#B3AC9B] ${reveal("delay-300")}`}>
              Seventy-five districts, one tennis ball. Sixteen weeks of
              knockout cricket across Uttar Pradesh, closing with the final
              under lights at Kanpur&rsquo;s Green Park.
            </p>

            <div className={`mt-10 flex flex-wrap items-center gap-6 ${reveal("delay-500")}`}>
              <Link
                href="/register"
                className="
                  group
                  inline-flex
                  h-[52px]
                  items-center
                  gap-3
                  rounded-full
                  bg-[linear-gradient(180deg,#D7E767_0%,#C9DB4A_100%)]
                  px-6
                  text-[14px]
                  font-semibold
                  text-[#12130F]
                  shadow-[0_10px_30px_-8px_rgba(201,219,74,0.45)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:shadow-[0_14px_36px_-8px_rgba(201,219,74,0.6)]
                  focus-visible:outline
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-[#C9DB4A]
                "
              >
                Enter your team
                <ArrowUpRight
                  size={16}
                  strokeWidth={2}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>

              <span className="text-[13px] text-[#726C5E]">
                ₹999 to enter · closes 30 Nov
              </span>
            </div>

          </div>


          {/* =====================================================
              TENNIS BALL
              Layered so each motion is independent:
              outer div  -> cursor parallax (JS, smoothed by transition)
              middle div -> idle float
              svg        -> idle spin
          ===================================================== */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute right-[4%] top-[56%] hidden w-[min(26vw,340px)] -translate-y-1/2 lg:block ${reveal("delay-700")}`}
            style={{
              transform: `translate(${tilt.x}px, calc(-50% + ${tilt.y}px))`,
              transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <div className="motion-bob" style={{ animation: "ball-bob 6s ease-in-out infinite" }}>
              <svg
                viewBox="0 0 400 400"
                className="motion-spin w-full overflow-visible"
                style={{ animation: "ball-spin 22s linear infinite" }}
              >
                <defs>
                  <radialGradient id="ballBody" cx="38%" cy="28%" r="75%">
                    <stop offset="0%" stopColor="#E7F08C" />
                    <stop offset="30%" stopColor="#C9DB4A" />
                    <stop offset="62%" stopColor="#8FA02E" />
                    <stop offset="85%" stopColor="#57611D" />
                    <stop offset="100%" stopColor="#262B0F" />
                  </radialGradient>

                  <radialGradient id="ballShade" cx="70%" cy="78%" r="60%">
                    <stop offset="0%" stopColor="#000000" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                  </radialGradient>

                  <linearGradient id="trail" x1="1" y1="0" x2="0" y2="0">
                    <stop offset="0%" stopColor="#C9DB4A" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#C9DB4A" stopOpacity="0" />
                  </linearGradient>

                  <filter id="felt">
                    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="noise" />
                    <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" />
                  </filter>

                  <clipPath id="ballClip">
                    <circle cx="200" cy="200" r="150" />
                  </clipPath>
                </defs>

                <rect x="-40" y="178" width="230" height="44" fill="url(#trail)" />
                <circle cx="200" cy="200" r="150" fill="url(#ballBody)" />
                <rect x="50" y="50" width="300" height="300" filter="url(#felt)" clipPath="url(#ballClip)" opacity="0.5" />
                <circle cx="200" cy="200" r="150" fill="url(#ballShade)" />

                <g clipPath="url(#ballClip)">
                  <path
                    d="M 60 130 C 150 90, 150 220, 260 250 C 320 268, 350 250, 380 210"
                    fill="none"
                    stroke="#12130F"
                    strokeOpacity="0.25"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 60 130 C 150 90, 150 220, 260 250 C 320 268, 350 250, 380 210"
                    fill="none"
                    stroke="#F5F1E6"
                    strokeWidth="5"
                    strokeDasharray="1 7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 20 220 C 80 260, 200 250, 220 320 C 232 362, 260 378, 300 380"
                    fill="none"
                    stroke="#12130F"
                    strokeOpacity="0.2"
                    strokeWidth="9"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 20 220 C 80 260, 200 250, 220 320 C 232 362, 260 378, 300 380"
                    fill="none"
                    stroke="#F5F1E6"
                    strokeWidth="4"
                    strokeDasharray="1 7"
                    strokeLinecap="round"
                  />
                </g>

                <ellipse cx="152" cy="130" rx="34" ry="22" fill="#FFFFFF" opacity="0.35" />

                <path
                  d="M 320 90 A 150 150 0 0 1 335 290"
                  fill="none"
                  stroke="#F0C989"
                  strokeWidth="3"
                  strokeOpacity="0.4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

        </main>


        {/* SCOREBOARD FOOTER */}
        <footer className={`flex flex-wrap items-center justify-between gap-6 border-t border-[#F5F1E6]/[0.08] py-6 ${reveal("delay-700")}`}>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <div className="flex items-baseline gap-2">
              <span className="font-[family-name:var(--font-display)] text-[20px] font-bold text-[#F5F1E6]">75</span>
              <span className="text-[12px] text-[#726C5E]">districts</span>
            </div>

            <span className="hidden h-4 w-px bg-[#F5F1E6]/10 sm:block" />

            <div className="flex items-baseline gap-2">
              <span className="font-[family-name:var(--font-display)] text-[20px] font-bold text-[#F5F1E6]">16</span>
              <span className="text-[12px] text-[#726C5E]">weeks</span>
            </div>

            <span className="hidden h-4 w-px bg-[#F5F1E6]/10 sm:block" />

            <div className="flex items-baseline gap-2">
              <span className="font-[family-name:var(--font-display)] text-[20px] font-bold text-[#F5F1E6]">01</span>
              <span className="text-[12px] text-[#726C5E]">final, Green Park</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[#9C3F2A]">
            <span className="hidden text-[12px] text-[#726C5E] sm:block">Scroll</span>
            <ArrowDown
              size={14}
              strokeWidth={1.5}
              className="motion-arrow"
              style={{ animation: "arrow-bounce 1.8s ease-in-out infinite" }}
            />
          </div>

        </footer>

      </div>

    </section>
  );
}