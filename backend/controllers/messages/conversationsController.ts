import type { Request, Response } from "express";
import { excludeFields, getUserById } from "../../utils/user";
import { DirectMessageModel } from "../../database/models/Message.model";

export const getUserConversations = async (
  req: Request,
  res: Response
) => {
  const userId = req.userId

  if (!userId) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    const user = await getUserById(userId, excludeFields)
    console.log(user?._id)
    const conversations = await DirectMessageModel.find({
      participants: userId
    })
    .populate({
      path: 'participants',
      select: 'username email', // customize fields
    })
    .sort({ lastUpdated: -1 });

    console.log(conversations)

    if (!user) {
      return res.status(404).json({ message: "User doesn't exist." })
    }

    return res.status(200).json({ conversations })
  } catch (err) {
    console.error('Unexpected Error', err);
    return res.status(500).json({ message: 'Oops! Something went wrong!' })
  }
}
