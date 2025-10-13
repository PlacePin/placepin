import express from 'express';
import { stripeSaveCardFormController } from '../../controllers/stripe/stripeSaveCardFormController';

const router = express.Router()

router.post('/savecardform', stripeSaveCardFormController);

export default router