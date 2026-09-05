import { Resend } from "resend";

// Resend client — uses HTTPS API, works on all hosting platforms including Render Free
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;
const FROM = process.env.EMAIL_FROM || "onboarding@resend.dev";

// ── Booking Confirmation Email ────────────────────────────────────────────────
export const SendBookingEmail = async (userEmail, userName, eventName) => {
  if (!resend) { console.warn("[Email] RESEND_API_KEY not set, skipping booking email."); return false; }
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: [userEmail],
      subject: `Booking Confirmed - ${eventName}`,
      html: `
        <div style="font-family:Arial,sans-serif;padding:30px;max-width:600px;margin:auto;">
          <h2 style="color:#111827;">Booking Confirmed</h2>
          <p style="color:#4b5563;font-size:15px;">Hi ${userName},</p>
          <p style="color:#4b5563;font-size:15px;">
            Your booking for <strong>${eventName}</strong> has been confirmed successfully.
          </p>
          <div style="background:#111827;color:#fff;text-align:center;font-size:22px;font-weight:bold;padding:18px 20px;border-radius:10px;margin:20px 0;">
            ${eventName}
          </div>
          <p style="color:#9ca3af;font-size:12px;text-align:center;">Eventora • Event booking made simple</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend booking email error:", error);
      return false;
    }

    console.log(`✉️  Booking confirmation sent to ${userEmail}`);
    return true;
  } catch (err) {
    console.error("Resend booking email exception:", err.message);
    return false;
  }
};

// ── OTP Email ─────────────────────────────────────────────────────────────────
export const sendOtpEmail = async (
  email,
  otp,
  type = "account_verification"
) => {
  const title =
    type === "account_verification"
      ? "Verify your Eventora Account"
      : "Verify your Eventora Booking";

  const msg =
    type === "account_verification"
      ? "Please use the following OTP to verify your new Eventora account."
      : "Please use the following OTP to verify and confirm your event booking.";

  console.log(`🔑 [OTP] ${email} (${type}): ${otp}`);

  if (!resend) {
    console.warn(`[Email] RESEND_API_KEY not set — OTP ${otp} for ${email} logged above only.`);
    return true;
  }
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: [email],
      subject: title,
      html: `
        <div style="font-family:Arial,sans-serif;text-align:center;padding:40px 20px;max-width:500px;margin:auto;">
          <h2 style="color:#111827;margin-bottom:8px;">${title}</h2>
          <p style="color:#4b5563;font-size:15px;margin-bottom:28px;">${msg}</p>
          <div style="display:inline-block;background:#E50914;color:#fff;font-size:32px;font-weight:bold;letter-spacing:8px;padding:16px 32px;border-radius:10px;">
            ${otp}
          </div>
          <p style="color:#6b7280;font-size:13px;margin-top:28px;">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
          <p style="color:#9ca3af;font-size:12px;margin-top:16px;">Eventora • Event booking made simple</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend OTP error:", error);
      throw new Error(error.message || "Failed to send OTP email");
    }

    console.log(`✉️  OTP email sent via Resend to ${email}`);
    return true;
  } catch (err) {
    console.error("Resend OTP exception:", err.message);
    throw err; // Let controller handle — don't silently swallow
  }
};