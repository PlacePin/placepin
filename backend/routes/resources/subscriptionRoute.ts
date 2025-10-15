import express from 'express';
import { subscriptionController } from '../../controllers/resources/subscriptionController';

const router = express.Router()

router.get('/subscription/status/:id', subscriptionController)

export default router