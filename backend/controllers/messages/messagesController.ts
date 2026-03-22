import type { Request, Response } from "express";
import { excludeFields, getUserById } from "../../utils/user";
import { DirectMessageModel } from "../../database/models/Message.model";
import { LandlordModel } from "../../database/models/Landlord.model";
import { TenantModel } from "../../database/models/Tenant.model";
import { TradesmenModel } from "../../database/models/Tradesmen.model";

export const sendMessage = async (
  req: Request,
  res: Response
) => {
  const { recipientUsername, directMessage } = req.body
  const userId = req.userId

  if (!userId) {
    return res.status(401).json({ message: "Invalid token" });
  };

  try {
    const sender = await getUserById(userId, excludeFields);

    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    // Find the recipient by username
    const recipient =
      (await LandlordModel.findOne({ username: recipientUsername })) ||
      (await TenantModel.findOne({ username: recipientUsername })) ||
      (await TradesmenModel.findOne({ username: recipientUsername }));

    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // Step 3 — Determine each user’s model for refPath
    const getSenderModel = (accountType: string) => {
      if (accountType === 'landlord') return 'Landlords';
      if (accountType === 'tradesmen') return 'Tradesmen';
      return 'Tenants';
    };

    const senderModel = getSenderModel(sender.accountType ?? '');
    const recipientModel = getSenderModel(recipient.accountType ?? '');

    // Find if a conversation already exists between sender and recipient
    let dm = await DirectMessageModel.findOne({
      participants: { $all: [sender._id, recipient._id] },
    });

    // If not, create one
    if (!dm) {
      dm = new DirectMessageModel({
        participants: [userId, recipient],
        participantsModel: [senderModel, recipientModel], // You can replace this dynamically later
        messages: [],
      });
    }

    // Create the message
    const newMessage = {
      sender: sender._id,
      content: directMessage,
      sentAt: new Date(),
    };

    dm.messages.push(newMessage);
    dm.lastUpdated = new Date();

    await dm.save();

    res.status(201).json({
      message: "Message sent successfully",
      data: {
        senderUsername: sender.username,
        recipientUsername: recipient.username,
        content: directMessage,
        time: newMessage.sentAt,
      },
    })
  } catch (err) {
    console.error('Unexpected Error', err);
    res.status(500).json({ message: 'Oops! Something went wrong!' })
  }
}
