import { NextResponse } from "next/server";
import { Resend } from "resend";

const MAX_SUBJECT = 200;
const MAX_MESSAGE = 5000;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactPayload = {
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  website?: unknown;
};

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return NextResponse.json(
      { error: "Contact form is not configured." },
      { status: 500 },
    );
  }

  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: real users can't see this field, so a value means spam. Drop silently.
  if (asString(payload.website)) {
    return NextResponse.json({ ok: true });
  }

  const email = asString(payload.email);
  const subject = asString(payload.subject);
  const message = asString(payload.message);

  const errors: Record<string, string> = {};
  if (!emailPattern.test(email)) errors.email = "A valid email is required.";
  if (!subject) errors.subject = "A subject is required.";
  else if (subject.length > MAX_SUBJECT) errors.subject = "Subject is too long.";
  if (!message) errors.message = "A message is required.";
  else if (message.length > MAX_MESSAGE) errors.message = "Message is too long.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `Contact form: ${subject}`,
    text: `From: ${email}\nSubject: ${subject}\n\n${message}`,
  });

  if (error) {
    return NextResponse.json(
      { error: "Unable to send your message. Please try again later." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
