"use client";

import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";
import { useEffect, useState } from "react";

import MobileMenu from "./MobileMenu";

const navigation = [
  {
    number: "01",
    label: "About",
    href: "#about",
  },
  {
    number: "02",
    label: "The League",
    href: "#league",
  },
  {
    number: "03",
    label: "How It Works",
    href: "#how-it-works",
  },
  {
    number: "04",
    label: "Contact",
    href: "#contact",
  },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50",
          "transition-all duration-500",
          isScrolled
            ? "border-b border-white/[0.08] bg-[#050806]/80 backdrop-blur-xl"
            : "bg-transparent",
        ].join(" ")}
      >
        <div className="mx-auto flex h-[88px] max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-12">

      {/* Logo */}
<Link
  href="/"
  className="group flex items-center"
>
  <img
    src="/logo.png"
    alt="UPDTCL T10 League"
    className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
  />
</Link>
         

          {/* Desktop Navigation */}

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="
                  group relative flex items-center gap-2
                  py-3
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[1.2px]
                  text-[#89948c]
                  transition-colors
                  duration-300
                  hover:text-[#f4f6ef]
                "
              >
                <span className="font-[family-name:var(--font-display)] text-[10px] text-[#465148] transition-colors group-hover:text-[#d5ff5c]">
                  {item.number}
                </span>

                <span>{item.label}</span>

                <span
                  className="
                    absolute bottom-1 left-[18px] right-0
                    h-px
                    origin-right
                    scale-x-0
                    bg-[#d5ff5c]
                    transition-transform
                    duration-300
                    group-hover:origin-left
                    group-hover:scale-x-100
                  "
                />
              </a>
            ))}
          </nav>

          {/* Right side */}

          <div className="flex items-center gap-3 sm:gap-5">

            {/* Season */}

            <div className="hidden items-center gap-2 text-[8px] font-bold uppercase tracking-[1.4px] text-[#66736b] md:flex">
              <span className="size-[5px] rounded-full bg-[#d5ff5c] shadow-[0_0_12px_rgba(213,255,92,0.6)]" />

              <span>2026 Season</span>
            </div>

            {/* Register */}

            <Link
              href="/register"
              className="
                group flex h-10 items-center gap-4
                border border-[#d5ff5c]/50
                px-4
                text-[9px]
                font-extrabold
                uppercase
                tracking-[1.3px]
                text-[#d5ff5c]
                transition-all
                duration-300
                hover:bg-[#d5ff5c]
                hover:text-[#050806]
              "
            >
              <span>Register</span>

              <span className="border-l border-[#d5ff5c]/20 pl-3 transition-colors group-hover:border-black/20">
                <ArrowUpRight
                  size={15}
                  strokeWidth={1.8}
                />
              </span>
            </Link>

            {/* Mobile Menu */}

            <button
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(true)}
              className="
                flex size-10 items-center justify-center
                border border-white/[0.1]
                text-[#f4f6ef]
                transition-colors
                hover:border-[#d5ff5c]/50
                hover:text-[#d5ff5c]
                lg:hidden
              "
            >
              <Menu size={19} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        navigation={navigation}
      />
    </>
  );
}