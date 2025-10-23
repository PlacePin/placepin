import type { Request, Response } from "express";
import { verifyToken } from "../../utils/jwt";
import jwt from "jsonwebtoken";
import { LandlordModel } from "../../database/models/Landlord.model";
import { parseAddress } from "../../utils/parseAddress";
import { addressesEqual } from "../../utils/addressEqual";

export const addPropertyController = async (req: Request, res: Response) => {
  const accessToken = req.params.id;
  const { propertyName, propertyAddress, unitAmount } = req.body;

  console.log(propertyName, propertyAddress, unitAmount);

  try {
    const decoded = await verifyToken(accessToken);

    

  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ message: err.message });
    } else {
      console.error('Unexpected Error:', err);
      return res.status(500).json({ message: 'Unexpected Error' })
    }
  }


}