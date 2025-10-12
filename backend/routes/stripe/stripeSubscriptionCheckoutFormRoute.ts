import express from 'express';
import { stripeSubscriptionCheckoutFormController } from '../../controllers/stripe/stripeSubscriptionCheckoutFormController';

const router = express.Router();

router.post('/stripeSubscriptionCheckout/:id', stripeSubscriptionCheckoutFormController);

export default router