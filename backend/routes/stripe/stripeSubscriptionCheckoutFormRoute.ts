import express from 'express';
import { stripeSubscriptionCheckoutFormController } from '../../controllers/stripe/stripeSubscriptionCheckoutFormController';

const router = express.Router();

router.post('/stripeSubscriptionCheckout', stripeSubscriptionCheckoutFormController);

export default router