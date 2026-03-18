import express from 'express';
import { settingsBasicInfo } from '../../controllers/settings/settingsBasicInfoController';
import { updateBasicInfo } from '../../controllers/settings/updateBasicInfoController';
import { uploadProfilePic } from '../../controllers/settings/uploadProfilePicController';
import { stripeSubscriptionCheckoutForm } from '../../controllers/stripe/stripeSubscriptionCheckoutFormController';
import { stripeSaveCardForm } from '../../controllers/stripe/stripeSaveCardFormController';
import upload from '../../middleware/multer';

const router = express.Router()

router.get('/', settingsBasicInfo);
router.put('/', updateBasicInfo);
router.post('/profile-pic', upload.single('profilePic'), uploadProfilePic);
router.post('/stripe/subscription-checkout-form', stripeSubscriptionCheckoutForm);
router.post('/savecardform', stripeSaveCardForm);

export default router