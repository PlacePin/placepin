import { referralEmailHtml } from './emailInviteTemplate';
import axios from 'axios';

const resendClient = axios.create({
  baseURL: 'https://api.resend.com',
  headers: {
    Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL

export const emailInviteToTenant = async (referralCode: string, tenantName: string, tenantEmail: string) => {
  try {
    const { data } = await resendClient.post('/emails', {
      from: `PlacePin <${NOTIFY_EMAIL}>`,
      to: [tenantEmail],
      subject: 'Your Referral Code is Ready 🎉',
      html: referralEmailHtml(tenantName, referralCode),
    });
    console.log('Invite email sent:', data?.id);
  } catch (err: any) {
    console.error('emailInviteToTenant failed:', err.message);
    throw err;
  }
};

export const emailPasswordReset = async (userEmail: string, resetUrl: string) => {
  try {
    const { data } = await resendClient.post('/emails', {
      from: `PlacePin <${NOTIFY_EMAIL}>`,
      to: [userEmail],
      subject: 'PlacePin Password Reset Request',
      text: `We received a request to reset your password.\n\nClick the link below to choose a new password. This link will expire in 1 hour:\n\n${resetUrl}`,
    });
    console.log('Password reset email sent:', data?.id);
  } catch (err: any) {
    console.error('emailPasswordReset failed:', err.message);
    throw err;
  }
};

export const emailSupport = async (
  senderName: string,
  senderEmail: string,
  type: 'support' | 'suggestion',
  subject: string,
  message: string,
) => {
  try {
    const { data } = await resendClient.post('/emails', {
      from: `PlacePin <${NOTIFY_EMAIL}>`,
      to: ['kerlin@placepin.io'],
      reply_to: senderEmail,
      subject: `[${type === 'suggestion' ? 'Suggestion' : 'Support'}] ${subject}`,
      html: `
        <p><strong>From:</strong> ${senderName} (${senderEmail})</p>
        <p><strong>Type:</strong> ${type === 'suggestion' ? 'Suggestion' : 'Support Request'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr />
        <p>${message.replace(/\n/g, '<br />')}</p>
      `,
    });
    console.log('Support email sent:', data?.id);
  } catch (err: any) {
    console.error('emailSupport failed:', err.message);
    throw err;
  }
};