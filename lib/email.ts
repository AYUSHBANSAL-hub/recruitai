// src/lib/email.ts
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

interface EmailTemplate {
  subject: string
  html: string
}
const welcomeEmailTemplates: Record<
  string,
  (name: string) => EmailTemplate
> = {
  welcome: (name) => ({
    subject: `Welcome to HirezApp`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to HirezApp</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4F46E5; padding: 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { padding: 20px; background-color: #f9fafb; }
          .footer { background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; }
          .button { display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>HirezApp</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>Welcome to HirezApp! We're excited to have you on board.</p>
            <p>We're here to help you find your dream job and make the hiring process as smooth as possible.</p>
            <p>If you have any questions, please don't hesitate to contact our support team.</p>
            <p>Best regards,<br/>HirezApp Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} HirezApp. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
}

const statusEmailTemplates: Record<
  string,
  (name: string, jobTitle: string, applicationDate: string, calendarLink?: string) => EmailTemplate
> = {
  reviewed: (name, jobTitle, applicationDate) => ({
    subject: `Your application for ${jobTitle} has been reviewed | HirezApp`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Reviewed</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4F46E5; padding: 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { padding: 20px; background-color: #f9fafb; }
          .footer { background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; }
          .button { display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; }
          .info-box { background-color: #e0e7ff; border-left: 4px solid #4F46E5; padding: 10px 15px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>HirezApp</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>Thank you for your application for the <strong>${jobTitle}</strong> position submitted on ${applicationDate}.</p>
            <p>We're pleased to inform you that our team has reviewed your application and qualifications.</p>
            <div class="info-box">
              <p><strong>Application Status:</strong> Under Review</p>
              <p><strong>Position:</strong> ${jobTitle}</p>
              <p><strong>Application Date:</strong> ${applicationDate}</p>
            </div>
            <p>Our hiring team is currently evaluating all candidates, and we will be in touch soon with more information about next steps.</p>
            <p>If you have any questions in the meantime, please don't hesitate to contact our recruitment team.</p>
            <p>Thank you for your interest in joining our team!</p>
            <p>Best regards,<br/>HirezApp Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} HirezApp. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
  shortlisted: (name, jobTitle, applicationDate, calendarLink) => ({
    subject: `Congratulations! You've been shortlisted for ${jobTitle} | HirezApp`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Shortlisted</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4F46E5; padding: 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { padding: 20px; background-color: #f9fafb; }
          .footer { background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; }
          .button { display: inline-block; background-color: #4F46E5; color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0; text-align: center; }
          .info-box { background-color: #e0e7ff; border-left: 4px solid #4F46E5; padding: 10px 15px; margin: 15px 0; }
          .success-banner { background-color: #10B981; color: white; padding: 10px; text-align: center; font-weight: bold; border-radius: 4px; margin-bottom: 20px; }
          .next-steps { background-color: #f3f4f6; padding: 15px; border-radius: 4px; margin: 20px 0; }
          .next-steps h3 { margin-top: 0; color: #4F46E5; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>HirezApp</h1>
          </div>
          <div class="content">
            <div class="success-banner">
              Congratulations! Your application has been shortlisted
            </div>
            <h2>Hello ${name},</h2>
            <p>Great news! We're pleased to inform you that you've been shortlisted for the <strong>${jobTitle}</strong> position that you applied for on ${applicationDate}.</p>
            
            <div class="info-box">
              <p><strong>Application Status:</strong> Shortlisted</p>
              <p><strong>Position:</strong> ${jobTitle}</p>
              <p><strong>Application Date:</strong> ${applicationDate}</p>
            </div>
            
            <p>Your qualifications, experience, and skills have impressed our hiring team, and we would like to invite you to the next stage of our selection process.</p>
            
            <div class="next-steps">
              <h3>Next Steps</h3>
              <p>Please schedule an interview with our hiring team using the button below. You'll be able to select a date and time that works best for you.</p>
              <p>During the interview, we'll discuss your experience, skills, and how they align with the role. You'll also have the opportunity to learn more about the position and our company.</p>
            </div>
            
            <div style="text-align: center;">
              <a href="${calendarLink}" class="button">Schedule Your Interview</a>
            </div>
            
            <p>If you have any questions before your interview or need to reschedule, please contact our recruitment team directly.</p>
            
            <p>We look forward to speaking with you soon!</p>
            
            <p>Best regards,<br/>HirezApp Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} HirezApp. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
  rejected: (name, jobTitle, applicationDate) => ({
    subject: `Update on your ${jobTitle} application | HirezApp`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Update</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4F46E5; padding: 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { padding: 20px; background-color: #f9fafb; }
          .footer { background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; }
          .button { display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; }
          .info-box { background-color: #e0e7ff; border-left: 4px solid #4F46E5; padding: 10px 15px; margin: 15px 0; }
          .resources { background-color: #f3f4f6; padding: 15px; border-radius: 4px; margin: 20px 0; }
          .resources h3 { margin-top: 0; color: #4F46E5; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>HirezApp</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>Thank you for your interest in the <strong>${jobTitle}</strong> position at our company and for taking the time to submit your application on ${applicationDate}.</p>
            
            <div class="info-box">
              <p><strong>Application Status:</strong> Not Selected</p>
              <p><strong>Position:</strong> ${jobTitle}</p>
              <p><strong>Application Date:</strong> ${applicationDate}</p>
            </div>
            
            <p>After careful consideration of all applications, we regret to inform you that we have decided to move forward with other candidates whose qualifications more closely align with our current needs for this specific role.</p>
            
            <p>Please know that this decision does not reflect on your skills or potential. We received many qualified applications, making this a difficult decision.</p>
            
            <div class="resources">
              <h3>What's Next?</h3>
              <p>We encourage you to apply for future positions that match your skills and experience. We retain all applications for six months and will consider your profile for upcoming opportunities that may be a better fit.</p>
              <p>You can view all our current openings on our careers page.</p>
            </div>
            
            <p>We appreciate your interest in joining our team and wish you success in your job search and professional endeavors.</p>
            
            <p>Best regards,<br/>HirezApp Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} HirezApp. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
}

export async function sendStatusUpdateEmail(
  email: string,
  name: string,
  status: string,
  jobTitle: string,
  applicationDate: string,
  calendarLink?: string,
) {
  const template = statusEmailTemplates[status]?.(name, jobTitle, applicationDate, calendarLink)
  if (!template) return

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      ...template,
    })

    console.log(`Email sent to ${email} with status: ${status}`)
    return { success: true }
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}

export async function sendWelcomeEmail(email: string, name?: string) {
  const template = welcomeEmailTemplates.welcome(name || "User")
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      ...template,
    })
    console.log(`Welcome email sent to ${email}`)
    return { success: true }
  } catch (error) {
    console.error("Error sending welcome email:", error)
    throw error
  }
}

const applicationSubmittedEmailTemplate: Record<
  string,
  (name: string, jobTitle: string) => EmailTemplate
> = {
  submitted: (name, jobTitle) => ({
    subject: `Application Submitted for ${jobTitle} | HirezApp`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Update</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4F46E5; padding: 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { padding: 20px; background-color: #f9fafb; }
          .footer { background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; }
          .button { display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; }
          .info-box { background-color: #e0e7ff; border-left: 4px solid #4F46E5; padding: 10px 15px; margin: 15px 0; }
          .resources { background-color: #f3f4f6; padding: 15px; border-radius: 4px; margin: 20px 0; }
          .resources h3 { margin-top: 0; color: #4F46E5; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>HirezApp</h1>
          </div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>Thanks for applying to <strong>${jobTitle}</strong>!. There are a ton of great companies out there, so we appreciate your interest in joining our team.</p>
            
            <p>While we’re not able to reach out to every applicant, our recruiting team will contact you if your skills and experience are a strong match for the role. In the meantime, join the conversation about job opportunities and life at ${jobTitle} on our LinkedIn page..</p>
            <p>We appreciate your interest in joining our team and wish you success in your job search and professional endeavors.</p>
            
            <p>Best regards,<br/>HirezApp Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} HirezApp. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
}

export async function sendApplicationSubmittedEmail(
  email: string,
  name: string,
  jobTitle: string
) {
  const template = applicationSubmittedEmailTemplate.submitted(name, jobTitle)
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      ...template,
    })
    console.log(`Application submitted email sent to ${email}`)
    return { success: true }
  } catch (error) {
    console.error("Error sending application submitted email:", error)
    throw error
  }
}
