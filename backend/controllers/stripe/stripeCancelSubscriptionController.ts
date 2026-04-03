import type { Response, Request } from "express";
import dotenv from 'dotenv';
import { LandlordModel, type LandlordDocumentType } from "../../database/models/Landlord.model";
import { TenantModel, type TenantDocumentType } from "../../database/models/Tenant.model";
import Stripe from 'stripe';
import { TradesmenModel, type TradesmenDocumentType } from "../../database/models/Tradesmen.model";

dotenv.config();

export const stripeCancelSubscription = async (
  req: Request,
  res: Response,
) => {
  const userId = req.userId;
  const STRIPE_TEST_SECRET_KEY = process.env.STRIPE_TEST_SECRET_KEY;

  try {
    // Getting user from database

    const landlord = await LandlordModel.findById(userId);
    const tenant = await TenantModel.findById(userId);
    const tradesmen = await TradesmenModel.findById(userId);
    const user: TenantDocumentType | LandlordDocumentType | TradesmenDocumentType | null = landlord || tenant || tradesmen

    if (!user) {
      return res.status(404).json({ message: "User doesn't exist." })
    }

    if (!STRIPE_TEST_SECRET_KEY) {
      return res.status(500).json({ message: 'Stripe key missing!' })
    }

    const stripeSubscriptionId = user.subscription?.stripeSubscriptionId;

    if (!stripeSubscriptionId) {
      return res.status(400).json({ message: 'No active subscription found.' });
    }

    const stripeAccess = new Stripe(STRIPE_TEST_SECRET_KEY);

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
      return res.status(400).json({ error: 'No Correct User Type'})
    }

    return res.status(200).json({ updatedSubscription })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Unexpected error!' })
  }
}
