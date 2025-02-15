// src/lib/email.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface EmailTemplate {
  subject: string;
  html: string;
}

const statusEmailTemplates: Record<string, (name: string) => EmailTemplate> = {
  reviewed: (name) => ({
    subject: "Your application has been reviewed",
    html: `
      <h1>Hello ${name},</h1>
      <p>Your application has been reviewed by our team. We will contact you soon with more information.</p>
      <p>Best regards,<br/>Recruitment Team</p>
    `,
  }),
  shortlisted: (name) => ({
    subject: `Congratulations! You've been shortlisted`,
    html: `
      <h1>Hello ${name},</h1>
      <p>We're pleased to inform you that you've been shortlisted for the position. Our team will contact you soon to schedule an interview.</p>
      <p>Best regards,<br/>Recruitment Team</p>
    `,
  }),
  rejected: (name) => ({
    subject: "Update on your application",
    html: `
      <h1>Hello ${name},</h1>
      <p>Thank you for your interest in our company. After careful consideration, we have decided to move forward with other candidates.</p>
      <p>We wish you the best in your job search.</p>
      <p>Best regards,<br/>Recruitment Team</p>
    `,
  }),
};

export async function sendStatusUpdateEmail(
  email: string,
  name: string,
  status: string
) {
  const template = statusEmailTemplates[status]?.(name);
  if (!template) return;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      ...template,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
