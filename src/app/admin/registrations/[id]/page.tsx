"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import AdminGuard from "@/components/admin/AdminGuard";

type Registration = {
  id: string;
  registration_number: string;

  first_name: string;
  last_name: string;

  date_of_birth: string;
  age_group: string;

  playing_speciality: string;

  email: string;
  mobile: string;

  district: string;
  state: string;



  amount: number;

  payment_status: string;
  registration_status: string;

  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;

  created_at: string;
  updated_at: string;
};

export default function RegistrationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [registration, setRegistration] =
    useState<Registration | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRegistration() {
      try {
        const { id } = await params;

        const { data, error } = await supabase
          .from("registrations")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }

        setRegistration(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load registration.");
      } finally {
        setLoading(false);
      }
    }

    loadRegistration();
  }, [params]);

  if (loading) {
    return (
      <AdminGuard>
      <main className="min-h-screen bg-[#070B0D] text-[#F4F2EC]">
        <div className="mx-auto flex min-h-screen max-w-[1450px] items-center justify-center">
          <p className="text-[10px] tracking-[0.22em] text-white/35">
            LOADING REGISTRATION...
          </p>
        </div>
      </main>
      </AdminGuard>
    );
  }

  if (error || !registration) {
    return (
      <main className="min-h-screen bg-[#070B0D] px-6 text-[#F4F2EC]">
        <div className="mx-auto flex min-h-screen max-w-[1450px] flex-col items-center justify-center">
          <XCircle size={38} strokeWidth={1} />

          <p className="mt-5 text-sm text-white/50">
            {error || "Registration not found."}
          </p>

          <Link
            href="/admin/registrations"
            className="mt-8 border border-white/15 px-5 py-3 text-[10px] font-bold tracking-[0.18em] transition hover:border-[#C9A45C] hover:text-[#C9A45C]"
          >
            BACK TO REGISTRATIONS
          </Link>
        </div>
      </main>
    );
  }

  const fullName =
    `${registration.first_name} ${registration.last_name}`;

  const formattedDate = new Date(
    registration.created_at
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const paymentIsPaid =
    registration.payment_status === "PAID";

 return (
  <AdminGuard>
    <main className="min-h-screen bg-[#070B0D] text-[#F4F2EC]">
      <div className="mx-auto max-w-[1450px] px-5 py-6 sm:px-8 lg:px-10">

        {/* HEADER */}

        <header className="border-t border-white/10 pt-5">
          <div className="flex items-center justify-between">
            <Link
              href="/admin/registrations"
              className="group flex items-center gap-3 text-[10px] font-semibold tracking-[0.18em] text-white/45 transition hover:text-white"
            >
              <ArrowLeft
                size={15}
                strokeWidth={1.4}
                className="transition-transform group-hover:-translate-x-1"
              />

              REGISTRATIONS
            </Link>

            <span className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight">
              updtcl
            </span>

            <span className="hidden text-[9px] tracking-[0.18em] text-white/25 sm:block">
              ADMIN / PLAYER PROFILE
            </span>
          </div>
        </header>

        {/* INTRO */}

        <section className="grid gap-10 py-12 lg:grid-cols-[1fr_auto] lg:items-end lg:py-16">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.22em] text-[#C9A45C]">
              {registration.registration_number}
            </p>

            <h1 className="mt-5 max-w-[900px] font-[family-name:var(--font-display)] text-[clamp(4rem,9vw,9rem)] font-medium uppercase leading-[0.78] tracking-[-0.06em]">
              {registration.first_name}
              <br />
              <span className="text-white/25">
                {registration.last_name}
              </span>
            </h1>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <StatusBadge
                label={registration.registration_status}
                active={
                  registration.registration_status ===
                  "CONFIRMED"
                }
              />

              <span className="text-[10px] tracking-[0.16em] text-white/30">
                REGISTERED {formattedDate.toUpperCase()}
              </span>
            </div>
          </div>

          {/* PHOTO */}

         <section className="py-12 sm:py-14 lg:py-16">
  <div>
    <p className="text-[10px] font-semibold tracking-[0.22em] text-[#C9A45C]">
      {registration.registration_number}
    </p>

    <h1 className="mt-5 max-w-[900px] font-[family-name:var(--font-display)] text-[clamp(4rem,9vw,9rem)] font-medium uppercase leading-[0.78] tracking-[-0.06em]">
      {registration.first_name}
      <br />
      <span className="text-white/25">
        {registration.last_name}
      </span>
    </h1>

    <div className="mt-7 flex flex-wrap items-center gap-4">
      <StatusBadge
        label={registration.registration_status}
        active={registration.registration_status === "CONFIRMED"}
      />

      <span className="text-[10px] tracking-[0.16em] text-white/30">
        REGISTERED {formattedDate.toUpperCase()}
      </span>
    </div>
  </div>
</section>
        </section>

        {/* PLAYER INFORMATION */}

        <section className="border-y border-white/10">
          <div className="grid lg:grid-cols-2">

            <InfoBlock
              number="01"
              title="Player details"
              items={[
                {
                  label: "Full name",
                  value: fullName,
                },
                {
                  label: "Date of birth",
                  value: formatDate(
                    registration.date_of_birth
                  ),
                },
                {
                  label: "Age group",
                  value: registration.age_group,
                },
                {
                  label: "Playing speciality",
                  value:
                    registration.playing_speciality,
                },
              ]}
            />

            <InfoBlock
              number="02"
              title="Contact & location"
              items={[
                {
                  label: "Email",
                  value: registration.email,
                  icon: Mail,
                },
                {
                  label: "Mobile",
                  value: registration.mobile,
                  icon: Phone,
                },
                {
                  label: "District",
                  value: registration.district,
                  icon: MapPin,
                },
                {
                  label: "State",
                  value: registration.state,
                },
              ]}
            />

          </div>
        </section>

        {/* PAYMENT */}

        <section className="mt-10 border border-white/10">
          <div className="border-b border-white/10 px-6 py-5 sm:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-[family-name:var(--font-display)] text-sm text-white/20">
                  03
                </span>

                <span className="text-[10px] font-semibold tracking-[0.2em] text-white/45">
                  PAYMENT
                </span>
              </div>

              <CreditCard
                size={17}
                strokeWidth={1.3}
                className="text-white/25"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-[0.7fr_1.3fr]">

            <div className="border-b border-white/10 p-6 lg:border-b-0 lg:border-r sm:p-8">
              <p className="text-[9px] font-semibold tracking-[0.2em] text-white/30">
                AMOUNT
              </p>

              <p className="mt-3 font-[family-name:var(--font-display)] text-6xl leading-none tracking-[-0.04em]">
                ₹{registration.amount}
              </p>

              <div className="mt-6">
                {paymentIsPaid ? (
                  <div className="flex items-center gap-2 text-[#C9A45C]">
                    <CheckCircle2
                      size={16}
                      strokeWidth={1.5}
                    />

                    <span className="text-[10px] font-bold tracking-[0.18em]">
                      PAYMENT CONFIRMED
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-white/40">
                    <Clock3
                      size={16}
                      strokeWidth={1.5}
                    />

                    <span className="text-[10px] font-bold tracking-[0.18em]">
                      {registration.payment_status}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2">

              <PaymentField
                label="Razorpay order ID"
                value={
                  registration.razorpay_order_id
                }
              />

              <PaymentField
                label="Razorpay payment ID"
                value={
                  registration.razorpay_payment_id
                }
              />

              <PaymentField
                label="Payment status"
                value={registration.payment_status}
              />

              <PaymentField
                label="Registration status"
                value={
                  registration.registration_status
                }
              />

            </div>
          </div>
        </section>

        {/* FOOTER */}

        <footer className="flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[9px] tracking-[0.18em] text-white/20">
            UTTAR PRADESH DISTRICT Tenish CRICKET LEAGUE
          </p>

          <p className="text-[9px] tracking-[0.18em] text-white/20">
            updtcl ADMIN
          </p>
        </footer>
      </div>
    </main>
    </AdminGuard>
  );
}

/* ---------------------------------- */
/* INFO BLOCK */
/* ---------------------------------- */

function InfoBlock({
  number,
  title,
  items,
}: {
  number: string;
  title: string;
  items: {
    label: string;
    value: string;
    icon?: LucideIcon;
  }[];
}) {
  return (
    <div className="border-b border-white/10 p-6 last:border-b-0 lg:border-b-0 lg:border-r lg:p-8 lg:last:border-r-0">
      <div className="mb-8 flex items-center gap-4">
        <span className="font-[family-name:var(--font-display)] text-sm text-white/20">
          {number}
        </span>

        <h2 className="text-[10px] font-semibold tracking-[0.2em] text-white/45">
          {title}
        </h2>
      </div>

      <div>
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-center justify-between gap-6 border-t border-white/10 py-5"
            >
              <span className="text-[10px] tracking-[0.12em] text-white/25">
                {item.label}
              </span>

              <div className="flex max-w-[65%] items-center gap-2 text-right">
                {Icon && (
                  <Icon
                    size={14}
                    strokeWidth={1.3}
                    className="shrink-0 text-white/25"
                  />
                )}

                <span className="break-all text-sm text-white/70">
                  {item.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* PAYMENT FIELD */
/* ---------------------------------- */

function PaymentField({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div className="border-b border-white/10 p-6 sm:p-8">
      <p className="text-[9px] font-semibold tracking-[0.18em] text-white/25">
        {label}
      </p>

      <p className="mt-3 break-all font-mono text-xs text-white/60">
        {value || "—"}
      </p>
    </div>
  );
}

/* ---------------------------------- */
/* STATUS */
/* ---------------------------------- */

function StatusBadge({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 border px-3 py-2 text-[9px] font-bold tracking-[0.18em] ${
        active
          ? "border-[#C9A45C]/40 text-[#C9A45C]"
          : "border-white/10 text-white/35"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active
            ? "bg-[#C9A45C]"
            : "bg-white/25"
        }`}
      />

      {label}
    </span>
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
      month: "long",
      year: "numeric",
    }
  );
}