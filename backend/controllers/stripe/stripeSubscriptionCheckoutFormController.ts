import type { Request, Response } from "express";
import dotenv from 'dotenv';
import Stripe from "stripe";
import jwt from 'jsonwebtoken';
import { LandlordModel } from "../../database/models/Landlord.model";

dotenv.config();

export const stripeSubscriptionCheckoutFormController = async (req: Request, res: Response) => {
  const accessToken = req.params.id

  const STRIPE_TEST_SECRET_KEY = process.env.STRIPE_TEST_SECRET_KEY
  const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN!

  try {
    const decoded = jwt.verify(accessToken, JWT_ACCESS_TOKEN)

    if (!decoded || typeof decoded !== 'object') {
      return res.status(400).json({ message: "Something's wrong with your access token." })
    }

    const landlord = await LandlordModel.findById(decoded.userID)

    if (!landlord) {
      return res.status(404).json({ message: "Landlord doesn't exist." })
    }

    if (!STRIPE_TEST_SECRET_KEY) {
      return res.status(500).json({ message: 'Stripe key missing!' })
    }

    const stripeAccess = new Stripe(STRIPE_TEST_SECRET_KEY)

    let stripeCustomerId = landlord.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripeAccess.customers.create({
        email: landlord.email,
      });

      stripeCustomerId = customer.id;

      await LandlordModel.updateOne(
        { _id: landlord._id},
        { stripeCustomerId }
      )
    }

    const session = await stripeAccess.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer: stripeCustomerId,
      payment_method_collection: "always",
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