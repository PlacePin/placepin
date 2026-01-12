import type { Request, Response } from "express";
import { LandlordModel } from "../../database/models/Landlord.model";
import mongoose from "mongoose";

export const getLandlordTenants = async (
  req: Request,
  res: Response
) => {
  const userId = req.userId

  try {
    const tenants = await LandlordModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(`${userId}`) } },
      { $unwind: '$properties' },
      { $unwind: '$properties.tenants' },
      {
        $lookup: {
          from: 'tenants',
          localField: 'properties.tenants.tenantId',
          foreignField: '_id',
          as: 'tenantData'
        }
      },
      {
        $unwind: {
          path: '$tenantData',
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $project: {
          'tenantData.password': 0,
          'tenantData.__v': 0,
          'tenantData.referredByLandlord': 0,
          'tenantData.subscription.stripeCustomerId': 0,
          'tenantData.subscription.savedPaymentMethod': 0,
        }
      },
      { $replaceRoot: { newRoot: '$tenantData' } },
    ]);

    return res.status(200).json({ tenants })
  } catch (err) {
    return res.status(500).json({ message: 'Oops! Something went wrong!' })
  }
}
