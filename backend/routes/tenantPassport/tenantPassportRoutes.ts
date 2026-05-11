import express from 'express';
import { identityStep } from '../../controllers/tenantPassport/identityStepController';

const router = express.Router()

router.post('/identity/start', identityStep)

export default router