import express from 'express';
import { rentPriceAcknowledgement, rentPriceApproval } from '../../controllers/rent/rentController';

const router = express.Router();

router.post('/price-acknowledgement', rentPriceAcknowledgement);
router.post('/acknowledge', rentPriceApproval);

export default router