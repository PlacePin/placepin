import type { Request, Response } from "express";
import Stripe from "stripe";
import { LandlordModel, type LandlordDocumentType } from "../../database/models/Landlord.model";
import { TenantModel, type TenantDocumentType } from "../../database/models/Tenant.model";
import { TradesmenModel, type TradesmenDocumentType } from "../../database/models/Tradesmen.model";

export const stripeSubscriptionCheckoutForm = async (req: Request, res: Response) => {
  const userId = req.userId

  // Declaring Stripe secret key and JWT token
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID;
  const STRIPE_ESSENTIAL_PRICE_ID = process.env.STRIPE_ESSENTIAL_PRICE_ID;
  const STRIPE_BALANCED_PRICE_ID = process.env.STRIPE_BALANCED_PRICE_ID;
  const STRIPE_PLATINUM_PRICE_ID = process.env.STRIPE_PLATINUM_PRICE_ID;
  let session: any;
  let sessionConfig: Stripe.Checkout.SessionCreateParams;

  // This entire block is the subscription form using stripe to redirect to a new page
  try {
    // Getting user from database

    const landlord = await LandlordModel.findById(userId);
    const tenant = await TenantModel.findById(userId);
    const tradesmen = await TradesmenModel.findById(userId);
    const user: TenantDocumentType | LandlordDocumentType | TradesmenDocumentType | null = landlord || tenant || tradesmen

    if (!user) {
      return res.status(404).json({ message: "User doesn't exist." })
    }

    if (!STRIPE_SECRET_KEY) {
      return res.status(500).json({ message: 'Stripe key missing!' })
    }

    // Instantiating a new Stripe object for stripe interactions
    const stripeAccess = new Stripe(STRIPE_SECRET_KEY)

    // If the user already has a stripe customer id save it here
    let stripeCustomerId = user.subscription?.stripeCustomerId ?? '';

    // If the user doesn't have the stripe customer id create it here and update it in the database
    if (!stripeCustomerId) {
      const customer = await stripeAccess.customers.create({
        email: user.email,
      });

      stripeCustomerId = customer.id;

      if (user.accountType === 'landlord') {
        await LandlordModel.updateOne(
          { _id: user._id },
          { 'subscription.stripeCustomerId': stripeCustomerId }
        );
      } else if (user.accountType === 'tenant') {
        await TenantModel.updateOne(
          { _id: user._id },
          { 'subscription.stripeCustomerId': stripeCustomerId }
        );
      } else if (user.accountType === 'tradesmen') {
        await TradesmenModel.updateOne(
          { _id: user._id },
          { 'subscription.stripeCustomerId': stripeCustomerId }
        );
      } else {
        return res.status(400).json({ message: 'Invalid account type' })
      }
    }

    // This is the checkout flow when a user is paying for a subscription.
    if (user.accountType === 'landlord') {
      sessionConfig = {
        payment_method_types: ['card'],
        mode: 'subscription',
        customer: stripeCustomerId,
        payment_method_collection: 'always',
        line_items: [
          {
            price: STRIPE_PRICE_ID,
            quantity: 1,
          },
        ],
        success_url: `${process.env.CLIENT_URL}/success`,
        cancel_url: `${process.env.CLIENT_URL}/cancel`,
      };

      // Only landlords get the 90 day free trial
      sessionConfig.subscription_data = {
        trial_period_days: 90,
      };

      session = await stripeAccess.checkout.sessions.create(sessionConfig);

    } else if (user.accountType === 'tenant') {
      sessionConfig = {
        payment_method_types: ['card'],
        mode: 'subscription',
        customer: stripeCustomerId,
        payment_method_collection: 'always',
        line_items: [
          {
            price: STRIPE_PRICE_ID,
            quantity: 1,
          },
        ],
        success_url: `${process.env.CLIENT_URL}/success`,
        cancel_url: `${process.env.CLIENT_URL}/cancel`,
      };

      session = await stripeAccess.checkout.sessions.create(sessionConfig);

    } else if (user.accountType === 'tradesmen') {
      sessionConfig = {
        payment_method_types: ['card'],
        mode: 'subscription',
        customer: stripeCustomerId,
        payment_method_collection: 'always',
        line_items: [
          {
            price: STRIPE_PRICE_ID,
            quantity: 1,
          },
        ],
        success_url: `${process.env.CLIENT_URL}/success`,
        cancel_url: `${process.env.CLIENT_URL}/cancel`,
      };

      session = await stripeAccess.checkout.sessions.create(sessionConfig);

    } else {
      return res.status(400).json({ message: 'Invalid account type section 2' })
    }

    return res.status(200).json({ sessionUrl: session.url })

  } catch (err) {
    console.error(err)
    return res.status(500).json({ messsage: "Unexpected error!" })
  }
}
