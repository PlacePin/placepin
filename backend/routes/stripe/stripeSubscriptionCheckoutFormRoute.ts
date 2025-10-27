import express from 'express';
import { stripeSubscriptionCheckoutFormController } from '../../controllers/stripe/stripeSubscriptionCheckoutFormController';

const router = express.Router();

router.post('/subscription-checkout-form', stripeSubscriptionCheckoutFormController);

export default router