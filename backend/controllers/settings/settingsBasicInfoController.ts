import type { Request, Response } from "express";
import { LandlordModel } from "../../database/models/Landlord.model";
import { TenantModel } from "../../database/models/Tenant.model";
import mongoose from "mongoose";

export const settingsBasicInfoController = async (
  req: Request,
  res: Response
) => {

  try {
    const user = await LandlordModel.findById(req.userId) || await TenantModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User doesn't exist." })
    }

    return res.status(200).json({ user })
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return res.status(404).json({ message: 'User not found.' })
    } else {
      console.error('Unexpected Error', err);
      res.status(500).json({ message: "Unexpected Error" })
    }
  }
}