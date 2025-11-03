import type { Request, Response } from "express";
import { excludeFields, getUserById } from "../../utils/user";
import { DirectMessageModel } from "../../database/models/Message.model";
import { LandlordModel } from "../../database/models/Landlord.model";
import { TenantModel } from "../../database/models/Tenant.model";
import type mongoose from "mongoose";

export const getUsernames = async (
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
      .sort({ lastUpdated: -1 });

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

type Participant = {
  _id: mongoose.Types.ObjectId;
  username: string;
};

export const getConversations = async (
  req: Request,
  res: Response
) => {
  const username = req.query.username;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    const recipient =
      (await LandlordModel.findOne({ username })) ||
      (await TenantModel.findOne({ username }));

    if (!recipient) return res.status(404).json({ message: 'User not found' });

    const conversation = await DirectMessageModel.findOne({
      participants: { $all: [userId, recipient._id] },
    })
      .populate({
        path: 'participants',
        select: 'username'
      })
      .lean();

    if (!conversation) {
      return res.status(200).json({ messages: [] });
    }

    // Map each participant's _id to their username
    const participantMap: Record<string, string> = {};
    for (const participant of conversation.participants) {
      if (typeof participant === 'object' && 'username' in participant) {
        const participants = participant as Participant;
        participantMap[participants._id.toString()] = participants.username;
      }
    }

    // For extra safety, populate sender info from DB if missing in map
    // (in case some messages were sent before participant schema updates)
    const formattedMessages = await Promise.all(
      conversation.messages.map(async (messages: any) => {
        let senderUsername = participantMap[messages.sender.toString()];

        if (!senderUsername) {
          // fallback: fetch sender user by id from either model
          const sender =
            (await LandlordModel.findById(messages.sender).select('username').lean()) ||
            (await TenantModel.findById(messages.sender).select('username').lean());

          senderUsername = sender?.username || 'Unknown';
        }

        return {
          sender: senderUsername,
          content: messages.content,
          sentAt: messages.sentAt,
        };
      })
    );

    const messages = formattedMessages

    return res.status(200).json({ messages })
  } catch (err) {
    console.error('Unexpected Error', err);
    return res.status(500).json({ message: 'Oops! Something went wrong!' })
  }
}
