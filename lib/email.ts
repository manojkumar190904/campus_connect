import { Resend } from "resend";

const fromEmail = "onboarding@resend.dev";

export async function sendCampusVerificationOtp(input: { to: string; name: string; otp: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[Campus Connect] Email OTP for ${input.to}: ${input.otp}`);
    }
    throw new Error("Email service is not configured. Add RESEND_API_KEY.");
  }

  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
    from: fromEmail,
    to: input.to,
    subject: "Campus Connect Email Verification OTP",
    text: [
      `Hello ${input.name},`,
      "",
      "Your Campus Connect verification OTP is:",
      "",
      input.otp,
      "",
      "This OTP will expire in 10 minutes.",
      "",
      "Do not share this OTP with anyone."
    ].join("\n")
  });

  if (result.error) {
    throw new Error(result.error.message || "Unable to send verification email");
  }
}
