import type { Request, Response } from "express";
import dotenv from 'dotenv';
import Stripe from "stripe";

dotenv.config();

export const stripeController = async (req: Request, res: Response) => {
  const STRIPE_TEST_SECRET_KEY = process.env.STRIPE_TEST_SECRET_KEY

  try{
    if(!STRIPE_TEST_SECRET_KEY){
      return res.status(500).json({ message: 'No access!' })
    }
  
    const stripeAccess = new Stripe(STRIPE_TEST_SECRET_KEY)
  
    console.log(STRIPE_TEST_SECRET_KEY)

  } catch (err) {

  }

}