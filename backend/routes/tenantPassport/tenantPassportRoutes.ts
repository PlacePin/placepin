import express from 'express';
import { identityStep } from '../../controllers/tenantPassport/identityStepController';

const router = express.Router()

router.post('/identity', identityStep)

export default router