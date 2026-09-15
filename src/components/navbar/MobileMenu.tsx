import Link from "next/link";
import {
  ArrowUpRight,
  X,
} from "lucide-react";

type NavigationItem = {
  number: string;
  label: string;
  href: string;
};

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  navigation: NavigationItem[];
};

export default function MobileMenu({
  open,
  onClose,
  navigation,
}: MobileMenuProps) {
  return (
    <div
      className={[
        "fixed inset-0 z-[60] bg-[#050806]",
        "transition-all duration-500",
        open
          ? "visible opacity-100"
          : "invisible opacity-0",
      ].join(" ")}
    >
      <div
        className={[
          "flex h-full flex-col px-6 pb-7 pt-6",
          "transition-transform duration-500",
          open
            ? "translate-y-0"
            : "-translate-y-4",
        ].join(" ")}
      >

        {/* Header */}

        <div className="flex items-center justify-between">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="flex size-9 -skew-x-[8deg] items-center justify-center bg-[#d5ff5c] text-[#050806]">
              <span className="skew-x-[8deg] font-[family-name:var(--font-display)] text-[25px] font-black">
                U
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-[family-name:var(--font-display)] text-[23px] font-extrabold leading-none tracking-[1px]">
                UPTCL
              </span>

              <span className="mt-1 text-[6px] font-bold tracking-[2px] text-[#657168]">
                T20 LEAGUE
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="flex size-10 items-center justify-center border border-white/10 text-[#f4f6ef] transition-colors hover:border-[#d5ff5c]/50 hover:text-[#d5ff5c]"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Menu heading */}

        <div className="mt-16 flex items-center justify-between border-b border-white/[0.08] pb-4 text-[8px] font-bold uppercase tracking-[2px]">
          <span className="text-[#d5ff5c]">
            Menu
          </span>

          <span className="text-[#58645c]">
            UPTCL / 2026
          </span>
        </div>

        {/* Navigation */}

        <nav className="mt-4">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="group grid grid-cols-[38px_1fr_25px] items-center border-b border-white/[0.08] py-6"
            >
              <span className="font-[family-name:var(--font-display)] text-[12px] text-[#526057]">
                {item.number}
              </span>

              <span className="font-[family-name:var(--font-display)] text-[39px] font-bold uppercase leading-none text-[#f4f6ef] transition-colors group-hover:text-[#d5ff5c]">
                {item.label}
              </span>

              <ArrowUpRight
                size={18}
                strokeWidth={1.5}
                className="text-[#d5ff5c]"
              />
            </a>
          ))}
        </nav>

        {/* Bottom */}

        <div className="mt-auto">
          <div className="mb-4 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[1.5px] text-[#69756d]">
            <span className="size-[5px] rounded-full bg-[#d5ff5c]" />

            <span>Player registration open</span>
          </div>

          <Link
            href="/register"
            onClick={onClose}
            className="flex h-14 items-center justify-between bg-[#d5ff5c] px-5 text-[10px] font-extrabold uppercase tracking-[1px] text-[#050806]"
          >
            <span>Register Now — ₹999</span>

            <ArrowUpRight
              size={18}
              strokeWidth={1.8}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}