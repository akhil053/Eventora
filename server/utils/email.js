import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

if (!resend) {
  console.warn("⚠️  RESEND_API_KEY not set — email sending is disabled. OTP emails will be logged to console only.");
}

export const SendBookingEmail = async (userEmail, userName, eventName) => {
  if (!resend) {
    console.log(`[Email disabled] Booking confirmation for ${eventName} would be sent to ${userEmail}`);
    return true;
  }
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: [userEmail],
      subject: `Booking Confirmed - ${eventName}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 30px; max-width: 600px; margin: auto;">
          <h2 style="color:#111827;">Booking Confirmed</h2>

          <p style="color:#4b5563; font-size:15px;">
            Hi ${userName},
          </p>

          <p style="color:#4b5563; font-size:15px;">
            Your booking for <strong>${eventName}</strong> has been confirmed successfully.
          </p>

          <div style="background:#111827;color:#ffffff;text-align:center;
                      font-size:22px;font-weight:bold;padding:18px 20px;
                      border-radius:10px;">
            ${eventName}
          </div>

          <p style="color:#6b7280;font-size:13px;">
            Thank you for choosing Eventora. We hope you enjoy the event.
          </p>

          <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0;" />

          <p style="color:#9ca3af;font-size:12px;text-align:center;">
            Eventora • Event booking made simple
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Booking email error:", error);
      return false;
    }

    console.log(`Booking confirmation sent to ${userEmail}`);
    return true;

  } catch (error) {
    console.error("Booking email error:", error);
    return false;
  }
};


export const sendOtpEmail = async (
  email,
  otp,
  type = "account_verification"
) => {
  if (!resend) {
    console.log(`[Email disabled] OTP for ${email} (${type}): ${otp}`);
    return { id: 'email-disabled' };
  }
  try {
    const title =
      type === "account_verification"
        ? "Verify your Eventora Account"
        : "Verify your Eventora Booking";

    const msg =
      type === "account_verification"
        ? "Please use the following OTP to verify your new Eventora account."
        : "Please use the following OTP to verify and confirm your event booking.";

    const html = `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h2 style="color: #111827;">${title}</h2>

        <p style="color: #4b5563; font-size: 15px;">
          ${msg}
        </p>

        <div style="margin: 24px 0;">
          <span style="
            display: inline-block;
            background: #111827;
            color: #ffffff;
            font-size: 30px;
            font-weight: bold;
            letter-spacing: 6px;
            padding: 14px 22px;
            border-radius: 8px;
          ">
            ${otp}
          </span>
        </div>

        <p style="color: #6b7280; font-size: 13px;">
          This OTP is valid for 10 minutes. Please do not share it with anyone.
        </p>

        <p style="color: #9ca3af; font-size: 12px; margin-top: 28px;">
          Eventora • Event booking made simple
        </p>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: [email],
      subject: title,
      html,
    });

    if (error) {
      console.error("OTP email error:", error);
      throw new Error(error.message || "Failed to send OTP email");
    }

    console.log(`OTP sent to ${email} for ${type}`);
    return data;

  } catch (error) {
    console.error("OTP email error:", error);
    throw error;
  }
};