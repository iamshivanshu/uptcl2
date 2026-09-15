"use client";

import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

type RazorpayPaymentResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    registration_id: string;
    registration_number: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpayPaymentResponse) => Promise<void>;
  modal: {
    ondismiss: () => void;
  };
};

type RazorpayInstance = {
  open: () => void;
};

type RazorpayConstructor = new (
  options: RazorpayOptions
) => RazorpayInstance;

const ageGroups = [
  "Under 19",
  "Under 23",
  "Above 23",
];

const specialities = [
  "Batsman",
  "Bowler",
  "All-rounder",
  "Wicketkeeper",
];

type FormData = {
  firstName: string;
  lastName: string;
  dob: string;
  ageGroup: string;
  speciality: string;
  email: string;
  mobile: string;
  district: string;
  state: string;
};

export default function RegistrationForm() {
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    dob: "",
    ageGroup: "",
    speciality: "",
    email: "",
    mobile: "",
    district: "",
    state: "Uttar Pradesh",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  function updateField(
    field: keyof FormData,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function validateForm() {
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.dob ||
      !form.ageGroup ||
      !form.speciality ||
      !form.email.trim() ||
      !form.mobile.trim() ||
      !form.district.trim() ||
      !form.state.trim()
    ) {
      setMessage(
        "Please complete all required fields."
      );
      return false;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email
      )
    ) {
      setMessage(
        "Please enter a valid email address."
      );
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      setMessage(
        "Please enter a valid 10-digit mobile number."
      );
      return false;
    }

    return true;
  }

  async function loadRazorpay() {
    return new Promise<boolean>((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script =
        document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");
    setSuccess(false);

   if (!validateForm()) {
  return;
}

if (!termsAccepted) {
  setMessage("Please accept the Terms & Conditions before continuing.");
  return;
}



    setLoading(true);

    try {
      /*
       * Generate registration number
       */

      const registrationNumber = `updtcl-${Date.now()}`;
      const registrationId = crypto.randomUUID();

      /*
       * Create registration in Supabase
       */

const { error: registrationError } = await supabase
  .from("registrations")
 .insert({
  id: registrationId,
  registration_number: registrationNumber,

    first_name: form.firstName.trim(),
    last_name: form.lastName.trim(),

    date_of_birth: form.dob,
    age_group: form.ageGroup,

    playing_speciality: form.speciality,

    email: form.email.trim().toLowerCase(),

    mobile: form.mobile.trim(),

    district: form.district.trim(),
    state: form.state.trim(),

    amount: 999,

    payment_status: "PENDING",
    registration_status: "PENDING",
  });
      if (registrationError) {
        console.error(
          "Registration insert failed:",
          registrationError
        );

        throw new Error(
          registrationError.message ||
            "Unable to create registration."
        );
      }

      /*
       * Load Razorpay
       */

      const razorpayLoaded =
        await loadRazorpay();

      if (!razorpayLoaded) {
        throw new Error(
          "Unable to load Razorpay. Please check your internet connection and try again."
        );
      }

      const Razorpay = window.Razorpay;

      if (!Razorpay) {
        throw new Error("Razorpay failed to initialize.");
      }

      /*
       * Create Razorpay order
       */

      const orderResponse = await fetch(
        "/api/razorpay/create-order",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            amount: 999,
            currency: "INR",
            receipt: registrationNumber,
           registrationId: registrationId,
          }),
        }
      );

      const orderData =
        await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(
          orderData.error ||
            "Unable to create payment order."
        );
      }

      /*
       * Save Razorpay order ID
       */

      
      /*
       * Open Razorpay
       */

      const razorpay =
        new Razorpay({
          key: orderData.keyId,

          amount: orderData.amount,

          currency: orderData.currency,

          name: "updtcl T10",

          description:
            "Uttar Pradesh District Tenish Cricket League",

          order_id:
            orderData.orderId,

          prefill: {
            name:
              `${form.firstName} ${form.lastName}`,

            email: form.email,

            contact: form.mobile,
          },

         notes: {
  registration_id: registrationId,
  registration_number: registrationNumber,
},

          theme: {
            color: "#C9A45C",
          },

          handler: async function (
            response: RazorpayPaymentResponse
          ) {
            try {
              setMessage(
                "Payment received. Verifying..."
              );

              /*
               * Server-side verification
               */

              const verificationResponse =
                await fetch(
                  "/api/razorpay/verify-payment",
                  {
                    method: "POST",

                    headers: {
                      "Content-Type":
                        "application/json",
                    },

                    body: JSON.stringify({
                     registrationId:
  registrationId,

                      razorpay_payment_id:
                        response.razorpay_payment_id,

                      razorpay_order_id:
                        response.razorpay_order_id,

                      razorpay_signature:
                        response.razorpay_signature,
                    }),
                  }
                );

              const result =
                await verificationResponse.json();

              if (
                !verificationResponse.ok ||
                !result.success
              ) {
                throw new Error(
                  result.error ||
                    "Payment verification failed."
                );
              }

              setSuccess(true);

              setMessage(
                `Registration confirmed — ${result.registrationNumber}`
              );

              /*
               * Clear form after successful payment
               */

              setForm({
                firstName: "",
                lastName: "",
                dob: "",
                ageGroup: "",
                speciality: "",
                email: "",
                mobile: "",
                district: "",
                state: "Uttar Pradesh",
              });

              setTermsAccepted(false);
            } catch (error) {
              console.error(
                "Payment verification error:",
                error
              );

              setMessage(
                error instanceof Error
                  ? error.message
                  : "Payment verification failed."
              );
            } finally {
              setLoading(false);
            }
          },

          modal: {
            ondismiss: function () {
              setLoading(false);

              setMessage(
                "Payment window closed. Your registration is still pending."
              );
            },
          },
        });

      razorpay.open();
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );

      setLoading(false);
    }
  }

return (
  <div
    className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed"
    style={{
      backgroundImage: "url('/stad.jpg')",
    }}
  >
    {/* Dark overlay */}
    <div className="fixed inset-0 bg-[#11120F]/55" />

    {/* Content */}
    <div className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >
      {/* ================================= */}
      {/* 01 PERSONAL DETAILS */}
      {/* ================================= */}

      <FormSection
        number="01"
        title="Personal details"
        description="Tell us about the player."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="First name"
            required
            value={form.firstName}
            onChange={(value) =>
              updateField(
                "firstName",
                value
              )
            }
          />

          <Input
            label="Last name"
            required
            value={form.lastName}
            onChange={(value) =>
              updateField(
                "lastName",
                value
              )
            }
          />

          <Input
            label="Date of birth"
            required
            type="date"
            value={form.dob}
            onChange={(value) =>
              updateField(
                "dob",
                value
              )
            }
          />

          <Select
            label="Age group"
            required
            value={form.ageGroup}
            options={ageGroups}
            onChange={(value) =>
              updateField(
                "ageGroup",
                value
              )
            }
          />
        </div>
      </FormSection>

      {/* ================================= */}
      {/* 02 CRICKET PROFILE */}
      {/* ================================= */}

      <FormSection
        number="02"
        title="Cricket profile"
        description="Tell us how you play."
      >
        <Select
          label="Playing speciality"
          required
          value={form.speciality}
          options={specialities}
          onChange={(value) =>
            updateField(
              "speciality",
              value
            )
          }
        />
      </FormSection>

      {/* ================================= */}
      {/* 03 CONTACT DETAILS */}
      {/* ================================= */}

      <FormSection
        number="03"
        title="Contact details"
        description="How we can reach you."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Email address"
            required
            type="email"
            value={form.email}
            onChange={(value) =>
              updateField(
                "email",
                value
              )
            }
          />

          <Input
            label="Mobile number"
            required
            type="tel"
            maxLength={10}
            value={form.mobile}
            onChange={(value) =>
              updateField(
                "mobile",
                value.replace(
                  /\D/g,
                  ""
                )
              )
            }
          />
        </div>
      </FormSection>

      {/* ================================= */}
      {/* 04 REPRESENTATION */}
      {/* ================================= */}

      <FormSection
        number="04"
        title="Representation"
        description="Choose the district you represent."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="District"
            required
            value={form.district}
            onChange={(value) =>
              updateField(
                "district",
                value
              )
            }
          />

          <Input
            label="State"
            required
            value={form.state}
            onChange={(value) =>
              updateField(
                "state",
                value
              )
            }
          />
        </div>
      </FormSection>

{/* ================================= */}
{/* 05 TERMS & CONDITIONS */}
{/* ================================= */}

<section className="border border-[#11120F]/15 bg-white">

  <div className="border-b border-[#11120F]/10 px-6 py-5 sm:px-8">
    <div className="flex items-start gap-5">

      <span className="font-[family-name:var(--font-display)] text-sm font-medium text-[#C9A45C]">
        05
      </span>

      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-medium uppercase tracking-tight text-[#11120F] sm:text-3xl">
          Terms & Conditions
        </h2>

        <p className="mt-1 text-xs text-[#11120F]/40">
          Please read and accept the league terms before continuing.
        </p>
      </div>

    </div>
  </div>

  <div className="p-6 sm:p-8">

    <div className="max-h-[320px] overflow-y-auto border border-[#11120F]/10 bg-[#FAF9F5] p-5 sm:p-6">

      <div className="space-y-5 text-sm leading-7 text-[#11120F]/70">

        <p>
          यह लीग पूरी तरह से निजी एवं व्यक्तिगत है। टीम में रजिस्ट्रेशन से
          जुड़ी फीस/प्रक्रिया के अनुसार सभी खिलाड़ियों का पंजीकरण करना
          अनिवार्य होगा। प्रत्येक खिलाड़ी को वैध फोटो पहचान पत्र प्रस्तुत
          करना होगा।
        </p>

        <p>
          सभी मैच ICC के नियमों एवं निर्देशों के अनुसार खेले जाएंगे
          (जब तक लीग के विशेष नियम अलग न हों)।
        </p>

        <p>
          मैदान पर अंपायर का निर्णय अंतिम होगा।
        </p>

        <p>
          धोखाधड़ी, गाली-गलौज, मारपीट जैसे किसी भी अनुशासनहीन व्यवहार पर
          टीम या किसी खिलाड़ी को बाहर किया जा सकता है।
        </p>

        <p>
          आयोजन जो टीमों को समय, स्थान आदि की जानकारी देगा, उसमें
          आवश्यकतानुसार बदलाव करने का अधिकार आयोजक को होगा।
        </p>

        <p>
          किसी भी विवाद का निर्णय आयोजन समिति द्वारा किया जाएगा और
          आयोजन समिति का निर्णय अंतिम एवं मान्य होगा।
        </p>

        <p>
          खिलाड़ियों की सुरक्षा को लेकर पर्याप्त निगरानी एवं व्यवस्था रहेगी।
        </p>

        <p>
          आयोजन केवल खेल आयोजन के लिए जिम्मेदार होगा। खिलाड़ियों की
          व्यक्तिगत दुर्घटना या नुकसान के लिए उनकी अपनी जिम्मेदारी होगी।
        </p>

      </div>

    </div>

    {/* Acceptance */}
    <label className="mt-6 flex cursor-pointer items-start gap-3">

      <input
        type="checkbox"
        checked={termsAccepted}
        onChange={(event) =>
          setTermsAccepted(event.target.checked)
        }
        className="mt-1 size-4 shrink-0 accent-[#C9A45C]"
      />

      <span className="text-xs leading-5 text-[#11120F]/65">
        मैं उपरोक्त सभी नियम एवं शर्तों को पढ़कर स्वीकार करता हूँ
        और लीग के नियमों का पालन करने के लिए सहमत हूँ।
      </span>

    </label>

  </div>

</section>

      {/* ================================= */}
      {/* 05 PAYMENT */}
      {/* ================================= */}

      <section className="border border-[#11120F]/15 bg-white">

        <div className="border-b border-[#11120F]/10 px-6 py-5 sm:px-8">
          <div className="flex items-start gap-5">

            <span className="font-[family-name:var(--font-display)] text-sm font-medium text-[#C9A45C]">
              06
            </span>

            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-medium uppercase tracking-tight text-[#11120F] sm:text-3xl">
                Payment
              </h2>

              <p className="mt-1 text-xs text-[#11120F]/40">
                Complete your registration.
              </p>
            </div>

          </div>
        </div>

        <div className="flex flex-col gap-7 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-[#11120F]/45">
              REGISTRATION FEE
            </p>

            <div className="mt-2 flex items-end gap-3">

              <span className="font-[family-name:var(--font-display)] text-6xl font-medium leading-none tracking-[-0.05em] text-[#11120F]">
                ₹999
              </span>

              <span className="mb-1 text-xs text-[#11120F]/35">
                one-time
              </span>

            </div>
          </div>

          <div className="max-w-[280px] text-sm leading-6 text-[#11120F]/45">
            Your registration details are saved
            before you continue to secure payment.
          </div>

        </div>

        <div className="border-t border-[#11120F]/10 bg-[#F8F7F2] px-6 py-4 sm:px-8">

          <div className="flex items-center gap-3">

            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#11120F] text-white">
              <Check
                size={11}
                strokeWidth={2}
              />
            </span>

            <span className="text-xs text-[#11120F]/55">
              Secure payment powered by Razorpay
            </span>

          </div>

        </div>

      </section>

      {/* ================================= */}
      {/* MESSAGE */}
      {/* ================================= */}

      {message && (
        <div
          className={`border px-5 py-4 text-sm ${
            success
              ? "border-[#536B45]/30 bg-[#536B45]/5 text-[#536B45]"
              : "border-[#A9473C]/25 bg-[#A9473C]/5 text-[#A9473C]"
          }`}
        >
          {message}
        </div>
      )}

      {/* ================================= */}
      {/* SUBMIT */}
      {/* ================================= */}

      <button
        type="submit"
        disabled={loading || success}
        className="group flex w-full items-center justify-between bg-[#11120F] px-6 py-5 text-[#F4F2EC] transition-all duration-300 hover:bg-[#C9A45C] hover:text-[#11120F] disabled:cursor-not-allowed disabled:opacity-50 sm:px-8 sm:py-6"
      >
        <span className="text-xs font-bold tracking-[0.2em] sm:text-sm">
          {loading
            ? "PROCESSING..."
            : success
              ? "REGISTRATION CONFIRMED"
              : "CONTINUE TO PAYMENT"}
        </span>

        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-current">

          {success ? (
            <Check
              size={17}
              strokeWidth={1.5}
            />
          ) : (
            <ArrowUpRight
              size={17}
              strokeWidth={1.4}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          )}

        </span>
      </button>

      <p className="text-center text-[10px] leading-5 tracking-[0.06em] text-[#11120F]/35">
        By continuing, you confirm that the
        information provided is accurate.
      </p>
    </form>
      </div>
</div>
  );
}

/* ================================= */
/* FORM SECTION */
/* ================================= */

function FormSection({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-[#11120F]/15 bg-white">

      <div className="flex items-start gap-5 border-b border-[#11120F]/10 px-6 py-5 sm:px-8">

        <span className="font-[family-name:var(--font-display)] text-sm font-medium text-[#C9A45C]">
          {number}
        </span>

        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-medium uppercase tracking-[-0.02em] text-[#11120F] sm:text-3xl">
            {title}
          </h2>

          <p className="mt-1 text-xs text-[#11120F]/45">
            {description}
          </p>
        </div>

      </div>

      <div className="p-6 sm:p-8">
        {children}
      </div>

    </section>
  );
}

/* ================================= */
/* INPUT */
/* ================================= */

function Input({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <label className="block">

      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#11120F]/60">
        {label}

        {required && (
          <span className="ml-1 text-[#A9473C]">
            *
          </span>
        )}
      </span>

      <input
        type={type}
        value={value}
        maxLength={maxLength}
        required={required}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-12 w-full rounded-none border border-[#11120F]/20 bg-[#FAF9F5] px-4 text-sm text-[#11120F] outline-none transition hover:border-[#11120F]/35 focus:border-[#C9A45C] focus:bg-white focus:ring-2 focus:ring-[#C9A45C]/10"
      />

    </label>
  );
}

/* ================================= */
/* SELECT */
/* ================================= */

function Select({
  label,
  value,
  options,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">

      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#11120F]/60">
        {label}

        {required && (
          <span className="ml-1 text-[#A9473C]">
            *
          </span>
        )}
      </span>

      <select
        value={value}
        required={required}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-12 w-full appearance-none rounded-none border border-[#11120F]/20 bg-[#FAF9F5] px-4 text-sm text-[#11120F] outline-none transition hover:border-[#11120F]/35 focus:border-[#C9A45C] focus:bg-white focus:ring-2 focus:ring-[#C9A45C]/10"
      >
        <option value="">
          Select {label.toLowerCase()}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>

    </label>
  );
}