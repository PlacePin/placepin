import type { Request, Response } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import { TenantModel } from "../../database/models/Tenant.model";
import { LandlordModel } from "../../database/models/Landlord.model";

dotenv.config();
const STRIPE_TEST_SECRET_KEY = process.env.STRIPE_TEST_SECRET_KEY!;

const stripe = new Stripe(STRIPE_TEST_SECRET_KEY, {
  apiVersion: "2025-09-30.clover",
});

export const stripeSaveCardForm = async (
  req: Request,
  res: Response
) => {

  console.log(req.body)
  const paymentMethodId = req.body;
  const userId = req.userId;

  try {
    // Get the user from DB
    const user = await TenantModel.findById(userId) || await LandlordModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.subscription) {
      user.subscription = {
        isSubscribed: false,
        savedPaymentMethod: '',
        stripeCustomerId: '',
        tier: '',
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
