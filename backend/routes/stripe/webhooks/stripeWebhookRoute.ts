import express from "express";
import bodyParser from "body-parser";
import { stripeWebhookController } from "../../../controllers/stripe/webhooks/stripeWebhookController";

const router = express.Router();

router.post("/stripe-payment-subscribed", bodyParser.raw({ type: "application/json" }), stripeWebhookController);

export default router;
