import type { Request, Response } from "express";
import { TenantModel } from "../../database/models/Tenant.model";
import Stripe from "stripe";

export const stripeUpdateSubscription = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { subscriptionPlan } = req.body;
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

  if (!STRIPE_SECRET_KEY) return res.status(500).json({ message: 'Stripe key missing!' });

  const PLAN_PRICE_MAP: Record<string, string> = {
    essential: process.env.STRIPE_ESSENTIAL_PRICE_ID!,
    balanced: process.env.STRIPE_BALANCED_PRICE_ID!,
    platinum: process.env.STRIPE_PLATINUM_PRICE_ID!,
  };

  try {
    const tenant = await TenantModel.findById(userId);
    if (!tenant) return res.status(404).json({ message: "User doesn't exist." });

    const stripeSubscriptionId = tenant.subscription?.stripeSubscriptionId;
    if (!stripeSubscriptionId) return res.status(400).json({ message: 'No active subscription found.' });

    const newPriceId = PLAN_PRICE_MAP[subscriptionPlan];
    if (!newPriceId) return res.status(400).json({ message: 'Invalid plan.' });

    const stripeAccess = new Stripe(STRIPE_SECRET_KEY);

    const subscription = await stripeAccess.subscriptions.retrieve(stripeSubscriptionId);

    await stripeAccess.subscriptions.update(stripeSubscriptionId, {
      items: [{
        id: subscription.items.data[0].id,
        price: newPriceId,
      }],
      proration_behavior: 'always_invoice',
      metadata: {
        userId: String(tenant._id),
        accountType: 'tenant',
        tier: subscriptionPlan.charAt(0).toUpperCase() + subscriptionPlan.slice(1),
      }
    });

    return res.status(200).json({ message: 'Subscription updated successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unexpected error!' });
  }
};