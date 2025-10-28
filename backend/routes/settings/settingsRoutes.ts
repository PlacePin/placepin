import express from 'express';
import { settingsBasicInfo } from '../../controllers/settings/settingsBasicInfoController';
import { stripeSubscriptionCheckoutForm } from '../../controllers/stripe/stripeSubscriptionCheckoutFormController';
import { stripeSaveCardForm } from '../../controllers/stripe/stripeSaveCardFormController';

const router = express.Router()

router.get('/', settingsBasicInfo);
router.post('/stripe/subscription-checkout-form', stripeSubscriptionCheckoutForm);
router.post('/savecardform', stripeSaveCardForm);

export default router