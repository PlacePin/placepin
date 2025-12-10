import type { Request, Response } from "express";
import { PropertyModel } from "../../database/models/Property.model";

export const getReceipt = async (
  req: Request,
  res: Response
) => {
  const userId = req.userId;
  try {
    const properties = await PropertyModel.find({ landlord: userId }).select('address taxYears');
    return res.status(200).json({ properties: properties });
  } catch (err) {
    console.error('Error fetching properties:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
