import type { Request, Response } from "express";
import { LandlordModel } from "../../database/models/Landlord.model";
import { TenantModel } from "../../database/models/Tenant.model";
import { TradesmenModel } from "../../database/models/Tradesmen.model";
import Stripe from "stripe";

export const stripeSubscriptionStatus = async (req: Request, res: Response) => {
  const userId = req.userId;
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

  if (!STRIPE_SECRET_KEY) {
    return res.status(500).json({ message: 'Stripe key missing!' });
  }

  try {
    const landlord = await LandlordModel.findById(userId);
    const tenant = await TenantModel.findById(userId);
    const tradesmen = await TradesmenModel.findById(userId);
    const user = landlord || tenant || tradesmen;

    if (!user) {
      return res.status(404).json({ message: "User doesn't exist." });
    }

    const stripeSubscriptionId = user.subscription?.stripeSubscriptionId;

    if (!stripeSubscriptionId) {
      return res.status(200).json({
        isSubscribed: false,
        tier: null,
        cancelAtPeriodEnd: false,
      });
    }

    const stripeAccess = new Stripe(STRIPE_SECRET_KEY);
    const subscription = await stripeAccess.subscriptions.retrieve(stripeSubscriptionId);
    const tier = tenant ? tenant.subscription?.tier ?? null : null;

    return res.status(200).json({
      isSubscribed: user.subscription?.isSubscribed ?? false,
      tier,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unexpected error!' });
  }
};