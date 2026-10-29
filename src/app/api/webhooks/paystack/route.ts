import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const webhookSchema = z.object({
  event: z.string(),
  data: z
    .object({
      reference: z.string().optional(),
      amount: z.number().nonnegative().optional(),
    })
    .passthrough()
    .optional(),
});

export async function POST(request: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "Webhook is not configured." },
      { status: 503 },
    );
  }

  const signature = request.headers.get("x-paystack-signature");
  if (!signature || !/^[\da-f]{128}$/i.test(signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  try {
    const rawBody = await request.text();
    const expectedSignature = createHmac("sha512", secret)
      .update(rawBody)
      .digest();
    const receivedSignature = Buffer.from(signature, "hex");
    if (
      receivedSignature.length !== expectedSignature.length ||
      !timingSafeEqual(receivedSignature, expectedSignature)
    ) {
      return NextResponse.json(
        { error: "Invalid signature." },
        { status: 401 },
      );
    }

    let body: unknown;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const parsed = webhookSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    if (parsed.data.event === "charge.success") {
      const { reference, amount } = parsed.data.data ?? {};
      if (!reference || amount === undefined) {
        return NextResponse.json(
          { error: "Invalid payment event." },
          { status: 400 },
        );
      }

      return NextResponse.json({
        received: true,
        status: "success",
        reference,
        amount: amount / 100,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error(
      "Paystack webhook processing failed.",
      error instanceof Error ? error.name : "Unknown error",
    );
    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 500 },
    );
  }
}
