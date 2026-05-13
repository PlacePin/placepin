import type { Request, Response } from 'express';
import Stripe from 'stripe';
import { TenantModel } from '../../database/models/Tenant.model';

export const identityStep = async (
  req: Request,
  res: Response,
) => {
  const userId = req.userId;
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  const { verificationMethod } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (!STRIPE_SECRET_KEY) {
    return res.status(500).json({ message: 'Stripe key missing!' })
  }

  try {
    const stripeAccess = new Stripe(STRIPE_SECRET_KEY);
    const session = await stripeAccess.identity.verificationSessions.create({
      type: verificationMethod === 'id' ? 'document' : 'id_number',
      metadata: { tenantId: userId },
    });

    await TenantModel.findByIdAndUpdate(userId, {
      'verification.identity.method': 'stripe_identity',
      'verification.identity.providerSessionId': session.id,
    });

    return res.status(200).json({ clientSecret: session.client_secret });

  } catch (err) {
    console.error('Stripe identity session error:', err);
    return res.status(500).json({ message: "Failed to create verification session" });
  }
}