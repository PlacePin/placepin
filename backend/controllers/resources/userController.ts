import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { getUserById } from "../../utils/user";

dotenv.config();

export const userController = async (req: Request, res: Response) => {
  const userId = req.userId

  if(!userId) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    const user = await getUserById(userId)

    if (!user) {
      return res.status(404).json({ message: "User doesn't exist." })
    }

    return res.status(200).json({ user })
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ message: err.message });
    } else {
      return res.status(500).json({ message: 'Oops! Something went wrong looking for a subscription tier.' })
    }
  }
}