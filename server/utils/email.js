import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import nodemailer from "nodemailer";
import { Resend } from "resend";

// Nodemailer transporter (Gmail SMTP)
const transporter =
  process.env.EMAIL_USER && process.env.EMAIL_PASS
    ? nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })
    : null;

// Resend client fallback
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

if (!transporter && !resend) {
  console.warn(
    "⚠️  No email provider configured — OTPs will be logged to console only."
  );
}

export const SendBookingEmail = async (userEmail, userName, eventName) => {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 30px; max-width: 600px; margin: auto;">
      <h2 style="color:#111827;">Booking Confirmed</h2>
      <p style="color:#4b5563; font-size:15px;">Hi ${userName},</p>
      <p style="color:#4b5563; font-size:15px;">
        Your booking for <strong>${eventName}</strong> has been confirmed successfully.
      </p>
      <div style="background:#111827;color:#ffffff;text-align:center;font-size:22px;font-weight:bold;padding:18px 20px;border-radius:10px;margin:20px 0;">
        ${eventName}
      </div>
      <p style="color:#9ca3af;font-size:12px;text-align:center;">
        Eventora • Event booking made simple
      </p>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"Eventora" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: `Booking Confirmed - ${eventName}`,
        html,
      });
      console.log(`✉️ Booking confirmation email sent via Nodemailer to ${userEmail}`);
      return true;
    } catch (err) {
      console.error("Nodemailer booking email error:", err.message);
    }
  }

  if (resend) {
    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "onboarding@resend.dev",
        to: [userEmail],
        subject: `Booking Confirmed - ${eventName}`,
        html,
      });
      console.log(`✉️ Booking confirmation email sent via Resend to ${userEmail}`);
      return true;
    } catch (err) {
      console.error("Resend booking email error:", err.message);
    }
  }

  console.log(`[Email disabled] Booking confirmation for ${eventName} would be sent to ${userEmail}`);
  return true;
};

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

  const html = `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
      <h2 style="color: #111827;">${title}</h2>

      <p style="color: #4b5563; font-size: 15px;">
        ${msg}
      </p>

      <div style="margin: 24px 0;">
        <span style="
          display: inline-block;
          background: #E50914;
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

  console.log(`🔑 [OTP GENERATED] ${email} (${type}): ${otp}`);

  // 1. Try Nodemailer (Gmail SMTP configured in .env)
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"Eventora" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: title,
        html,
      });
      console.log(`✉️ OTP sent via Nodemailer (Gmail) to ${email}`);
      return true;
    } catch (err) {
      console.error("Nodemailer OTP sending error:", err.message);
    }
  }

  // 2. Try Resend if configured
  if (resend) {
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || "onboarding@resend.dev",
        to: [email],
        subject: title,
        html,
      });

      if (error) {
        console.error("Resend OTP sending error:", error);
      } else {
        console.log(`✉️ OTP sent via Resend to ${email}`);
        return true;
      }
    } catch (err) {
      console.error("Resend exception:", err.message);
    }
  }

  // Always return true so the user is never blocked from completing verification/booking
  return true;
};