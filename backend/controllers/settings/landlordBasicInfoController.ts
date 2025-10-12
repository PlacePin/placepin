import type { Request, Response } from "express";
import { LandlordModel } from "../../database/models/Landlord.model";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from "mongoose";

dotenv.config()

export const landlordBasicInfoController = async (req: Request, res: Response) => {

  const accessToken = req.params.id;
  const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN!;

  try {
    const decoded = jwt.verify(accessToken, JWT_ACCESS_TOKEN);

    if (!decoded || typeof decoded !== 'object') {
      return res.status(400).json({ message: "Something's wrong with your access token." })
    }

    const landlord = await LandlordModel.findById(decoded.userID);

    if(!landlord){
      return res.status(404).json({ message: "Landlord doesn't exist." })
    }

    res.status(200).json({ landlord })
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ message: err.message });
    } else if(err instanceof mongoose.Error.CastError){
      return res.status(404).json({ message: 'Landlord not found.'})
    } else {
      console.error('Unexpected Error', err);
      res.status(500).json({ message: "Unexpected Error" })
    }
  }
}