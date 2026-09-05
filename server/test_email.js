import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import nodemailer from "nodemailer";

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

console.log("=== Gmail SMTP Diagnostic ===");
console.log("EMAIL_USER:", EMAIL_USER);
console.log("EMAIL_PASS length:", EMAIL_PASS?.length, "(should be 16 for App Password)");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

async function run() {
  // 1. Verify SMTP connection
  console.log("\n--- Step 1: Verifying SMTP connection... ---");
  try {
    await transporter.verify();
    console.log("✅ SMTP connection OK");
  } catch (err) {
    console.error("❌ SMTP connection FAILED:", err.message);
    console.error("\n>>> SOLUTION: Go to https://myaccount.google.com/apppasswords");
    console.error(">>> Create a new App Password for 'Mail' + 'Windows Computer'");
    console.error(">>> Use that 16-character password as EMAIL_PASS in server/.env\n");
    process.exit(1);
  }

  // 2. Send a real test OTP email
  const TEST_TO = EMAIL_USER; // send to yourself
  const TEST_OTP = "8472";
  console.log(`\n--- Step 2: Sending test OTP to ${TEST_TO}... ---`);
  try {
    const info = await transporter.sendMail({
      from: `"Eventora" <${EMAIL_USER}>`,
      to: TEST_TO,
      subject: "Eventora Test OTP",
      html: `<h2>Test OTP: <span style="color:#E50914;font-size:32px;letter-spacing:4px">${TEST_OTP}</span></h2><p>If you received this, Gmail SMTP is working correctly!</p>`,
    });
    console.log("✅ Email sent! Message ID:", info.messageId);
    console.log(">>> Check Sent/Spam folder in Gmail for the test OTP email.");
  } catch (err) {
    console.error("❌ Email sending FAILED:", err.message);
  }
}

run();
