import express from 'express';
import { subscriptionController } from '../../controllers/resources/subscriptionController';
import { subscriptionTierController } from '../../controllers/resources/subscriptionTierController';

const router = express.Router()

router.get('/subscription/status', subscriptionController)
router.get('/subscription/tier/:id', subscriptionTierController)

export default router