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
    const decoded = verifyToken(accessToken);

    const parsedAddress = parseAddress(propertyAddress)

    console.log(parsedAddress)

    // Parse the address from the property address var, then pull in all of the proprties from this landlord and parseAddress those properties and compare them to the incoming property if any of them are the same, do nothing, if none match add it to there properties array.

  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ message: err.message });
    } else {
      console.error('Unexpected Error:', err);
      return res.status(500).json({ message: 'Unexpected Error' })
    }
  }


}