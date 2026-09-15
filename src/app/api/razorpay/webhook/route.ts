import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();

    const signature = request.headers.get(
      "x-razorpay-signature"
    );

    if (!signature) {
      return NextResponse.json(
        { error: "Missing webhook signature." },
        { status: 400 }
      );
    }

    if (
      !process.env.RAZORPAY_WEBHOOK_SECRET ||
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return NextResponse.json(
        { error: "Server configuration is incomplete." },
        { status: 500 }
      );
    }

    /*
     * Verify Razorpay webhook signature
     */

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_WEBHOOK_SECRET
      )
      .update(rawBody)
      .digest("hex");

    const signaturesMatch =
      expectedSignature.length === signature.length &&
      crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(signature)
      );

    if (!signaturesMatch) {
      return NextResponse.json(
        { error: "Invalid webhook signature." },
        { status: 400 }
      );
    }

    const event = JSON.parse(rawBody);

    /*
     * Handle payment captured
     */

    if (event.event === "payment.captured") {
      const payment = event.payload?.payment?.entity;

      const paymentId = payment?.id;
      const orderId = payment?.order_id;
      const amount = payment?.amount;

      if (!paymentId || !orderId) {
        return NextResponse.json(
          { error: "Invalid payment payload." },
          { status: 400 }
        );
      }

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );

      /*
       * Find registration using Razorpay order ID.
       */

      const { data: registration, error } =
        await supabase
          .from("registrations")
          .select("id, amount, payment_status")
          .eq("razorpay_order_id", orderId)
          .single();

      if (error || !registration) {
        console.error(
          "Registration not found for order:",
          orderId
        );

        return NextResponse.json({
          received: true,
        });
      }

      /*
       * Make sure amount is correct.
       *
       * ₹999 = 99900 paise
       */

      if (amount !== 99900) {
        console.error(
          "Incorrect payment amount:",
          amount
        );

        return NextResponse.json(
          { error: "Invalid payment amount." },
          { status: 400 }
        );
      }

      /*
       * Idempotency:
       *
       * If already marked PAID, don't process it again.
       */

      if (registration.payment_status === "PAID") {
        return NextResponse.json({
          received: true,
        });
      }

      /*
       * Mark registration as paid.
       */

      const { error: updateError } =
        await supabase
          .from("registrations")
          .update({
            razorpay_payment_id: paymentId,
            payment_status: "PAID",
            registration_status: "CONFIRMED",
            updated_at: new Date().toISOString(),
          })
          .eq("id", registration.id);

      if (updateError) {
        console.error(
          "Registration update error:",
          updateError
        );

        return NextResponse.json(
          {
            error:
              "Unable to update registration.",
          },
          { status: 500 }
        );
      }
    }

    /*
     * Handle failed payments
     */

    if (event.event === "payment.failed") {
      const payment = event.payload?.payment?.entity;

      const paymentId = payment?.id;
      const orderId = payment?.order_id;

      if (orderId) {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        await supabase
          .from("registrations")
          .update({
            razorpay_payment_id: paymentId || null,
            payment_status: "FAILED",
            registration_status: "PENDING",
            updated_at: new Date().toISOString(),
          })
          .eq("razorpay_order_id", orderId);
      }
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error("Razorpay webhook error:", error);

    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 500 }
    );
  }
}