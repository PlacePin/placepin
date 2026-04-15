import express from 'express';
import {
  createFinancialConnectionsSession,
  saveFinancialConnectionsAccount
} from '../../controllers/stripe/stripeFinancialConnectionsController.js';

const router = express.Router();

router.get('/session', createFinancialConnectionsSession);
router.post('/save-account', saveFinancialConnectionsAccount);

export default router;