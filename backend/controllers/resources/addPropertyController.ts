import mongoose from "mongoose";
import type { Request, Response } from "express";
import { verifyToken } from "../../utils/jwt";
import { LandlordModel } from "../../database/models/Landlord.model";
import { parseAddress } from "../../utils/parseAddress";
import { addressesEqual } from "../../utils/addressEqual";

export const addPropertyController = async (req: Request, res: Response) => {
  const { propertyName, propertyAddress, unitAmount } = req.body;

  const authHeader = req.headers.authorization
  const accessToken = authHeader?.split(' ')[1]
  
  try {

    if(!accessToken) {
      return res.status(401).json({ message: 'Missing authorization token' });
    } 
    
    const decoded = verifyToken(accessToken);

    if (!decoded || typeof decoded !== 'object') {
      return res.status(400).json({ message: "Invalid token format." });
    }

    const parsedAddress = parseAddress(propertyAddress)

    const properties = await LandlordModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(`${decoded.userID}`) } },
      { $unwind: '$properties' },
      {
        $project: {
          _id: 0,
          address: {
            number: "$properties.address.number",
            street: "$properties.address.street",
            streetType: "$properties.address.streetType",
            unit: '$properties.address.unit',
            city: "$properties.address.city",
            state: "$properties.address.state",
            zip: "$properties.address.zip"
          },
        },
      },
    ]);

    for(let property of properties){
      if(addressesEqual(property.address, parsedAddress)){
        return res.status(422).json({ message: 'Property already exist!'})
      }
    }

    const newProperty = {
      name: propertyName,
      address: parsedAddress,
      numberOfUnits: unitAmount,
    }

    await LandlordModel.findByIdAndUpdate(
      decoded.userID,
      {
        $push: {
          properties: newProperty
        }
      },
    )

    return res.status(201).json({ message: "Property added!"})

  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    console.error("Unexpected error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}