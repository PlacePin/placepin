import type { Request, Response } from "express";
import Stripe from "stripe";
import { LandlordModel, type LandlordDocumentType } from "../../database/models/Landlord.model";
import { TenantModel, type TenantDocumentType } from "../../database/models/Tenant.model";
import { TradesmenModel, type TradesmenDocumentType } from "../../database/models/Tradesmen.model";

export const deleteAccount = async (req: Request, res: Response) => {
  const userId = req.userId;
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

  if (!STRIPE_SECRET_KEY) {
    return res.status(500).json({ message: "Stripe key missing!" });
  }

  if (!userId) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY);

  // Best-effort cancellation: log but don't fail account deletion if Stripe rejects
  // (e.g. the subscription was already cancelled, or the id is stale).
  const cancelStripeSubscription = async (
    stripeSubscriptionId: string | null | undefined,
  ) => {
    if (!stripeSubscriptionId) return;
    try {
      await stripe.subscriptions.cancel(stripeSubscriptionId);
    } catch (err) {
      console.error(
        `Failed to cancel Stripe subscription ${stripeSubscriptionId}`,
        err,
      );
    }
  };

  try {
    const landlord = await LandlordModel.findById(userId);
    const tenant = await TenantModel.findById(userId);
    const tradesmen = await TradesmenModel.findById(userId);
    const user:
      | LandlordDocumentType
      | TenantDocumentType
      | TradesmenDocumentType
      | null = landlord || tenant || tradesmen;

    if (!user) {
      return res.status(404).json({ message: "User doesn't exist." });
    }

    await cancelStripeSubscription(user.subscription?.stripeSubscriptionId);

    if (landlord) {
      const tenantIds = (landlord.properties ?? [])
        .flatMap((property) => property.tenants ?? [])
        .map((entry) => entry.tenantId)
        .filter((id): id is NonNullable<typeof id> => Boolean(id));

      if (tenantIds.length > 0) {
        const referencedTenants = await TenantModel.find({
          _id: { $in: tenantIds },
        });

        await Promise.all(
          referencedTenants.map(async (referencedTenant) => {
            await cancelStripeSubscription(
              referencedTenant.subscription?.stripeSubscriptionId,
            );

            if (referencedTenant.subscription) {
              referencedTenant.subscription.isSubscribed = false;
              referencedTenant.subscription.stripeSubscriptionId = null;
              referencedTenant.subscription.tier = "Landlord-Sponsored";
            }
            referencedTenant.referredByLandlord = null;
            await referencedTenant.save();
          }),
        );
      }

      await LandlordModel.findByIdAndDelete(userId);
    } else if (tenant) {
      await TenantModel.findByIdAndDelete(userId);
    } else if (tradesmen) {
      await TradesmenModel.findByIdAndDelete(userId);
    }

    return res.status(200).json({ message: "Account deleted successfully." });
  } catch (err) {
    console.error("Delete account error:", err);
    return res.status(500).json({ error: "Unexpected error!" });
  }
};
