import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ path: './.env' });

const transporter = nodemailer.createTransport({
    service : "gmail",
    auth : {
        user : process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASS,
    },
});



export const SendBookingEmail = async (userEmail , userName , eventName) =>{
     try {
        await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: `Booking Confirmed - ${eventName}`,
        html: `
                      <div style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
                        <div style="max-width:520px;margin:0 auto;padding:32px 16px;">
                          <div style="background:#ffffff;border-radius:12px;padding:32px;border:1px solid #e5e7eb;">
                            <h2 style="margin:0 0 12px;color:#111827;font-size:24px;">
                              Booking Confirmed
                            </h2>

                            <p style="margin:0 0 22px;color:#4b5563;font-size:15px;line-height:1.6;">
                              Your booking for <strong>${eventName}</strong> has been confirmed successfully.
                            </p>

                            <div style="background:#111827;color:#ffffff;text-align:center;font-size:22px;font-weight:bold;padding:18px 20px;border-radius:10px;">
                              ${eventName}
                            </div>

                            <p style="margin:24px 0 0;color:#6b7280;font-size:13px;line-height:1.6;">
                              Thank you for choosing Eventora. We hope you enjoy the event.
                            </p>

                            <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0;" />

                            <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;">
                              Eventora • Event booking made simple
                            </p>
                          </div>
                        </div>
                      </div>
                    `,
    });
    
    console.log(`Booking confirmation sent to ${userEmail} `);

    } catch (error) {
        console.log(error);
    }
}

export const sendOtpEmail = async (email, otp, type = "account_verification") => {
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
          <span style="display: inline-block; background: #111827; color: #ffffff; font-size: 30px; font-weight: bold; letter-spacing: 6px; padding: 14px 22px; border-radius: 8px;">
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

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: title,
      html,
    });

    console.log(`OTP sent to ${email} for ${type}`);
  } catch (error) {
    console.log(error);
  }
};