import type { Request, Response } from "express";
import { getUserById } from "../../utils/user";

export const settingsBasicInfo = async (
  req: Request,
  res: Response
) => {
  const userId = req.userId
  const includeFields = 'email fullName phoneNumber username profilePic';

  if(!userId){
    return res.status(401).json({ message: "Invalid token" });
  }
  
  try {
    const user = await getUserById(userId, includeFields)

    if (!user) {
      return res.status(404).json({ message: "User doesn't exist." })
    }

    res.status(200).json({ user })
  } catch (err) {
    console.error('Unexpected Error', err);
    res.status(500).json({ message: "Unexpected Error" })
  }
}