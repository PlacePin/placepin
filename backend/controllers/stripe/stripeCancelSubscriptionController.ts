import type { Response, Request } from "express";
import dotenv from 'dotenv';

dotenv.config();

export const stripeCancelSubscription = async (
  res: Response,
  req: Request
) => {
  const userId = req.userId;
  const STRIPE_TEST_SECRET_KEY = process.env.STRIPE_TEST_SECRET_KEY

  try {

    return res.status(200).json({})
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Unexpected error!' })
  }
}