import type { Request, Response } from 'express';
import { LandlordModel, type LandlordDocumentType } from '../../database/models/Landlord.model';
import { TenantModel, type TenantDocumentType } from '../../database/models/Tenant.model';
import { TradesmenModel, type TradesmenDocumentType } from '../../database/models/Tradesmen.model';

export const updateAddress = async (
  req: Request,
  res: Response,
) => {
  const { street, unit, city, state, zip } = req.body;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Invalid token" })
  }

  try {
    const landlord = await LandlordModel.findById(userId);
    const tenant = await TenantModel.findById(userId);
    const tradesmen = await TradesmenModel.findById(userId);
    const user: LandlordDocumentType | TenantDocumentType | TradesmenDocumentType | null =
      landlord || tenant || tradesmen;

    if (!user) {
      return res.status(404).json({ message: "User doesn't exist." });
    }

    if (!user.address) {
      user.address = {};
    }

    user.address = {
      ...user.address, // Keeps existing address fields if some are missing in req.body
      street: street ?? user.address?.street,
      unit: unit ?? user.address?.unit,
      city: city ?? user.address?.city,
      state: state ?? user.address?.state,
      zip: zip ?? user.address?.zip,
    };

    await user.save();

    return res.status(200).json({ message: "Address updated successfully" });
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Unexpected Error' })
  }
}