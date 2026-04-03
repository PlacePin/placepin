import type { Response, Request } from "express";
import dotenv from 'dotenv';
import { LandlordModel, type LandlordDocumentType } from "../../database/models/Landlord.model";
import { TenantModel, type TenantDocumentType } from "../../database/models/Tenant.model";

dotenv.config();

export const stripeCancelSubscription = async (
  req: Request,
  res: Response,
) => {
  const userId = req.userId;
  const STRIPE_TEST_SECRET_KEY = process.env.STRIPE_TEST_SECRET_KEY;

  // Getting user from database

  const landlord = await LandlordModel.findById(userId)
  const tenant = await TenantModel.findById(userId)
  const user: TenantDocumentType | LandlordDocumentType | null = landlord || tenant

  if (!user) {
    return res.status(404).json({ message: "Landlord doesn't exist." })
  }

  if (!STRIPE_TEST_SECRET_KEY) {
    return res.status(500).json({ message: 'Stripe key missing!' })
  }

  try {

    return res.status(200).json({ message: 'complete' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Unexpected error!' })
  }
}