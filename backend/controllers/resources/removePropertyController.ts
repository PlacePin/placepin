import type { Request, Response } from "express";
import { LandlordModel } from "../../database/models/Landlord.model";

export const removeProperty = async (req: Request, res: Response) => {
  const propertyId = req.query.id;
  const landlordId = req.userId;

  console.log(propertyId)
  if (!landlordId) {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (!propertyId) {
    return res.status(400).json({ message: "Missing property id" });
  }

  try {
    const result = await LandlordModel.updateOne(
      { _id: landlordId },
      {
        $pull: {
          properties: { _id: propertyId }
        }
      }
    );

    console.log(result)

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Property not found for this landlord" });
    }

    return res.status(200).json({ message: "Property removed successfully" })
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unexpected Error' })
  }
}
