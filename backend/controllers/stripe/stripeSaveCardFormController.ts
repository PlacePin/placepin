import type { Request, Response } from "express";
import Stripe from "stripe";
import { TenantModel } from "../../database/models/Tenant.model";
import { LandlordModel } from "../../database/models/Landlord.model";
import { TradesmenModel } from "../../database/models/Tradesmen.model";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const stripeSaveCardForm = async (
  req: Request,
  res: Response
) => {
  const { paymentMethodId } = req.body || {};
  const userId = req.userId;

  try {
    // Get the user from DB
    const user = await TenantModel.findById(userId) || 
                 await LandlordModel.findById(userId) ||
                 await TradesmenModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.subscription) {
      user.subscription = {
        isSubscribed: false,
        savedPaymentMethod: '',
        stripeCustomerId: '',
        tier: '',
        stripeSubscriptionId: '',
      };
    }

    // If there's no paymentMethodId yet, create and return SetupIntent
    if (!paymentMethodId) {
      if (!user.subscription?.stripeCustomerId) {
        // Create a customer if needed
        const customer = await stripe.customers.create({
          email: user.email,
        });
        user.subscription.stripeCustomerId = customer.id;
        await user.save();
      }

      const setupIntent = await stripe.setupIntents.create({
        customer: user.subscription.stripeCustomerId,
      });

      return res.status(200).json({ clientSecret: setupIntent.client_secret });
    }

    // If paymentMethodId exists, store it in DB
    user.subscription.savedPaymentMethod = paymentMethodId;
    await user.save();

    return res
      .status(200)
      .json({ message: "Payment method saved successfully" });
  } catch (err) {
    console.error("Error in stripeSaveCardFormController:", err);
    return res.status(500).json({ message: "Something went wrong with saving the card" });
  }
};
