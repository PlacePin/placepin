import type { Request, Response } from "express";
import { TenantModel } from "../../database/models/Tenant.model";
import { DirectMessageModel } from "../../database/models/Message.model";
import Stripe from "stripe";
import { LandlordModel } from "../../database/models/Landlord.model";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const rentPriceAcknowledgement = async (
  req: Request,
  res: Response
) => {
  const { tenantId, rentPrice, acknowledged, dueDate } = req.body;
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

    const content = `Dear ${tenantName}, your monthly rent has been set at $${rentPrice}, due on the ${dueDate}${dueDate === 1 ? 'st' : 'th'} of each month. Please acknowledge your agreement below.`;

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
          dueDate,
        },
        completed: acknowledged
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

export const rentPriceApproval = async (
  req: Request,
  res: Response,
) => {

  const { rentPrice, acknowledged, messageId, dueDate } = req.body;
  const userId = req.userId;

  try {
    if (!userId) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    if (!acknowledged) {
      return res.status(400).json({ message: 'Rent price not acknowledged' });
    }

    const tenant = await TenantModel.findById(userId);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    if (!tenant.subscription?.stripeCustomerId) {
      return res.status(400).json({ message: 'No Stripe customer found' });
    }

    if (!tenant.subscription?.stripeBankAccountId) {
      return res.status(400).json({ message: 'No bank account linked' });
    }

    // Updating the acknowledged field
    await DirectMessageModel.findOneAndUpdate(
      { "messages._id": messageId }, // 1. Find the doc where this message exists
      {
        $set: { "messages.$.action.completed": true } // 2. Use $ to target that specific message
      },
    );

    // Finding the conversation to get the landlordId to update the expect rent amount for this tenant
    const conversation = await DirectMessageModel.findOne({
      participants: userId,
      'messages._id': messageId
    });

    if (!conversation) {
      return res.status(400).json({ message: "Missing conversation" });
    }

    const landlordIndex = conversation.participantsModel.indexOf('Landlords');
    const landlordId = conversation.participants[landlordIndex];

    await LandlordModel.findOneAndUpdate(
      {
        _id: landlordId,
        "properties.tenants.tenantId": userId // This finds the right property automatically
      },
      {
        // The $[ten] syntax allows us to target the specific tenant in the array
        $set: {
          "properties.$.tenants.$[ten].rentAmountExpected": rentPrice,
          "properties.$.tenants.$[ten].rentStatus": "queued",  // <-- queue flag
          "properties.$.tenants.$[ten].rentAcknowledgedAt": new Date(),
          "properties.$.tenants.$[ten].dueDate": dueDate,
        }
      },
      {
        arrayFilters: [{ "ten.tenantId": userId }], // Match the specific tenant
        new: true
      }
    );

    res.status(200).json({
      message: 'Rent payment initiated',
      // paymentIntentId: paymentIntent.id,
    });

  } catch (err: any) {
    console.error('Unexpected Error', err?.raw?.message || err?.message || err);
    res.status(500).json({ message: 'Oops! Something went wrong!' });
  }
};