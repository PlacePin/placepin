import type { Request, Response } from 'express';
import Stripe from 'stripe';
import { TenantModel } from '../../database/models/Tenant.model.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Step 1: Create Financial Connections session
export const createFinancialConnectionsSession = async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    if (!userId) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const tenant = await TenantModel.findById(userId);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    // Create Stripe customer if one doesn't exist
    let stripeCustomerId = tenant.subscription?.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: tenant.email ?? undefined,
        name: tenant.fullName ?? undefined,
      });
      stripeCustomerId = customer.id;
      tenant.subscription!.stripeCustomerId = stripeCustomerId;
      await tenant.save();
    }

    // Create a SetupIntent for saving bank account for future payments
    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomerId,
      payment_method_types: ['us_bank_account'],
      usage: 'off_session',
    });

    res.json({ client_secret: setupIntent.client_secret });
  } catch (error) {
    console.error('Financial Connections session error:', error);
    res.status(500).json({ message: 'Failed to create session' });
  }
};

// Step 2: Save the connected bank account
export const saveFinancialConnectionsAccount = async (req: Request, res: Response) => {
  const { paymentMethodId } = req.body;
  const userId = req.userId;

  try {
    if (!userId) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const tenant = await TenantModel.findById(userId);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: tenant.subscription!.stripeCustomerId!,
    });


    // Save to tenant
    tenant.subscription!.stripeBankAccountId = paymentMethodId;
    tenant.subscription!.paymentMethod = 'ach';
    await tenant.save();

    return res.status(200).json({ success: true, paymentMethodId });
  } catch (error) {
    console.error('Save financial connections account error:', error);
    return res.status(500).json({ message: 'Failed to save bank account' });
  }
};