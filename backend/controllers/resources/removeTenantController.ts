import type { Request, Response } from "express";
import { LandlordModel } from "../../database/models/Landlord.model";

export const removeTenant = async (req: Request, res: Response) => {
  const tenantId = req.query.id;
  const landlordId = req.userId;

  if (!landlordId) {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (!tenantId) {
    return res.status(400).json({ message: "Missing tenant id" });
  }

  try {
    const result = await LandlordModel.updateOne(
      { _id: landlordId },
      {
        $pull: {
          "properties.$[].tenants": { tenantId: tenantId }
        }
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Tenant not found in this landlord’s properties" });
    }

    console.log(result)

    return res.status(200).json({ message: "Tenant removed successfully" })
  } catch (err) {
    return res.status(500).json({ message: 'Unexpected Error' })
  }
}
