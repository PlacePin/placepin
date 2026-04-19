import express from 'express';
import upload from '../../middleware/multer';
import { settingsBasicInfo } from '../../controllers/settings/settingsBasicInfoController';
import { updateBasicInfo } from '../../controllers/settings/updateBasicInfoController';
import { uploadProfilePic } from '../../controllers/settings/uploadProfilePicController';
import { stripeSubscriptionCheckoutForm } from '../../controllers/stripe/stripeSubscriptionCheckoutFormController';
import { stripeSaveCardForm } from '../../controllers/stripe/stripeSaveCardFormController';
import { stripeCancelSubscription } from '../../controllers/stripe/stripeCancelSubscriptionController';
import { stripeSubscriptionStatus } from '../../controllers/stripe/stripeSubscriptionStatusController';

const router = express.Router()

router.get('/', settingsBasicInfo);
router.put('/', updateBasicInfo);
router.post('/profile-pic', upload.single('profilePic'), uploadProfilePic);
router.get('/stripe/subscription-status', stripeSubscriptionStatus);
router.post('/stripe/subscription-checkout-form', stripeSubscriptionCheckoutForm);
router.post('/stripe/cancel-subscription', stripeCancelSubscription)
router.post('/savecardform', stripeSaveCardForm);

export default router