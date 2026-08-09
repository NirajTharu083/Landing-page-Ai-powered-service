import { NextResponse } from "next/server";
import { createOrder, type OrderSubmission } from "@/lib/order-service";

export const runtime = "nodejs";

type IncomingOrder = Partial<Record<keyof OrderSubmission | "companyWebsite", unknown>>;

const clean = (value: unknown, maxLength: number) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as IncomingOrder;

    if (clean(body.companyWebsite, 200)) {
      return NextResponse.json({ success: true });
    }

    const submission: OrderSubmission = {
      fullName: clean(body.fullName, 120),
      email: clean(body.email, 254),
      whatsapp: clean(body.whatsapp, 40),
      businessName: clean(body.businessName, 160),
      website: clean(body.website, 500),
      message: clean(body.message, 3000),
    };

    if (
      !submission.fullName ||
      !submission.businessName ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submission.email) ||
      !/^\+?[0-9\s()-]{7,20}$/.test(submission.whatsapp)
    ) {
      return NextResponse.json(
        { error: "Please check the required form details and try again." },
        { status: 400 },
      );
    }

    const order = await createOrder(submission);
    return NextResponse.json({ success: true, orderId: order.orderId });
  } catch (error) {
    console.error("Order submission failed:", error);
    return NextResponse.json(
      { error: "We couldn't complete your request right now. Please try again or contact us on WhatsApp." },
      { status: 500 },
    );
  }
}
