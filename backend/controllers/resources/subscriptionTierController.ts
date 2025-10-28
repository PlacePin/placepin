import type { Request, Response } from 'express';
import { TenantModel } from '../../database/models/Tenant.model';
import { LandlordModel } from '../../database/models/Landlord.model';

export const subscriptionTier = async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const user = (await TenantModel.findById(userId)) || (await LandlordModel.findById(userId));

    if (!user) {
      return res.status(404).json({ message: "User doesn't exist." })
    }

    const subscriptionTier = user.subscription?.tier

    return res.status(200).json({ subscriptionTier })
  } catch (err) {
    return res.status(500).json({ message: 'Oops! Something went wrong looking for a subscription tier.' })
  }
}
