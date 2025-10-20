import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { TenantModel } from "../../database/models/Tenant.model";
import { LandlordModel } from "../../database/models/Landlord.model";

dotenv.config();

export const subscriptionController = async (req: Request, res: Response) => {
  const accessToken = req.params.id

  const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN!

  try {
    const decoded = jwt.verify(accessToken, JWT_ACCESS_TOKEN)

    if (!decoded || typeof decoded !== 'object') {
      return res.status(400).json({ message: "Something's wrong with your access token." })
    }

    const user = (await TenantModel.findById(decoded.userID)) || (await LandlordModel.findById(decoded.userID));

    if (!user) {
      return res.status(404).json({ message: "User doesn't exist." })
    }

    const subscription = user.subscription

    return res.status(200).json({ subscription })
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ message: err.message });
    } else {
      return res.status(500).json({ message: 'Oops! Something went wrong looking for a subscription.' })
    }
  }
}