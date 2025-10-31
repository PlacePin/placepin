import type { Request, Response } from "express";
import { excludeFields, getUserById } from "../../utils/user";
import { DirectMessageModel } from "../../database/models/Message.model";

export const sendMessage = async (
  req: Request,
  res: Response
) => {
  const { recipient, directMessage } = req.body
  const userId = req.userId

  if(!userId){
    return res.status(401).json({ message: "Invalid token" });
  };

  try{
    const user = await getUserById(userId, excludeFields);

    // Find if a conversation already exists between sender and recipient
    let dm = await DirectMessageModel.findOne({
      participants: { $all: [userId, recipient] },
    });

    // If not, create one
    if (!dm) {
      dm = new DirectMessageModel({
        participants: [userId, recipient],
        participantsModel: ["Landlords", "Tenants"], // You can replace this dynamically later
        messages: [],
      });
    }

    // Create the message
    const newMessage = {
      sender: userId,
      content: directMessage,
      sentAt: new Date(),
    };

    dm.messages.push(newMessage);
    dm.lastUpdated = new Date();

    await dm.save();

    console.log(user?.id)
    res.status(200).json({ user })
  } catch (err) {
    console.error('Unexpected Error', err);
    res.status(500).json({ message: 'Oops! Something went wrong!' })
  }
}
