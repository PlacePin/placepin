import express from 'express';
import { stripeController } from '../../controllers/stripe/stripeController';

const router = express.Router();

router.post('./stripe', stripeController);

export default router