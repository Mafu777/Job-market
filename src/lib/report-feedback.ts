type FeedbackInput = {
  email: string | null;
  phone: string | null;
  contactMethod: "EMAIL" | "PHONE" | "EITHER";
  subject: string;
  message: string;
};

type EmailInput = {
  to: string;
  subject: string;
  message: string;
};

export async function sendReportEmail(input: EmailInput) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey || apiKey.includes("your_") || apiKey.includes("replace_")) {
    throw new Error(
      "Email feedback is not configured. Add a real RESEND_API_KEY to .env and restart the server."
    );
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.FEEDBACK_FROM_EMAIL ?? "JobConnect SA <onboarding@resend.dev>",
      to: [input.to],
      subject: input.subject,
      text: input.message,
    }),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    const providerError = await response.json().catch(() => null) as { message?: string } | null;
    if (response.status === 401) {
      throw new Error("Resend rejected the API key. Create a new Resend key, update RESEND_API_KEY in .env, and restart the server.");
    }
    throw new Error(providerError?.message ?? `Email provider returned ${response.status}`);
  }
}

export async function sendReportFeedback(input: FeedbackInput) {
  const wantsEmail = input.contactMethod !== "PHONE";
  const wantsPhone = input.contactMethod !== "EMAIL";
  const resendConfigured = Boolean(
    process.env.RESEND_API_KEY?.trim() &&
      !process.env.RESEND_API_KEY.includes("your_") &&
      !process.env.RESEND_API_KEY.includes("replace_")
  );

  if (wantsEmail && input.email && resendConfigured) {
    await sendReportEmail({ to: input.email, subject: input.subject, message: input.message });
    return "EMAIL" as const;
  }

  if (wantsPhone && input.phone && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_NUMBER) {
    const credentials = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64");
    const body = new URLSearchParams({
      From: process.env.TWILIO_FROM_NUMBER,
      To: input.phone,
      Body: input.message.slice(0, 1500),
    });
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
      method: "POST",
      headers: { Authorization: `Basic ${credentials}`, "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error(`SMS provider returned ${response.status}`);
    return "PHONE" as const;
  }

  throw new Error(input.contactMethod === "PHONE" ? "Phone feedback is not configured." : "Email feedback is not configured.");
}