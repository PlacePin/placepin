import type { Request, Response } from "express";

export const rentPriceAcknowledgement = async (
  req: Request,
  res: Response
) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Invalid token" });
  };

  try {
    res.status(200).json({ message: 'success' })
  } catch (err) {
    console.error('Unexpected Error', err)
    res.status(500).json({ message: 'Oops! Something went wrong!' })
  }
}