import express from 'express';
import { landlordSubscription } from '../../controllers/resources/subscriptionController';
import { subscriptionTier } from '../../controllers/resources/subscriptionTierController';

const router = express.Router()

router.get('/status', landlordSubscription)
router.get('/tier', subscriptionTier)

export default router