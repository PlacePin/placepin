import type { Request, Response } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import { LandlordModel } from "../../../database/models/Landlord.model";
import { TenantModel } from "../../../database/models/Tenant.model";

dotenv.config();
const STRIPE_TEST_SECRET_KEY = process.env.STRIPE_TEST_SECRET_KEY!;
const STRIPE_TEST_WEBHOOK_SECRET = process.env.STRIPE_TEST_WEBHOOK_SECRET!;
const stripe = new Stripe(STRIPE_TEST_SECRET_KEY, { apiVersion: "2025-09-30.clover" });

export const stripeWebhookController = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string | undefined;
  if (!sig || !STRIPE_TEST_WEBHOOK_SECRET) {
    return res.status(400).send("Missing signature or webhook secret");
  }

  let event: Stripe.Event;
  try {
    // req.body must be the raw body (Buffer), so ensure raw() middleware used on this route
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_TEST_WEBHOOK_SECRET);
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

          const landlord = await LandlordModel.findOne({ "subscription.stripeCustomerId": stripeCustomerId })
          const tenant = await TenantModel.findOne({ "subscription.stripeCustomerId": stripeCustomerId })

          if (landlord) {
            // update the landlord by stripe customer id
            await LandlordModel.updateOne(
              { "subscription.stripeCustomerId": stripeCustomerId },
              {
                "subscription.isSubscribed": true,
                // optional: store subscription id if present
                // "subscription.stripeSubscriptionId": session.subscription
              }
            );
            console.log("Marked LANDLORD subscribed for:", stripeCustomerId);
          } else if (tenant) {
            await TenantModel.updateOne(
              { "subscription.stripeCustomerId": stripeCustomerId },
              {
                "subscription.isSubscribed": true,
                // optional: store subscription id if present
                // "subscription.stripeSubscriptionId": session.subscription
              }
            )
            console.log("Marked TENANT subscribed for:", stripeCustomerId);
          } else {
            console.warn("No landlord or tenant found with stripeCustomerId:", stripeCustomerId);
          }
        }
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
          console.log("Invoice paid — ensured isSubscribed true for", stripeCustomerId);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const stripeCustomerId = typeof invoice.customer === "string" ? invoice.customer : (invoice.customer as any)?.id;
        if (stripeCustomerId) {
          // optional: mark as not subscribed or notify user
          console.log("Invoice failed for", stripeCustomerId);
        }
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
