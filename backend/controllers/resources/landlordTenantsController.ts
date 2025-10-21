import type { Request, Response } from "express";
import { verifyToken } from "../../utils/jwt";
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import { LandlordModel } from "../../database/models/Landlord.model";
import { excludeFields } from "../../utils/user";

dotenv.config();

export const landlordTenantsController = async (req: Request, res: Response) => {
  const accessToken = req.params.id;

  const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN!

  try {
    const decoded = verifyToken(accessToken, JWT_ACCESS_TOKEN)
    const landlord = await LandlordModel.findById(decoded.userID).populate({
        path: 'properties.tenants.tenantId',
        model: 'tenants',
      }).select(excludeFields)

  console.log('landlords', landlord)
  
  return res.status(200).json({ decoded })
} catch (err) {
  if (err instanceof jwt.JsonWebTokenError) {
    return res.status(400).json({ message: err.message });
  } else {
    return res.status(500).json({ message: 'Oops! Something went wrong!' })
  }
}


}