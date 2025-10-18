import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { LandlordModel } from "../../database/models/Landlord.model";
import { generateReferralCode } from "../../utils/generateReferralCode";

dotenv.config()

export const inviteTenantController = async (req: Request, res: Response) => {
  const { tenantName, tenantAddress, tenantEmail, accessToken } = req.body

  const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN!

  try {
    const decoded = jwt.verify(accessToken, JWT_ACCESS_TOKEN);

    // extra defensive check
    if (!decoded || typeof decoded !== 'object') {
      return res.status(400).json({ message: "Invalid token format." });
    }

    console.log(decoded)

    const landlord = await LandlordModel.findById(decoded.userID)

    console.log(landlord?.properties.length)

    if (!landlord) {
      return res.status(404).json({ message: 'User not found!' })
    }

    if (landlord?.properties.length === 0) {
      const updatedModel = await LandlordModel.findByIdAndUpdate(
        decoded.userID,
        {
          $push: {
            properties: {
              name: "",
              address: tenantAddress,
              referralCode: generateReferralCode(),
              tenants: []
            }
          }
        },
        { new: true }
      );
      console.log(updatedModel)
    }

  } catch (err) {
    // all tampering / invalid signature / expired token lands here
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ message: err.message });
    } else {
      console.error('Unexpected Error:', err);
      return res.status(500).json({ message: 'Unexpected Error' })
    }
  }
}