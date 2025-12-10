import type { Request, Response } from "express";
import { LandlordModel } from "../../database/models/Landlord.model";

export const getReceipt = async (
  req: Request,
  res: Response
) => {
  const userId = req.userId
  try{
    console.log(userId)
    const landlord = await LandlordModel.findById(userId)
    console.log(landlord)
    return res.status(200).json({ message: 'Success' })
  } catch (err) {
    return res.status(500).json({ message: `Internal Server Error ${err}` })
  }
}