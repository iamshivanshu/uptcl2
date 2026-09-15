import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const amount = Number(body.amount);
    const registrationId = body.registrationId;

    // -----------------------------
    // 1. Validate request
    // -----------------------------

    if (amount !== 999) {
      return NextResponse.json(
        {
          error: "Invalid registration amount.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof registrationId !== "string" ||
      !registrationId
    ) {
      return NextResponse.json(
        {
          error: "Registration ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------
    // 2. Check Razorpay credentials
    // -----------------------------

    if (
      !process.env.RAZORPAY_KEY_ID ||
      !process.env.RAZORPAY_KEY_SECRET
    ) {
      return NextResponse.json(
        {
          error: "Razorpay keys are not configured.",
        },
        {
          status: 500,
        }
      );
    }

    // -----------------------------
    // 3. Check Supabase server key
    // -----------------------------

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return NextResponse.json(
        {
          error: "Supabase server credentials are not configured.",
        },
        {
          status: 500,
        }
      );
    }

    // -----------------------------
    // 4. Create Supabase admin client
    // -----------------------------

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // -----------------------------
    // 5. Verify registration exists
    // -----------------------------

    const { data: registration, error: registrationError } =
      await supabaseAdmin
        .from("registrations")
        .select(
          "id, registration_number, amount, payment_status"
        )
        .eq("id", registrationId)
        .single();

    if (registrationError || !registration) {
      console.error(
        "Registration lookup error:",
        registrationError
      );

      return NextResponse.json(
        {
          error: "Registration not found.",
        },
        {
          status: 404,
        }
      );
    }

    // -----------------------------
    // 6. Verify database amount
    // -----------------------------

    if (registration.amount !== 999) {
      return NextResponse.json(
        {
          error: "Invalid registration amount.",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------
    // 7. Prevent duplicate payment order
    // -----------------------------

    if (registration.payment_status === "PAID") {
      return NextResponse.json(
        {
          error: "Registration is already paid.",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------
    // 8. Create Razorpay client
    // -----------------------------

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // -----------------------------
    // 9. Create Razorpay order
    // -----------------------------

    const order = await razorpay.orders.create({
      amount: 99900,
      currency: "INR",
      receipt: registration.registration_number,
      notes: {
        registrationId: registrationId,
        registrationNumber:
          registration.registration_number,
      },
    });

    // -----------------------------
    // 10. Save Razorpay order ID
    // -----------------------------

    const { error: updateError } = await supabaseAdmin
      .from("registrations")
      .update({
        razorpay_order_id: order.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", registrationId);

    if (updateError) {
      console.error(
        "Failed to save Razorpay order ID:",
        updateError
      );

      // Try to prevent an unlinked payment order
      try {
        await razorpay.orders.fetch(order.id);
      } catch {
        // Ignore cleanup failure
      }

      return NextResponse.json(
        {
          error:
            "Payment order was created but could not be linked to registration.",
        },
        {
          status: 500,
        }
      );
    }

    // -----------------------------
    // 11. Return order to frontend
    // -----------------------------

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      registrationId: registrationId,
    });
  } catch (error) {
    console.error(
      "Razorpay order error:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to create Razorpay order.",
      },
      {
        status: 500,
      }
    );
  }
}