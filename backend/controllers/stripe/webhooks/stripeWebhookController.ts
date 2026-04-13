import type { Request, Response } from "express";
import Stripe from "stripe";
import { LandlordModel } from "../../../database/models/Landlord.model";
import { TenantModel } from "../../../database/models/Tenant.model";
import { TradesmenModel } from "../../../database/models/Tradesmen.model";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
const stripe = new Stripe(STRIPE_SECRET_KEY);

export const stripeWebhookController = async (
  req: Request,
  res: Response
) => {
  const sig = req.headers["stripe-signature"] as string | undefined;
  if (!sig || !STRIPE_WEBHOOK_SECRET) {
    return res.status(400).send("Missing signature or webhook secret");
  }

  let event: Stripe.Event;
  try {
    // req.body must be the raw body (Buffer), so ensure raw() middleware used on this route
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err?.message);
    return res.status(400).send(`Webhook Error: ${err?.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        // only handle subscriptions from checkout
        if (session.mode === "subscription" && session.customer) {
          const stripeCustomerId =
            typeof session.customer === "string" ? session.customer : session.customer.id;
          const stripeSubscriptionId =
            typeof session.subscription === "string" ? session.subscription : null;

          const landlord = await LandlordModel.findOne({ "subscription.stripeCustomerId": stripeCustomerId })
          const tenant = await TenantModel.findOne({ "subscription.stripeCustomerId": stripeCustomerId })
          const tradesmen = await TradesmenModel.findOne({ "subscription.stripeCustomerId": stripeCustomerId })

          if (landlord) {
            // update the landlord by stripe customer id
            await LandlordModel.updateOne(
              { "subscription.stripeCustomerId": stripeCustomerId },
              {
                "subscription.isSubscribed": true,
                // optional: store subscription id if present
                "subscription.stripeSubscriptionId": stripeSubscriptionId
              }
            );
            console.log("Marked LANDLORD subscribed for:", stripeCustomerId);
          } else if (tenant) {
            await TenantModel.updateOne(
              { "subscription.stripeCustomerId": stripeCustomerId },
              {
                "subscription.isSubscribed": true,
                // optional: store subscription id if present
                "subscription.stripeSubscriptionId": stripeSubscriptionId
              }
            )
            console.log("Marked TENANT subscribed for:", stripeCustomerId);
          } else if (tradesmen) {
            await TradesmenModel.updateOne(
              { "subscription.stripeCustomerId": stripeCustomerId },
              {
                "subscription.isSubscribed": true,
                // optional: store subscription id if present
                "subscription.stripeSubscriptionId": stripeSubscriptionId
              }
            )
            console.log("Marked TRADESMEN subscribed for:", stripeCustomerId);
          } else {
            console.warn("No User found with stripeCustomerId:", stripeCustomerId);
          }
        }
        break;
      }

      // Fires 3 days before trial ends — use this to email the landlord a heads up
      case "customer.subscription.trial_will_end": {
        const subscription = event.data.object as Stripe.Subscription;
        const stripeCustomerId =
          typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;

        const landlord = await LandlordModel.findOne({ "subscription.stripeCustomerId": stripeCustomerId });

        if (landlord) {
          // TODO: send trial ending email to landlord
          console.log("Trial ending soon for landlord:", stripeCustomerId);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const stripeCustomerId =
          typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;

        const updatedSubscription = {
          "subscription.isSubscribed": false,
          "subscription.stripeSubscriptionId": null
        };

        await LandlordModel.updateOne({ "subscription.stripeCustomerId": stripeCustomerId }, updatedSubscription);
        await TenantModel.updateOne({ "subscription.stripeCustomerId": stripeCustomerId }, updatedSubscription);
        await TradesmenModel.updateOne({ "subscription.stripeCustomerId": stripeCustomerId }, updatedSubscription);

        console.log("Subscription deleted for:", stripeCustomerId);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        // invoice.customer is the stripe customer id (string)
        const stripeCustomerId = typeof invoice.customer === "string" ? invoice.customer : (invoice.customer as any)?.id;

        if (stripeCustomerId) {
          // subscription succeeded — ensure isSubscribed true
          await LandlordModel.updateOne(
            { "subscription.stripeCustomerId": stripeCustomerId },
            { "subscription.isSubscribed": true }
          );
          await TenantModel.updateOne(
            { "subscription.stripeCustomerId": stripeCustomerId },
            { "subscription.isSubscribed": true }
          );
          await TradesmenModel.updateOne(
            { "subscription.stripeCustomerId": stripeCustomerId },
            { "subscription.isSubscribed": true }
          );
          console.log("Invoice paid — ensured isSubscribed true for", stripeCustomerId);
        }
        break;
      }

      // Fires when trial ends and card charge fails — lock them out
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const stripeCustomerId =
          typeof invoice.customer === "string" ? invoice.customer : (invoice.customer as any)?.id;

        if (stripeCustomerId) {
          await LandlordModel.updateOne(
            { "subscription.stripeCustomerId": stripeCustomerId },
            { "subscription.isSubscribed": false }
          );
          await TenantModel.updateOne(
            { "subscription.stripeCustomerId": stripeCustomerId },
            { "subscription.isSubscribed": false }
          );
          await TradesmenModel.updateOne(
            { "subscription.stripeCustomerId": stripeCustomerId },
            { "subscription.isSubscribed": false }
          );
          console.log("Invoice failed — isSubscribed false for:", stripeCustomerId);
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const { tenantId, rentAmount } = paymentIntent.metadata;

        // Only handle rent payments, not subscription payments
        if (!tenantId || !rentAmount) break;

        await TenantModel.updateOne(
          { _id: tenantId },
          {
            $push: {
              rentPayment: {
                rentAmount: Number(rentAmount),
                monthPaid: new Date(),
                rentDue: new Date(),
              }
            }
          }
        );
        console.log("Rent payment succeeded for tenant:", tenantId);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const { tenantId } = paymentIntent.metadata;

        // Only handle rent payments
        if (!tenantId) break;

        // TODO: notify tenant their payment failed via email or message
        console.log("Rent payment failed for tenant:", tenantId);
        break;
      }

      // handle other relevant events if you want
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Acknowledge receipt
    res.status(200).send({ received: true });
  } catch (err) {
    console.error("Error handling webhook event:", err);
    // 500 will trigger retries from Stripe
    res.status(500).send();
  }
};
