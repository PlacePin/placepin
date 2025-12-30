import type { Request, Response } from 'express';
import { TradesmenModel } from '../../database/models/Tradesmen.model';

export const getTradesmen = async (
  req: Request,
  res: Response,
) => {
  const userId = req.userId

  if (!userId) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    const tradesmen = await TradesmenModel.find({}).select('-password -__v');
    console.log(tradesmen)
  } catch (err) {
    console.error("Error fetching tradesmen:", err)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
