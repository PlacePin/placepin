import type { Request, Response } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import { TenantModel } from "../../database/models/Tenant.model";
import { LandlordModel } from "../../database/models/Landlord.model";
import jwt from "jsonwebtoken";

dotenv.config();
const STRIPE_TEST_SECRET_KEY = process.env.STRIPE_TEST_SECRET_KEY!;
const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN!;

const stripe = new Stripe(STRIPE_TEST_SECRET_KEY, { apiVersion: "2025-09-30.clover" });

export const stripeSaveCardFormController = async (req: Request, res: Response) => {
  const { userID, accountType, accessToken } = req.body;

  try {
    const decoded = jwt.verify(accessToken, JWT_ACCESS_TOKEN);

    if (!decoded || typeof decoded !== 'object') {
      return res.status(400).json({ message: "Something's wrong with your access token." })
    }

    // Get the user
    const user = accountType === "tenant"
      ? await TenantModel.findById(userID)
      : await LandlordModel.findById(userID);

    if (!user || !user.stripeCustomerId) {
      return res.status(404).json({ message: "User not found or missing Stripe ID" });
    }

    // Create a SetupIntent
    const setupIntent = await stripe.setupIntents.create({
      customer: user.stripeCustomerId,
    });

    // Return the client secret to the frontend
    res.status(200).json({ clientSecret: setupIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create setup intent" });
  }
};
