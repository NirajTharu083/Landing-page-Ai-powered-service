import { NextResponse } from "next/server";

export const runtime = "nodejs";

const RECIPIENT_EMAIL = "nirajtharu083@gmail.com";

type ConsultationPayload = {
  fullName?: unknown;
  email?: unknown;
  whatsapp?: unknown;
  businessName?: unknown;
  website?: unknown;
  message?: unknown;
  companyWebsite?: unknown;
};

const clean = (value: unknown, maxLength: number) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

const escapeHtml = (value: string) =>
  value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#039;",
      '"': "&quot;",
    };
    return entities[character];
  });

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ConsultationPayload;

    // Bots often populate this hidden field. Return success without sending.
    if (clean(body.companyWebsite, 200)) {
      return NextResponse.json({ success: true });
    }

    const submission = {
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

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured.");
      return NextResponse.json(
        { error: "Email delivery is not configured yet. Please contact Digital Niraj directly." },
        { status: 503 },
      );
    }

    const from =
      process.env.RESEND_FROM_EMAIL ||
      "Digital Niraj <onboarding@resend.dev>";

    const rows = [
      ["Full Name", submission.fullName],
      ["Active Email", submission.email],
      ["WhatsApp Number", submission.whatsapp],
      ["Business Name", submission.businessName],
      ["Website or Facebook URL", submission.website || "Not provided"],
      ["Message", submission.message || "Not provided"],
    ]
      .map(
        ([label, value]) => `
          <tr>
            <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;font-weight:700;color:#334155;vertical-align:top;">${escapeHtml(label)}</td>
            <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#475569;white-space:pre-wrap;">${escapeHtml(value)}</td>
          </tr>`,
      )
      .join("");

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [RECIPIENT_EMAIL],
        reply_to: submission.email,
        subject: `New consultation request from ${submission.fullName}`,
        html: `
          <div style="background:#f8fafc;padding:32px;font-family:Arial,sans-serif;color:#0f172a;">
            <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
              <div style="padding:24px;background:#1d4ed8;color:#ffffff;">
                <p style="margin:0 0 6px;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#bfdbfe;">Digital Niraj</p>
                <h1 style="margin:0;font-size:24px;">New AI Marketing Consultation</h1>
              </div>
              <table role="presentation" style="width:100%;border-collapse:collapse;">${rows}</table>
              <p style="margin:0;padding:20px 24px;color:#64748b;font-size:13px;">Submitted from digital.nirajtharu.com.np</p>
            </div>
          </div>`,
      }),
    });

    if (!resendResponse.ok) {
      const providerError = await resendResponse.text();
      console.error("Resend delivery failed:", providerError);
      return NextResponse.json(
        { error: "We couldn't send your request right now. Please try again or contact us on WhatsApp." },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Consultation submission failed:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
