import nodemailer from "nodemailer";
import { env } from "./env.js";

let cachedTransporter;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;
  if (!env.SMTP_HOST || !env.SMTP_PORT || !env.SMTP_USER || !env.SMTP_PASS) return null;

  cachedTransporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: !!env.SMTP_SECURE,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
  return cachedTransporter;
}

export async function sendInquiryNotificationEmail(inquiry) {
  const transporter = getTransporter();
  if (!transporter) return { skipped: true };
  if (!env.MAIL_TO || !env.MAIL_FROM) return { skipped: true };

  const subject = `New Inquiry: ${inquiry.service} — ${inquiry.name}`;
  const text = [
    "New inquiry received:",
    "",
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Phone: ${inquiry.phone}`,
    `Service: ${inquiry.service}`,
    "",
    "Message:",
    inquiry.message,
    "",
    `Created: ${new Date(inquiry.createdAt).toISOString()}`,
  ].join("\n");

  await transporter.sendMail({
    from: env.MAIL_FROM,
    to: env.MAIL_TO,
    subject,
    text,
    replyTo: inquiry.email,
  });

  return { skipped: false };
}

