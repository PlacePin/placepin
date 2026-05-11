import type { Request, Response } from 'express';

export const identityStep = async (
  req: Request,
  res: Response,
) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const { verificationMethod } = req.body;
  console.log(verificationMethod)
}