import type { Request, Response } from "express";
import dotenv from 'dotenv';
import Stripe from "stripe";

dotenv.config();

export const stripeSubscriptionCheckoutFormController = async (req: Request, res: Response) => {
  const STRIPE_TEST_SECRET_KEY = process.env.STRIPE_TEST_SECRET_KEY

  try {
    if (!STRIPE_TEST_SECRET_KEY) {
      return res.status(500).json({ message: 'No access!' })
    }

    const stripeAccess = new Stripe(STRIPE_TEST_SECRET_KEY)

    console.log(stripeAccess)

    const session = await stripeAccess.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: "price_1SHDaWBBupUJ6mEWDyNX77m5",
          quantity: 1,
        },
      ],
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    return res.status(200).json({ sessionUrl: session.url })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Unexpected error!" })
  }

}