"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  LayoutDashboard,
  Menu,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type DashboardRegistration = {
  id: string;
  registration_number: string;
  first_name: string;
  last_name: string;
  district: string;
  age_group: string;
  playing_speciality: string;
  payment_status: string;
  amount: number;
  created_at: string;
};




export default function AdminDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    revenue: 0,
  });

  const [recentRegistrations, setRecentRegistrations] = useState<
    DashboardRegistration[]
  >([]);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("registrations")
        .select(`
          id,
          registration_number,
          first_name,
          last_name,
          district,
          age_group,
          playing_speciality,
          payment_status,
          amount,
          created_at
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Admin dashboard error:", error);
        return;
      }

      const registrations = (data ?? []) as DashboardRegistration[];

      const paid = registrations.filter(
        (item) => item.payment_status === "PAID"
      );

      const pending = registrations.filter(
        (item) => item.payment_status !== "PAID"
      );

      const revenue = paid.reduce(
        (total, item) => total + Number(item.amount || 0),
        0
      );

      setStats({
        total: registrations.length,
        paid: paid.length,
        pending: pending.length,
        revenue,
      });

      setRecentRegistrations(registrations.slice(0, 5));
    } finally {
      setLoading(false);
    }
  }

  async function checkAdmin() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.replace("/admin/login");
      return;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error || !profile || profile.role !== "ADMIN") {
      await supabase.auth.signOut();
      window.location.replace("/admin/login");
      return;
    }

    setAuthChecking(false);
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void checkAdmin();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  if (authChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070B14] text-[#F5F1E8]">
        <p className="text-[9px] font-semibold tracking-[0.2em] text-white/35">
          AUTHENTICATING...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F2EC] text-[#11120F]">

      {/* Mobile header */}
      <header className="flex items-center justify-between border-b border-[#11120F]/10 bg-[#070B14] px-5 py-4 text-[#F5F1E8] lg:hidden">
        <Link
          href="/admin"
          className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-[-0.04em]"
        >
          UPTCL<span className="text-[#C9A45C]">.</span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center border border-white/15"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-[250px] bg-[#070B14] text-[#F5F1E8] transition-transform duration-300 lg:relative lg:translate-x-0 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">

            {/* Logo */}
            <div className="border-b border-white/10 px-7 py-7">
              <Link
                href="/admin"
                className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-[-0.05em]"
              >
                UPTCL<span className="text-[#C9A45C]">.</span>
              </Link>

              <p className="mt-1 text-[9px] tracking-[0.18em] text-white/30">
                ADMINISTRATION
              </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-7">

              <p className="mb-4 px-3 text-[9px] font-semibold tracking-[0.2em] text-white/25">
                MANAGEMENT
              </p>

              <AdminNavItem
                href="/admin"
                icon={LayoutDashboard}
                label="Overview"
                active
                onClick={() => setMobileOpen(false)}
              />

              <AdminNavItem
                href="/admin/registrations"
                icon={Users}
                label="Registrations"
                onClick={() => setMobileOpen(false)}
              />

              
            </nav>

            {/* Bottom */}
            <div className="border-t border-white/10 px-7 py-6">
              <p className="text-[9px] tracking-[0.15em] text-white/25">
                UPTCL T20
              </p>

              <p className="mt-1 text-xs text-white/45">
                Registration Portal
              </p>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {mobileOpen && (
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          />
        )}

        {/* Main content */}
        <div className="min-w-0 flex-1">

          {/* Desktop top bar */}
          <header className="hidden items-center justify-between border-b border-[#11120F]/10 bg-[#F4F2EC] px-8 py-5 lg:flex xl:px-12">

            <div>
              <p className="text-[9px] font-semibold tracking-[0.2em] text-[#11120F]/30">
                ADMINISTRATION
              </p>

              <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-medium uppercase tracking-[-0.02em]">
                Overview
              </h1>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[9px] tracking-[0.15em] text-[#11120F]/30">
                  LEAGUE
                </p>

                <p className="mt-1 text-xs font-medium">
                  UPTCL T20
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#11120F] text-xs font-semibold text-[#F5F1E8]">
                A
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-7 lg:px-8 lg:py-10 xl:px-12">

            {/* Page intro */}
            <section className="mb-9 flex flex-col justify-between gap-6 border-t border-[#11120F]/15 pt-5 sm:flex-row sm:items-end">

              <div>
                <p className="mb-3 text-[9px] font-semibold tracking-[0.2em] text-[#A9473C]">
                  01 / OVERVIEW
                </p>

                <h2 className="font-[family-name:var(--font-display)] text-[clamp(3rem,5vw,5rem)] font-medium uppercase leading-[0.85] tracking-[-0.045em]">
                  Registration
                  <br />
                  <span className="text-[#11120F]/25">
                    control.
                  </span>
                </h2>
              </div>

              <Link
                href="/admin/registrations"
                className="group flex items-center justify-between gap-8 border border-[#11120F]/20 px-5 py-3.5 text-[10px] font-semibold tracking-[0.18em] transition-all hover:bg-[#11120F] hover:text-[#F5F1E8]"
              >
                VIEW ALL PLAYERS
                <ArrowUpRight
                  size={15}
                  strokeWidth={1.5}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>
            </section>

            {/* Stats */}
            {/* Stats */}
<section className="grid border-t border-[#11120F]/10 sm:grid-cols-2 lg:grid-cols-4">
  {[
    {
      label: "TOTAL PLAYERS",
      value: stats.total.toString(),
      change: "Registrations",
      icon: Users,
    },
    {
      label: "PAID",
      value: stats.paid.toString(),
      change: "Confirmed",
      icon: CheckCircle2,
    },
    {
      label: "PENDING",
      value: stats.pending.toString(),
      change: "Awaiting payment",
      icon: Clock3,
    },
    {
      label: "REVENUE",
      value: `₹${stats.revenue.toLocaleString("en-IN")}`,
      change: "Registration fees",
      icon: CheckCircle2,
    },
  ].map((stat, index) => {
    const Icon = stat.icon;

    return (
      <div
        key={stat.label}
        className={`border-b border-[#11120F]/10 px-5 py-6 first:pl-0 sm:px-6 lg:border-b-0 lg:border-r lg:py-7 ${
          index === 3 ? "lg:border-r-0" : ""
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <span className="text-[9px] font-semibold tracking-[0.18em] text-[#11120F]/35">
            {stat.label}
          </span>

          <Icon
            size={16}
            strokeWidth={1.3}
            className="text-[#11120F]/25"
          />
        </div>

        <p className="font-[family-name:var(--font-display)] text-5xl font-medium tracking-[-0.04em]">
          {stat.value}
        </p>

        <p className="mt-2 text-[10px] text-[#11120F]/35">
          {stat.change}
        </p>
      </div>
    );
  })}
</section>

            {/* Main dashboard grid */}
            <section className="mt-10 grid gap-8 xl:grid-cols-[1.5fr_0.5fr]">

              {/* Recent registrations */}
              <div className="border-t border-[#11120F]/15">

                <div className="flex items-center justify-between py-5">
                  <div>
                    <p className="text-[9px] font-semibold tracking-[0.2em] text-[#11120F]/35">
                      LATEST
                    </p>

                    <h3 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-medium uppercase">
                      Recent registrations
                    </h3>
                  </div>

                  <Link
                    href="/admin/registrations"
                    className="text-[9px] font-semibold tracking-[0.15em] text-[#A9473C]"
                  >
                    VIEW ALL →
                  </Link>
                </div>

          {loading ? (
  <div className="flex min-h-[250px] items-center justify-center border-y border-[#11120F]/10">
    <p className="text-[10px] tracking-[0.15em] text-[#11120F]/35">
      LOADING REGISTRATIONS...
    </p>
  </div>
) : recentRegistrations.length === 0 ? (
  <div className="flex min-h-[250px] items-center justify-center border-y border-[#11120F]/10">
    <p className="text-sm text-[#11120F]/40">
      No registrations yet.
    </p>
  </div>
) : (
  <div className="border-y border-[#11120F]/10">
    {recentRegistrations.map((registration) => (
      <Link
        key={registration.id}
        href={`/admin/registrations/${registration.id}`}
        className="group grid grid-cols-[1fr_auto] gap-4 border-b border-[#11120F]/10 py-5 last:border-b-0 sm:grid-cols-[1.2fr_1fr_0.8fr_auto] sm:items-center"
      >
        <div>
          <p className="text-xs font-medium">
            {registration.first_name} {registration.last_name}
          </p>

          <p className="mt-1 text-[9px] tracking-[0.08em] text-[#11120F]/35">
            {registration.registration_number}
          </p>
        </div>

        <p className="hidden text-[10px] text-[#11120F]/45 sm:block">
          {registration.district}
        </p>

        <p className="hidden text-[10px] text-[#11120F]/45 sm:block">
          {registration.age_group}
        </p>

        <span
          className={`justify-self-end text-[9px] font-semibold tracking-[0.12em] ${
            registration.payment_status === "PAID"
              ? "text-[#58704F]"
              : "text-[#A9473C]"
          }`}
        >
          {registration.payment_status}
        </span>
      </Link>
    ))}
  </div>
)}
              </div>

              {/* Quick actions */}
           {/* Registration access */}
<div className="border-t border-[#11120F]/15">
  <div className="py-5">
    <p className="text-[9px] font-semibold tracking-[0.2em] text-[#11120F]/35">
      MANAGEMENT
    </p>

    <h3 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-medium uppercase">
      Registrations
    </h3>
  </div>

  <Link
    href="/admin/registrations"
    className="group flex items-center justify-between border-y border-[#11120F]/10 py-5"
  >
    <div className="flex items-center gap-4">
      <Users size={17} strokeWidth={1.3} />

      <span className="text-xs">
        View all registrations
      </span>
    </div>

    <ArrowUpRight
      size={15}
      strokeWidth={1.3}
      className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
    />
   </Link>
</div>

</section>

{/* Status strip */}
<section className="mt-10 flex flex-col gap-5 border-t border-[#11120F]/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#6B8E62]" />

                <span className="text-[9px] font-semibold tracking-[0.16em] text-[#11120F]/40">
                  SYSTEM ONLINE
                </span>
              </div>

              <span className="text-[9px] tracking-[0.15em] text-[#11120F]/25">
                UPTCL T20 / ADMIN PORTAL
              </span>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}

function AdminNavItem({
  href,
  icon: Icon,
  label,
  active = false,
  onClick,
}: {
  href: string;
  icon: typeof Users;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group mb-1 flex items-center gap-4 px-3 py-3 transition-all ${
        active
          ? "bg-white/10 text-[#F5F1E8]"
          : "text-white/40 hover:bg-white/5 hover:text-white/80"
      }`}
    >
      <Icon
        size={16}
        strokeWidth={1.3}
        className={
          active
            ? "text-[#C9A45C]"
            : "text-white/30 group-hover:text-white/60"
        }
      />

      <span className="text-[10px] font-medium tracking-[0.08em]">
        {label}
      </span>

      {active && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#C9A45C]" />
      )}
    </Link>
  );
}