import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY || "sk_test_mock_paystack_secret_key";
    const body = await req.json();

    // Verify Paystack Webhook Signature header if present
    const hash = req.headers.get("x-paystack-signature");
    if (hash) {
      const computedHash = crypto
        .createHmac("sha512", secret)
        .update(JSON.stringify(body))
        .digest("hex");

      if (hash !== computedHash) {
        return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
      }
    }

    const event = body.event;
    const data = body.data;

    if (event === "charge.success") {
      const reference = data.reference;
      const amount = data.amount / 100; // Paystack sends in kobo
      const customerEmail = data.customer?.email;

      console.log(`[Paystack Webhook] Charge Success: Ref: ${reference}, Amount: ₦${amount}, Email: ${customerEmail}`);
      
      // Return 200 OK to acknowledge receipt
      return NextResponse.json({
        received: true,
        status: "success",
        reference,
        amount,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Paystack Webhook Error]", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
