import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { LandlordModel } from '../../database/models/Landlord.model';
import { TenantModel } from '../../database/models/Tenant.model';
import { DirectMessageModel } from '../../database/models/Message.model';
import { getSocketIO } from '../../socketInstance';
import {
  PREZZEE_FEE_DISCLOSURE,
  PREZZEE_TENANT_FEE_NOTE,
  fetchGiftCatalog,
  fulfillPrezzeeGift,
  PLACEPIN_DEMO_PRODUCT,
} from '../../services/prezzeeGiftService';

async function landlordOwnsTenant(landlordId: string, tenantId: string) {
  return LandlordModel.exists({
    _id: landlordId,
    'properties.tenants.tenantId': new mongoose.Types.ObjectId(tenantId),
  });
}

function formatMoney(amountCents: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
    }).format(amountCents / 100);
  } catch {
    return `${(amountCents / 100).toFixed(2)} ${currency}`;
  }
}

export const getTenantGiftCatalog = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    const catalog = await fetchGiftCatalog();
    return res.status(200).json({
      feeDisclosure: PREZZEE_FEE_DISCLOSURE,
      ...catalog,
    });
  } catch (err) {
    console.error('getTenantGiftCatalog', err);
    return res.status(500).json({ message: 'Unexpected error loading gift catalog.' });
  }
};

export const sendTenantGift = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const {
    tenantId,
    productCode,
    productThemeCode,
    styleCode,
    amount,
    currency,
    personalMessage,
  } = req.body as {
    tenantId?: string;
    productCode?: string;
    productThemeCode?: string;
    styleCode?: string;
    amount?: number;
    currency?: string;
    personalMessage?: string;
  };

  if (!tenantId || !productCode || typeof amount !== 'number' || !currency) {
    return res.status(400).json({ message: 'tenantId, productCode, amount, and currency are required' });
  }

  try {
    const owns = await landlordOwnsTenant(userId, tenantId);
    if (!owns) {
      return res.status(403).json({ message: 'You can only send gifts to your own tenants.' });
    }

    const [tenant, landlord] = await Promise.all([
      TenantModel.findById(tenantId).select('fullName email username').lean(),
      LandlordModel.findById(userId).select('fullName username').lean(),
    ]);

    if (!tenant?.email) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    const catalog = await fetchGiftCatalog();
    const product = catalog.products.find((p) => p.code === productCode);
    if (!product) {
      return res.status(400).json({ message: 'Unknown product' });
    }

    const denomOk =
      productCode === PLACEPIN_DEMO_PRODUCT ||
      product.denominations.some((d) => d.amount === amount && d.currency === currency);
    if (!denomOk) {
      return res.status(400).json({ message: 'Invalid amount for this product' });
    }

    const theme =
      productCode === PLACEPIN_DEMO_PRODUCT
        ? 'DEFAULT'
        : productThemeCode || product.themeCode;
    const style =
      productCode === PLACEPIN_DEMO_PRODUCT
        ? 'DEFAULT'
        : styleCode || catalog.styleCode;
    if (!style) {
      return res.status(400).json({ message: 'No greeting style available — configure Prezzee styles.' });
    }

    const senderName = landlord?.fullName || landlord?.username || 'Your landlord';
    const recipientName = tenant.fullName || tenant.username || 'Tenant';
    const msg =
      typeof personalMessage === 'string' && personalMessage.trim().length > 0
        ? personalMessage.trim().slice(0, 500)
        : 'Thank you for being a great tenant!';

    const { voucherUrl, orderUuid } = await fulfillPrezzeeGift({
      productCode,
      productThemeCode: theme,
      styleCode: style,
      amount,
      currency,
      recipientEmail: tenant.email,
      recipientName,
      senderName,
      personalMessage: msg,
    });

    const faceValueLabel = formatMoney(amount, currency);
    const content = `${recipientName}, your landlord sent you a ${faceValueLabel} digital gift card. Open it below to view and redeem.`;

    let conversation = await DirectMessageModel.findOne({
      participants: { $all: [userId, tenantId] },
    });

    if (!conversation) {
      conversation = await DirectMessageModel.create({
        participants: [userId, tenantId],
        participantsModel: ['Landlords', 'Tenants'],
        messages: [],
      });
    }

    const actionPayload = {
      redemptionUrl: voucherUrl,
      amountCents: amount,
      currency,
      productName: product.name,
      feeDisclosure: PREZZEE_TENANT_FEE_NOTE,
      orderReference: orderUuid,
    };

    conversation.messages.push({
      sender: new mongoose.Types.ObjectId(userId),
      content,
      action: {
        type: 'PREZZEE_GIFT_CARD',
        payload: actionPayload,
        completed: true,
      },
      sentAt: new Date(),
    });
    conversation.lastUpdated = new Date();
    await conversation.save();

    const last = conversation.messages[conversation.messages.length - 1];
    const time = last.sentAt;

    const io = getSocketIO();
    if (io) {
      const senderUsername = landlord?.username ?? '';
      const recipientUsername = tenant.username ?? '';
      const socketPayload = {
        senderId: String(userId),
        receiverId: String(tenantId),
        senderUsername,
        recipientUsername,
        content,
        sentAt: time,
        action: {
          type: 'PREZZEE_GIFT_CARD',
          payload: actionPayload,
          completed: true,
        },
      };
      io.to(String(tenantId)).emit('private_message', socketPayload);
      io.to(String(userId)).emit('private_message', socketPayload);
    }

    return res.status(201).json({
      message: 'Gift sent',
      redemptionUrl: voucherUrl,
    });
  } catch (err) {
    console.error('sendTenantGift', err);
    return res.status(500).json({ message: 'Could not complete the gift order. Try again later.' });
  }
};
