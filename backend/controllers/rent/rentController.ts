import type { Request, Response } from "express";
import { TenantModel } from "../../database/models/Tenant.model";
import { DirectMessageModel } from "../../database/models/Message.model";
import Stripe from "stripe";

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

  const { rentPrice, acknowledged } = req.body;
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

    const amountInCents = Math.round(rentPrice * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      customer: tenant.subscription.stripeCustomerId,
      payment_method: tenant.subscription.stripeBankAccountId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
      mandate_data: {
        customer_acceptance: {
          type: 'online',
          online: {
            ip_address: req.ip!,
            user_agent: req.headers['user-agent']!,
          },
        },
      },
      metadata: {
        tenantId: userId,
        rentAmount: rentPrice,
      },
    });

    res.status(200).json({
      message: 'Rent payment initiated',
      paymentIntentId: paymentIntent.id,
    });

  } catch (err: any) {
    console.error('Unexpected Error', err?.raw?.message || err?.message || err);
    res.status(500).json({ message: 'Oops! Something went wrong!' });
  }
};