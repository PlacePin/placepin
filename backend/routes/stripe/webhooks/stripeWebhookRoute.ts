import express from "express";
import { stripeWebhookController } from "../../../controllers/stripe/webhooks/stripeWebhookController";

const router = express.Router();

router.post("/stripe-payment-subscribed", express.raw({ type: "application/json" }), stripeWebhookController);

export default router;
