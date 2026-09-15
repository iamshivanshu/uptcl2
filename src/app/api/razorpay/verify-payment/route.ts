import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      registrationId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    if (
      !registrationId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing payment information.",
        },
        { status: 400 }
      );
    }

    if (
      !process.env.RAZORPAY_KEY_SECRET ||
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration is incomplete.",
        },
        { status: 500 }
      );
    }

    /*
     * Verify Razorpay signature
     */

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    const isValid = crypto.timingSafeEqual(
      Buffer.from(generatedSignature),
      Buffer.from(razorpay_signature)
    );

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payment signature.",
        },
        { status: 400 }
      );
    }

    /*
     * Server-side Supabase client
     *
     * IMPORTANT:
     * Service role key must NEVER be exposed
     * to the browser.
     */

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    /*
     * Make sure this order belongs to this registration.
     */

    const { data: registration, error: fetchError } =
      await supabase
        .from("registrations")
        .select(
          "id, registration_number, razorpay_order_id"
        )
        .eq("id", registrationId)
        .single();

    if (fetchError || !registration) {
      return NextResponse.json(
        {
          success: false,
          error: "Registration not found.",
        },
        { status: 404 }
      );
    }

    if (
      registration.razorpay_order_id !==
      razorpay_order_id
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment order does not match registration.",
        },
        { status: 400 }
      );
    }

    /*
     * Update payment status
     */

    const { error: updateError } = await supabase
      .from("registrations")
      .update({
        razorpay_payment_id,
        razorpay_signature,
        payment_status: "PAID",
        registration_status: "CONFIRMED",
        updated_at: new Date().toISOString(),
      })
      .eq("id", registrationId);

    if (updateError) {
      console.error(updateError);

      return NextResponse.json(
        {
          success: false,
          error: "Payment verified but registration update failed.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      registrationNumber:
        registration.registration_number,
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to verify payment.",
      },
      { status: 500 }
    );
  }
}