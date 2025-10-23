import type { Request, Response } from "express";
import { verifyToken } from "../../utils/jwt";
import jwt from "jsonwebtoken";
import { LandlordModel } from "../../database/models/Landlord.model";
import { excludeFields } from "../../utils/user";

export const addPropertyController = async (req: Request, res: Response) => {
  const accessToken = req.params.id;
  const { propertyName, propertyAddress, unitAmount } = req.body;

  console.log(propertyName, propertyAddress, unitAmount)


  const ad = "192 Reservation Rd., Boston MA, 02136"
  const test = ad.split(',').join('').split(' ').join('').split('.').join('').toLocaleLowerCase()
  console.log(test)

  try {
    const decoded = await verifyToken(accessToken);
    // const landlord = await LandlordModel.findById(decoded.userID);

     const landlord = await LandlordModel.findById(decoded.userID).populate({
      path: 'properties.tenants.tenantId',
      model: 'Tenants',
    }).select(excludeFields)
    
    // console.log(landlord)

  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ message: err.message });
    } else {
      console.error('Unexpected Error:', err);
      return res.status(500).json({ message: 'Unexpected Error' })
    }
  }


}