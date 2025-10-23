import type { Request, Response } from "express";
import { verifyToken } from "../../utils/jwt";
import jwt from "jsonwebtoken";
import { LandlordModel } from "../../database/models/Landlord.model";
import mongoose from "mongoose";

export const landlordTenantsController = async (req: Request, res: Response) => {
  const accessToken = req.params.id;

  try {
    const decoded = verifyToken(accessToken)
    // const landlord = await LandlordModel.findById(decoded.userID).populate({
    //   path: 'properties.tenants.tenantId',
    //   model: 'Tenants',
    // }).select(excludeFields)

    const tenants = await LandlordModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(`${decoded.userID}`) } },
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
      { $unwind: { path: '$tenantData', preserveNullAndEmptyArrays: true } },
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

    console.log('tenants', tenants)

    return res.status(200).json({ tenants })
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ message: err.message });
    } else {
      return res.status(500).json({ message: 'Oops! Something went wrong!' })
    }
  }


}