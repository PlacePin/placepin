import type { Request, Response } from 'express';
import { LandlordModel } from '../../database/models/Landlord.model';
import { TenantModel } from '../../database/models/Tenant.model';
import { TradesmenModel } from '../../database/models/Tradesmen.model';
import { emailSupport } from '../../utils/emailService';

export const sendSupportEmail = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { type, subject, message } = req.body as {
    type: 'support' | 'suggestion';
    subject: string;
    message: string;
  };

  if (!type || !subject?.trim() || !message?.trim()) {
    return res.status(400).json({ message: 'type, subject, and message are required.' });
  }

  if (!['support', 'suggestion'].includes(type)) {
    return res.status(400).json({ message: 'type must be "support" or "suggestion".' });
  }

  try {
    const user =
      (await LandlordModel.findById(userId).select('fullName email')) ||
      (await TenantModel.findById(userId).select('fullName email')) ||
      (await TradesmenModel.findById(userId).select('fullName email'));

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const senderName = (user.fullName as string | undefined) || 'PlacePin User';
    const senderEmail = user.email as string;

    await emailSupport(senderName, senderEmail, type, subject.trim(), message.trim());

    return res.status(200).json({ message: 'Your message has been sent.' });
  } catch (err) {
    console.error('sendSupportEmail failed:', err);
    return res.status(500).json({ error: 'Failed to send your message. Please try again.' });
  }
};
