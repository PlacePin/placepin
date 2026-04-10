import type { Request, Response } from "express";
import { TenantModel } from "../../database/models/Tenant.model";
import { DirectMessageModel } from "../../database/models/Message.model";

export const rentPriceAcknowledgement = async (
  req: Request,
  res: Response
) => {
  const { tenantId, rentPrice, acknowledged } = req.body;
  const userId = req.userId;

  try {
    if (!userId) {
      return res.status(401).json({ message: "Invalid token" });
    };

    const tenant = await TenantModel.findById(
      { _id: tenantId },
      { fullName: 1, _id: 0 }
    );

    if (!tenant) {
      return res.status(401).json({ message: "Tenant not found" });
    }

    const tenantName = tenant.fullName;

    const content = `Hi ${tenantName}, please acknowledge your rent will be $${rentPrice} a month.`;

    let conversation = await DirectMessageModel.findOne({
      participants: { $all: [userId, tenantId] },
    });

    if (!conversation) {
      conversation = await DirectMessageModel.create({
        participants: [userId, tenantId],
        participantsModel: ["Landlords", "Tenants"],
        messages: [],
      });
    }

    conversation.messages.push({
      sender: userId,
      content,
      action: {
        type: "ACKNOWLEDGE_RENT_PRICE",
        payload: {
          tenantId,
          rentPrice,
        },
        completed: false
      },
      sentAt: new Date(),
    });

    conversation.lastUpdated = new Date();

    await conversation.save();

    return res.status(200).json({
      message: "Message sent successfully",
      content,
    });

  } catch (err) {
    console.error('Unexpected Error', err)
    res.status(500).json({ message: 'Oops! Something went wrong!' })
  }
}