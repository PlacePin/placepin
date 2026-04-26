import axios from 'axios';

const resendClient = axios.create({
  baseURL: 'https://api.resend.com',
  headers: {
    Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export const emailInviteToTenant = async (referralCode: string, tenantName: string, tenantEmail: string) => {
  try {
    const { data } = await resendClient.post('/emails', {
      from: 'PlacePin <support@placepin.io>',
      to: [tenantEmail],
      subject: 'Your Referral Code is Ready 🎉',
      text: `Hey ${tenantName}, your exclusive referral code is: ${referralCode}`,
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
      from: 'PlacePin <support@placepin.io>',
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