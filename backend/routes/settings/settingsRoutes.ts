import express from 'express';
import { settingsBasicInfo } from '../../controllers/settings/settingsBasicInfoController';
import { stripeSubscriptionCheckoutFormController } from '../../controllers/stripe/stripeSubscriptionCheckoutFormController';

const router = express.Router()

router.get('/', settingsBasicInfo)
router.post('/stripe/subscription-checkout-form', stripeSubscriptionCheckoutFormController);

export default router