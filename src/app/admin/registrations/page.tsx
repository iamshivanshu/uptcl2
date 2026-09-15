"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Search,
  Users,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import AdminGuard from "@/components/admin/AdminGuard";
import type { ComponentType } from "react";

type Registration = {
  id: string;
  registration_number: string;
  first_name: string;
  last_name: string;
  age_group: string;
  playing_speciality: string;
  district: string;
  mobile: string;
  amount: number;
  payment_status: string;
  registration_status: string;
  created_at: string;
};

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<
    Registration[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [ageFilter, setAgeFilter] = useState("ALL");
  const [specialityFilter, setSpecialityFilter] =
    useState("ALL");
  const [paymentFilter, setPaymentFilter] =
    useState("ALL");

  useEffect(() => {
    fetchRegistrations();
  }, []);

  async function fetchRegistrations() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("registrations")
      .select(
        `
          id,
          registration_number,
          first_name,
          last_name,
          age_group,
          playing_speciality,
          district,
          mobile,
          amount,
          payment_status,
          registration_status,
          created_at
        `
      )
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      setError(
        "Unable to load registrations. Check your Supabase configuration and RLS policies."
      );
      setRegistrations([]);
    } else {
      setRegistrations(data || []);
    }

    setLoading(false);
  }

  const filteredRegistrations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return registrations.filter((player) => {
      const matchesSearch =
        !query ||
        `${player.first_name} ${player.last_name}`
          .toLowerCase()
          .includes(query) ||
        player.registration_number
          .toLowerCase()
          .includes(query) ||
        player.district
          .toLowerCase()
          .includes(query) ||
        player.mobile.includes(query);

      const matchesAge =
        ageFilter === "ALL" ||
        player.age_group === ageFilter;

      const matchesSpeciality =
        specialityFilter === "ALL" ||
        player.playing_speciality ===
          specialityFilter;

      const matchesPayment =
        paymentFilter === "ALL" ||
        player.payment_status === paymentFilter;

      return (
        matchesSearch &&
        matchesAge &&
        matchesSpeciality &&
        matchesPayment
      );
    });
  }, [
    registrations,
    search,
    ageFilter,
    specialityFilter,
    paymentFilter,
  ]);

  const totalPlayers = registrations.length;

  const paidPlayers = registrations.filter(
    (player) => player.payment_status === "PAID"
  ).length;

  const pendingPlayers = registrations.filter(
    (player) =>
      player.payment_status === "PENDING"
  ).length;

  const revenue = registrations
    .filter(
      (player) => player.payment_status === "PAID"
    )
    .reduce(
      (total, player) => total + player.amount,
      0
    );

return (
  <AdminGuard>
    <main className="min-h-screen bg-[#070B0D] text-[#F4F2EC]">
      <div className="mx-auto max-w-[1550px] px-5 py-6 sm:px-8 lg:px-10">

        {/* HEADER */}

        <header className="border-t border-white/10 pt-5">
          <div className="flex items-center justify-between">
            <Link
              href="/admin"
              className="group flex items-center gap-3 text-[10px] font-semibold tracking-[0.18em] text-white/40 transition hover:text-white"
            >
              <ArrowLeft
                size={15}
                strokeWidth={1.3}
                className="transition-transform group-hover:-translate-x-1"
              />

              DASHBOARD
            </Link>

            <div className="font-[family-name:var(--font-display)] text-lg font-semibold">
              updtcl
            </div>

            <span className="hidden text-[9px] tracking-[0.2em] text-white/20 sm:block">
              ADMIN / REGISTRATIONS
            </span>
          </div>
        </header>

        {/* TITLE */}

        <section className="flex flex-col justify-between gap-8 py-12 sm:py-16 lg:flex-row lg:items-end">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.22em] text-[#C9A45C]">
              01 / PLAYER DATABASE
            </p>

            <h1 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(4rem,8vw,8rem)] font-medium uppercase leading-[0.78] tracking-[-0.06em]">
              Registrations
            </h1>
          </div>

          <div className="max-w-[280px] text-sm leading-6 text-white/35">
            Every player registration, payment
            status and district in one place.
          </div>
        </section>

        {/* STATS */}

        <section className="grid border-y border-white/10 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Total players"
            value={totalPlayers}
            icon={Users}
          />

          <Stat
            label="Paid"
            value={paidPlayers}
            icon={CheckCircle2}
          />

          <Stat
            label="Pending"
            value={pendingPlayers}
            icon={Clock3}
          />

          <Stat
            label="Revenue"
            value={`₹${revenue.toLocaleString("en-IN")}`}
          />
        </section>

        {/* FILTERS */}

        <section className="mt-8 border border-white/10">

          <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center">

            {/* SEARCH */}

            <div className="relative flex-1">
              <Search
                size={16}
                strokeWidth={1.3}
                className="absolute left-0 top-1/2 -translate-y-1/2 text-white/25"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search player, registration number, district or mobile..."
                className="w-full border-b border-white/15 bg-transparent py-3 pl-7 pr-2 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#C9A45C]"
              />
            </div>

            <Filter
              value={ageFilter}
              onChange={setAgeFilter}
              options={[
                "ALL",
                "Under 19",
                "Under 23",
                "Above 23",
              ]}
            />

            <Filter
              value={specialityFilter}
              onChange={setSpecialityFilter}
              options={[
                "ALL",
                "Batsman",
                "Bowler",
                "All-rounder",
                "Wicketkeeper",
              ]}
            />

            <Filter
              value={paymentFilter}
              onChange={setPaymentFilter}
              options={[
                "ALL",
                "PAID",
                "PENDING",
                "FAILED",
              ]}
            />

          </div>

          {/* RESULT COUNT */}

          <div className="border-t border-white/10 px-5 py-3">
            <span className="text-[9px] tracking-[0.18em] text-white/25">
              SHOWING {filteredRegistrations.length} OF{" "}
              {totalPlayers} PLAYERS
            </span>
          </div>
        </section>

        {/* CONTENT */}

        <section className="mt-6">

          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState
              message={error}
              onRetry={fetchRegistrations}
            />
          ) : filteredRegistrations.length === 0 ? (
            <EmptyState
              hasFilters={
                Boolean(search) ||
                ageFilter !== "ALL" ||
                specialityFilter !== "ALL" ||
                paymentFilter !== "ALL"
              }
            />
          ) : (
            <>
              {/* DESKTOP TABLE */}

              <div className="hidden overflow-hidden border border-white/10 lg:block">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th className="px-6 py-4 text-[9px] font-semibold tracking-[0.18em] text-white/25">
                        PLAYER
                      </th>

                      <th className="px-6 py-4 text-[9px] font-semibold tracking-[0.18em] text-white/25">
                        CATEGORY
                      </th>

                      <th className="px-6 py-4 text-[9px] font-semibold tracking-[0.18em] text-white/25">
                        DISTRICT
                      </th>

                      <th className="px-6 py-4 text-[9px] font-semibold tracking-[0.18em] text-white/25">
                        MOBILE
                      </th>

                      <th className="px-6 py-4 text-[9px] font-semibold tracking-[0.18em] text-white/25">
                        PAYMENT
                      </th>

                      <th className="px-6 py-4 text-[9px] font-semibold tracking-[0.18em] text-white/25">
                        DATE
                      </th>

                      <th />
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRegistrations.map(
                      (player) => (
                        <RegistrationRow
                          key={player.id}
                          player={player}
                        />
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* MOBILE */}

              <div className="space-y-3 lg:hidden">
                {filteredRegistrations.map(
                  (player) => (
                    <MobileRegistrationCard
                      key={player.id}
                      player={player}
                    />
                  )
                )}
              </div>
            </>
          )}

        </section>

        {/* FOOTER */}

        <footer className="flex flex-col gap-3 py-8 sm:flex-row sm:justify-between">
          <span className="text-[9px] tracking-[0.18em] text-white/15">
            UTTAR PRADESH DISTRICT Tenish CRICKET LEAGUE
          </span>

          <span className="text-[9px] tracking-[0.18em] text-white/15">
            updtcl ADMIN
          </span>
                </footer>
      </div>
    </main>
    </AdminGuard>
  );
}

/* ---------------------------------- */
/* TABLE ROW */
/* ---------------------------------- */

function RegistrationRow({
  player,
}: {
  player: Registration;
}) {
  return (
    <tr className="group border-b border-white/[0.07] transition hover:bg-white/[0.025]">

      <td className="px-6 py-5">
        <Link
          href={`/admin/registrations/${player.id}`}
          className="block"
        >
          <p className="text-sm font-medium text-white/80">
            {player.first_name} {player.last_name}
          </p>

          <p className="mt-1 font-mono text-[9px] tracking-wider text-white/25">
            {player.registration_number}
          </p>
        </Link>
      </td>

      <td className="px-6 py-5">
        <p className="text-xs text-white/55">
          {player.playing_speciality}
        </p>

        <p className="mt-1 text-[9px] tracking-[0.12em] text-white/25">
          {player.age_group}
        </p>
      </td>

      <td className="px-6 py-5 text-xs text-white/50">
        {player.district}
      </td>

      <td className="px-6 py-5 text-xs text-white/50">
        {player.mobile}
      </td>

      <td className="px-6 py-5">
        <PaymentStatus
          status={player.payment_status}
        />
      </td>

      <td className="px-6 py-5 text-[10px] text-white/30">
        {formatDate(player.created_at)}
      </td>

      <td className="px-6 py-5">
        <Link
          href={`/admin/registrations/${player.id}`}
          className="flex h-8 w-8 items-center justify-center border border-white/10 transition hover:border-[#C9A45C] hover:text-[#C9A45C]"
        >
          <ArrowUpRight
            size={14}
            strokeWidth={1.3}
          />
        </Link>
      </td>

    </tr>
  );
}

/* ---------------------------------- */
/* MOBILE CARD */
/* ---------------------------------- */

function MobileRegistrationCard({
  player,
}: {
  player: Registration;
}) {
  return (
    <Link
      href={`/admin/registrations/${player.id}`}
      className="block border border-white/10 p-5 transition hover:border-white/20"
    >
      <div className="flex items-start justify-between gap-5">

        <div>
          <p className="text-sm font-medium">
            {player.first_name} {player.last_name}
          </p>

          <p className="mt-1 font-mono text-[9px] text-white/25">
            {player.registration_number}
          </p>
        </div>

        <ArrowUpRight
          size={16}
          strokeWidth={1.3}
          className="text-white/25"
        />

      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-4">

        <MiniField
          label="SPECIALITY"
          value={player.playing_speciality}
        />

        <MiniField
          label="AGE GROUP"
          value={player.age_group}
        />

        <MiniField
          label="DISTRICT"
          value={player.district}
        />

        <MiniField
          label="PAYMENT"
          value={player.payment_status}
        />

      </div>
    </Link>
  );
}

/* ---------------------------------- */
/* STAT */
/* ---------------------------------- */

function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon?: ComponentType<{
    size?: number;
    strokeWidth?: number;
    className?: string;
  }>;
}) {
  return (
    <div className="flex items-end justify-between border-b border-white/10 p-6 last:border-b-0 sm:border-r sm:p-7 lg:border-b-0 lg:last:border-r-0">
      <div>
        <p className="text-[9px] tracking-[0.18em] text-white/25">
          {label}
        </p>

        <p className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-[-0.03em]">
          {value}
        </p>
      </div>

      {Icon && (
        <Icon
          size={17}
          strokeWidth={1.2}
          className="text-white/20"
        />
      )}
    </div>
  );
}

/* ---------------------------------- */
/* FILTER */
/* ---------------------------------- */

function Filter({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
      className="border border-white/10 bg-[#070B0D] px-4 py-3 text-[9px] font-semibold tracking-[0.12em] text-white/50 outline-none focus:border-[#C9A45C]"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option === "ALL" ? "ALL" : option}
        </option>
      ))}
    </select>
  );
}

/* ---------------------------------- */
/* PAYMENT STATUS */
/* ---------------------------------- */

function PaymentStatus({
  status,
}: {
  status: string;
}) {
  const paid = status === "PAID";

  return (
    <span
      className={`inline-flex items-center gap-2 text-[9px] font-bold tracking-[0.14em] ${
        paid
          ? "text-[#C9A45C]"
          : "text-white/35"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          paid
            ? "bg-[#C9A45C]"
            : "bg-white/20"
        }`}
      />

      {status}
    </span>
  );
}

/* ---------------------------------- */
/* MINI FIELD */
/* ---------------------------------- */

function MiniField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[8px] tracking-[0.15em] text-white/20">
        {label}
      </p>

      <p className="mt-1 text-xs text-white/55">
        {value}
      </p>
    </div>
  );
}

/* ---------------------------------- */
/* LOADING */
/* ---------------------------------- */

function LoadingState() {
  return (
    <div className="flex min-h-[300px] items-center justify-center border border-white/10">
      <p className="text-[9px] tracking-[0.2em] text-white/25">
        LOADING PLAYER DATABASE...
      </p>
    </div>
  );
}

/* ---------------------------------- */
/* EMPTY */
/* ---------------------------------- */

function EmptyState({
  hasFilters,
}: {
  hasFilters: boolean;
}) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center border border-white/10 px-6 text-center">

      <Users
        size={30}
        strokeWidth={0.9}
        className="text-white/15"
      />

      <p className="mt-5 text-sm text-white/50">
        {hasFilters
          ? "No registrations match your filters."
          : "No registrations yet."}
      </p>

      <p className="mt-2 text-xs text-white/20">
        {hasFilters
          ? "Try changing your search or filters."
          : "New player registrations will appear here."}
      </p>

    </div>
  );
}

/* ---------------------------------- */
/* ERROR */
/* ---------------------------------- */

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center border border-[#A9473C]/20 px-6 text-center">

      <p className="max-w-md text-sm text-white/50">
        {message}
      </p>

      <button
        onClick={onRetry}
        className="mt-6 border border-white/15 px-5 py-3 text-[9px] font-bold tracking-[0.18em] transition hover:border-[#C9A45C] hover:text-[#C9A45C]"
      >
        TRY AGAIN
      </button>

    </div>
  );
}

/* ---------------------------------- */
/* DATE */
/* ---------------------------------- */

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}