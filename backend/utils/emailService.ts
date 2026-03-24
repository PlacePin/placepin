import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const emailInviteToTenant = async (referralCode: string, tenantName: string, tenantEmail: string) => {

  // const isSandbox = true;

  // const MAILTRAP_TEST_USERNAME = process.env.MAILTRAP_TEST_USERNAME!
  // const MAILTRAP_TEST_PASSWORD = process.env.MAILTRAP_TEST_PASSWORD!
  // const MAILTRAP_SMTP_SANDBOX = process.env.MAILTRAP_SMTP_SANDBOX!
  const GMAIL_USER = process.env.GMAIL_USER!
  const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD!
  const GMAIL_SMTP = process.env.GMAIL_SMTP!

  // Switch to real env's for productions
  // const transporter = nodemailer.createTransport({
  //   host: isSandbox ? MAILTRAP_SMTP_SANDBOX : process.env.MAILTRAP_SMTP,
  //   port: 587,
  //   secure: false,
  //   auth: {
  //     user: isSandbox ? MAILTRAP_TEST_USERNAME : process.env.MAILTRAP_USERNAME,
  //     pass: isSandbox ? MAILTRAP_TEST_PASSWORD : process.env.MAILTRAP_PASSWORD,
  //   },
  // });

  // This gmail version works fine but at scale switch over to MailTrap

  const transporter = nodemailer.createTransport({
    host: GMAIL_SMTP,
    port: 465,
    secure: true,
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    // For prod switch to domain verified email for from
    from: 'kerlin.augustin1@gmail.com',
    to: `${tenantEmail}`,
    subject: "Your Referral Code is Ready 🎉",
    text: `Hey ${tenantName}, your exclusive referral code is: ${referralCode}`,
  });

  // If you want to see the message object uncomment!
  console.log("Message sent:", info);


}

export const emailPasswordReset = async (userEmail: string, resetUrl: string) => {

  // const isSandbox = true;

  // const MAILTRAP_TEST_USERNAME = process.env.MAILTRAP_TEST_USERNAME!
  // const MAILTRAP_TEST_PASSWORD = process.env.MAILTRAP_TEST_PASSWORD!
  // const MAILTRAP_SMTP_SANDBOX = process.env.MAILTRAP_SMTP_SANDBOX!
  const GMAIL_USER = process.env.GMAIL_USER!
  const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD!
  const GMAIL_SMTP = process.env.GMAIL_SMTP!

  // Switch to real env's for productions
  // const transporter = nodemailer.createTransport({
  //   host: isSandbox ? MAILTRAP_SMTP_SANDBOX : process.env.MAILTRAP_SMTP,
  //   port: 587,
  //   secure: false,
  //   auth: {
  //     user: isSandbox ? MAILTRAP_TEST_USERNAME : process.env.MAILTRAP_USERNAME,
  //     pass: isSandbox ? MAILTRAP_TEST_PASSWORD : process.env.MAILTRAP_PASSWORD,
  //   },
  // });

  // This gmail version works fine but at scale switch over to MailTrap

  const transporter = nodemailer.createTransport({
    host: GMAIL_SMTP,
    port: 465,
    secure: true,
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    // Currently sending out email reset from personal gmail account, switch to company account when live
    from: GMAIL_USER,
    to: `${userEmail}`,
    subject: "PlacePin Password Reset Request",
    text: `
    We recieved a request to reset your password for your PlacePin account.
    Please click the link below to choose a new password. This link will expire in 1 hour
    ${resetUrl}
    `,
  });

  // If you want to see the message object uncomment!
  console.log("Message sent:", info);


}