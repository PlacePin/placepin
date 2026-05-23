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
    const landlord = await LandlordModel.findById(userId);
    const tenant = await TenantModel.findById(userId);
    const tradesmen = await TradesmenModel.findById(userId);
    const user = landlord || tenant || tradesmen;

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Ensure customer exists
    let stripeCustomerId = user.subscription?.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({ email: user.email });
      stripeCustomerId = customer.id;
      
      // Update database specifically by account type
      if (landlord) await LandlordModel.updateOne({ _id: userId }, { "subscription.stripeCustomerId": stripeCustomerId });
      if (tenant) await TenantModel.updateOne({ _id: userId }, { "subscription.stripeCustomerId": stripeCustomerId });
      if (tradesmen) await TradesmenModel.updateOne({ _id: userId }, { "subscription.stripeCustomerId": stripeCustomerId });
    }

    // If there's no paymentMethodId yet, create and return SetupIntent
    if (!paymentMethodId) {
      const setupIntent = await stripe.setupIntents.create({
        customer: stripeCustomerId,
        payment_method_types: ['card'], // Enforces card/debit card
      });
      return res.status(200).json({ clientSecret: setupIntent.client_secret });
    }

    // Frontend sent back paymentMethodId, attach it to customer
    await stripe.paymentMethods.attach(paymentMethodId, { customer: stripeCustomerId });

    // Save to the correct database document
    if (landlord) await LandlordModel.updateOne({ _id: userId }, { "subscription.savedPaymentMethod": paymentMethodId });
    if (tenant) await TenantModel.updateOne({ _id: userId }, { "subscription.savedPaymentMethod": paymentMethodId });
    if (tradesmen) await TradesmenModel.updateOne({ _id: userId }, { "subscription.savedPaymentMethod": paymentMethodId });

    return res
      .status(200)
      .json({ message: "Payment method saved successfully" });
  } catch (err) {
    console.error("Error in stripeSaveCardFormController:", err);
    return res.status(500).json({ message: "Something went wrong with saving the card" });
  }
};

export const initiateLandlordOnboarding = async (req: Request, res: Response) => {
  const userId = req.userId; 

  try {
    if (!userId) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const landlord = await LandlordModel.findById(userId);
    if (!landlord) {
      return res.status(404).json({ message: 'Landlord not found' });
    }

    let connectAccountId = landlord.stripeConnectAccountId;

    // Create a Stripe Express profile shell if they don't have one yet
    if (!connectAccountId) {
      const account = await stripe.accounts.create({
        type: 'express', // Express lets Stripe manage the identity data securely
        country: 'US',
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual',
        email: landlord.email,
      });

      connectAccountId = account.id;

      // Immediately save that "acct_xxxx" string to the landlord document
      await LandlordModel.updateOne(
        { _id: userId },
        { $set: { stripeConnectAccountId: connectAccountId } }
      );
    }

    // Generate a temporary onboarding link for Stripe's verification wizard
    const accountLink = await stripe.accountLinks.create({
      account: connectAccountId,
      refresh_url: `${process.env.CLIENT_URL}/settings/banksettings`, // If link expires/fails
      return_url: `${process.env.CLIENT_URL}/landlorddashboard`, // Where they land when completed
      type: 'account_onboarding',
    });

    // 4. Hand the URL back to your React client
    return res.status(200).json({ onboardingUrl: accountLink.url });

  } catch (error) {
    console.error('Stripe Connect onboarding generation error:', error);
    return res.status(500).json({ message: 'Failed to generate onboarding session' });
  }
};