import type { Request, Response } from 'express';
import Stripe from 'stripe';
import { LandlordModel, type LandlordDocumentType } from '../../database/models/Landlord.model';
import { TenantModel, type TenantDocumentType } from '../../database/models/Tenant.model';
import { TradesmenModel, type TradesmenDocumentType } from '../../database/models/Tradesmen.model';

export const deleteAccount = async (req: Request, res: Response) => {
  const userId = req.userId;
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

  if (!STRIPE_SECRET_KEY) {
    return res.status(500).json({ message: 'Stripe key missing!' });
  }

  try {
    const landlord = await LandlordModel.findById(userId);
    const tenant = await TenantModel.findById(userId);
    const tradesmen = await TradesmenModel.findById(userId);
    const user: LandlordDocumentType | TenantDocumentType | TradesmenDocumentType | null =
      landlord || tenant || tradesmen;

    if (!user) {
      return res.status(404).json({ message: "User doesn't exist." });
    }

    const stripeAccess = new Stripe(STRIPE_SECRET_KEY);
    const stripeSubscriptionId = user.subscription?.stripeSubscriptionId;

    if (landlord) {
      // Capture when the landlord's subscription would have naturally ended so
      // sponsored tenants get a grace period before being prompted to pick
      // their own plan. Fall back to 30 days if there's no active Stripe sub
      // (ex: landlord deleted account while mid-trial or before paying).
      let sponsorshipEndsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      if (stripeSubscriptionId) {
        const sub = await stripeAccess.subscriptions.retrieve(stripeSubscriptionId);
        // In Stripe API >= 2025-03-31, current_period_end lives on each subscription item.
        const periodEnd = sub.items?.data?.[0]?.current_period_end;
        if (periodEnd) {
          sponsorshipEndsAt = new Date(periodEnd * 1000);
        }
        await stripeAccess.subscriptions.cancel(stripeSubscriptionId);
      }

      // Sponsored tenants keep tier === 'Landlord-Sponsored' until the date
      // passes; the subscription-status endpoint flips them to no-sub once
      // expired. Tenants on their own paid plan aren't matched by this filter.
      await TenantModel.updateMany(
        { referredByLandlord: landlord._id, 'subscription.tier': 'Landlord-Sponsored' },
        {
          $set: { 'subscription.sponsorshipEndsAt': sponsorshipEndsAt },
          $unset: { referredByLandlord: '' },
        }
      );

      await LandlordModel.deleteOne({ _id: landlord._id });
    } else if (tenant) {
      if (stripeSubscriptionId) {
        await stripeAccess.subscriptions.cancel(stripeSubscriptionId);
      }
      await TenantModel.deleteOne({ _id: tenant._id });
    } else if (tradesmen) {
      if (stripeSubscriptionId) {
        await stripeAccess.subscriptions.cancel(stripeSubscriptionId);
      }
      await TradesmenModel.deleteOne({ _id: tradesmen._id });
    }

    return res.status(200).json({ message: 'Account deleted' });
  } catch (err) {
    console.error('Failed to delete account', err);
    return res.status(500).json({ error: 'Unexpected error!' });
  }
};
