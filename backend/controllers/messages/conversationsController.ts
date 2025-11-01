import type { Request, Response } from "express";
import { excludeFields, getUserById } from "../../utils/user";
import { DirectMessageModel } from "../../database/models/Message.model";

export const getUserConversations = async (
  req: Request,
  res: Response
) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    const conversations = await DirectMessageModel.find({
      participants: userId
    })
      .select('participants')
      .lean()
    // .populate('participants')
    // .sort({ lastUpdated: -1 });

    const usernames = await Promise.all(
      conversations.map((convo) => {
        const other = convo.participants.find(
          (participant) => {
            return participant.toString() !== userId && participant.toString()
          },
        );

        // if no other participant (e.g. corrupted data), skip
        if (!other) {
          return null
        }

        try {
          const user = getUserById(other.toString(), excludeFields);
          return user;
        } catch (err) {
          console.error("Error fetching user:", err);
          return null;
        }
      })
    );

    const validUser = usernames.filter(Boolean);

    const validUsername = validUser.map(user => user?.username)

    return res.status(200).json({ usernames: validUsername })
  } catch (err) {
    console.error('Unexpected Error', err);
    return res.status(500).json({ message: 'Oops! Something went wrong!' })
  }
}
