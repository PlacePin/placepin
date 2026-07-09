import type { Request, Response } from 'express';
import { TenantModel } from '../../database/models/Tenant.model';
import { LandlordModel } from '../../database/models/Landlord.model';
import { SuggestionBoxMessageModel } from '../../database/models/SuggestionBoxMessage.model';

export const submitSuggestion = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { message } = req.body as { message: string };

  if (!message?.trim()) {
    return res.status(400).json({ message: 'message is required.' });
  }

  const trimmed = message.trim();
  if (trimmed.length < 10) {
    return res.status(400).json({ message: 'Message must be at least 10 characters.' });
  }
  if (trimmed.length > 2000) {
    return res.status(400).json({ message: 'Message must be 2000 characters or fewer.' });
  }

  try {
    const tenant = await TenantModel.findById(userId).select('referredByLandlord').lean();

    if (!tenant) {
      return res.status(403).json({ message: 'Only tenants can submit suggestions.' });
    }

    if (!tenant.referredByLandlord) {
      return res.status(403).json({ message: 'No landlord associated with your account.' });
    }

    await SuggestionBoxMessageModel.create({
      landlordId: tenant.referredByLandlord,
      tenantId: userId,
      message: trimmed,
    });

    return res.status(201).json({ message: 'Your suggestion has been sent.' });
  } catch (err) {
    console.error('submitSuggestion failed:', err);
    return res.status(500).json({ error: 'Failed to send your suggestion. Please try again.' });
  }
};

export const getSuggestions = async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const landlord = await LandlordModel.findById(userId).select('_id').lean();

    if (!landlord) {
      return res.status(403).json({ message: 'Only landlords can view suggestions.' });
    }

    const suggestions = await SuggestionBoxMessageModel.find({ landlordId: userId })
      .select('_id message sentAt readAt')
      .sort({ sentAt: -1 })
      .lean();

    return res.status(200).json({
      suggestions: suggestions.map((s) => ({
        id: s._id,
        message: s.message,
        sentAt: s.sentAt,
        read: !!s.readAt,
      })),
    });
  } catch (err) {
    console.error('getSuggestions failed:', err);
    return res.status(500).json({ error: 'Failed to fetch suggestions. Please try again.' });
  }
};

export const markSuggestionRead = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { id } = req.params;

  try {
    const suggestion = await SuggestionBoxMessageModel.findById(id).select('landlordId readAt');

    if (!suggestion) {
      return res.status(404).json({ message: 'Suggestion not found.' });
    }

    if (suggestion.landlordId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    if (!suggestion.readAt) {
      suggestion.readAt = new Date();
      await suggestion.save();
    }

    return res.status(200).json({ message: 'Marked as read.' });
  } catch (err) {
    console.error('markSuggestionRead failed:', err);
    return res.status(500).json({ error: 'Failed to mark suggestion as read.' });
  }
};
