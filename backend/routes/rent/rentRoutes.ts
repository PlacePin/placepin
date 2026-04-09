import express from 'express';
import { rentPriceAcknowledgement } from '../../controllers/rent/rentController';

const router = express.Router();

router.post('/price-acknowledgement', rentPriceAcknowledgement);

export default router