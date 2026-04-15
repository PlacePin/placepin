import Stripe from 'stripe';
import { LandlordModel } from '../database/models/Landlord.model';
import { TenantModel } from '../database/models/Tenant.model';


export async function processRentPayments(dueDate: 1 | 15) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  console.log(`Processing rent payments for tenants with due date: ${dueDate}`);

  const landlords = await LandlordModel.find({
    'properties.tenants.rentStatus': 'queued'
  });

  for (const landlord of landlords) {
    for (const property of landlord.properties) {
      for (const tenant of property.tenants) {

        // Only process queued tenants matching today's due date
        if (tenant.rentStatus !== 'queued' || (tenant.dueDate !== dueDate)) continue;

        const tenantId = String(tenant.tenantId);
        if (!tenantId) continue;

        const tenantDoc = await TenantModel.findById(tenantId);
        if (!tenantDoc?.subscription?.stripeCustomerId || !tenantDoc?.subscription?.stripeBankAccountId) {
          console.warn(`Tenant ${tenantId} missing Stripe info, skipping`);
          continue;
        }

        try {
          await stripe.paymentIntents.create({
            amount: Math.round(tenant.rentAmountExpected * 100),
            currency: 'usd',
            customer: tenantDoc.subscription.stripeCustomerId,
            payment_method: tenantDoc.subscription.stripeBankAccountId,
            mandate: tenantDoc.subscription.stripeMandateId,
            confirm: true,
            automatic_payment_methods: {
              enabled: true,
              allow_redirects: 'never',
            },
            metadata: {
              tenantId,
              rentAmount: tenant.rentAmountExpected,
            },
          });

          // Mark as paid on success
          await LandlordModel.findOneAndUpdate(
            {
              _id: landlord._id,
              'properties.tenants.tenantId': tenantId
            },
            {
              $set: {
                'properties.$.tenants.$[ten].rentStatus': 'paid',
                'properties.$.tenants.$[ten].monthPaid': true,
                'properties.$.tenants.$[ten].rentAmountPaid': tenant.rentAmountExpected,
              }
            },
            { arrayFilters: [{ 'ten.tenantId': tenant.tenantId }] }
          );

          console.log(`✅ Charged tenant ${tenantId} $${tenant.rentAmountExpected}`);

        } catch (err: any) {
          console.error(`❌ Failed to charge tenant ${tenantId}:`, err?.raw?.message || err?.message);

          // Mark as overdue so it doesn't retry endlessly
          await LandlordModel.findOneAndUpdate(
            {
              _id: landlord._id,
              'properties.tenants.tenantId': tenantId
            },
            {
              $set: {
                'properties.$.tenants.$[ten].rentStatus': 'overdue',
                'properties.$.tenants.$[ten].rentAmountPaid': 0,
              }
            },
            { arrayFilters: [{ 'ten.tenantId': tenant.tenantId }] }
          );
        }
      }
    }
  }
}