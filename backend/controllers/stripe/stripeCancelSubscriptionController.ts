import type { Response, Request } from "express";
import { LandlordModel, type LandlordDocumentType } from "../../database/models/Landlord.model";
import { TenantModel, type TenantDocumentType } from "../../database/models/Tenant.model";
import { TradesmenModel, type TradesmenDocumentType } from "../../database/models/Tradesmen.model";
import Stripe from 'stripe';

export const stripeCancelSubscription = async (
  req: Request,
  res: Response,
) => {
  const userId = req.userId;
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

  if (!STRIPE_SECRET_KEY) {
    return res.status(500).json({ message: 'Stripe key missing!' })
  }

  try {
    // Getting user from database

    const landlord = await LandlordModel.findById(userId);
    const tenant = await TenantModel.findById(userId);
    const tradesmen = await TradesmenModel.findById(userId);
    const user: TenantDocumentType | LandlordDocumentType | TradesmenDocumentType | null = landlord || tenant || tradesmen

    if (!user) {
      return res.status(404).json({ message: "User doesn't exist." })
    }

    const stripeSubscriptionId = user.subscription?.stripeSubscriptionId;

    if (!stripeSubscriptionId) {
      return res.status(400).json({ message: 'No active subscription found.' });
    }

    const stripeAccess = new Stripe(STRIPE_SECRET_KEY);

    // Cancel at end of billing period so user keeps access until they paid for
    await stripeAccess.subscriptions.update(stripeSubscriptionId, {
      cancel_at_period_end: true
    });

    // Update database
    const updatedSubscription = {
      'subscription.isSubscribed': false,
      'subscription.stripeSubscriptionId': null
    };

    if (user.accountType === 'landlord') {
      await LandlordModel.updateOne({ _id: userId }, updatedSubscription);
    } else if(user.accountType === 'tenant') {
      await TenantModel.updateOne({ _id: userId }, updatedSubscription);
    } else if(user.accountType === 'tradesmen'){
      await TradesmenModel.updateOne({ _id: userId }, updatedSubscription)
    } else {
      return res.status(400).json({ error: 'Invalid account type'})
    }

    return res.status(200).json({ updatedSubscription })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Unexpected error!' })
  }
}
