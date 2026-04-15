import express from 'express';
import { getLandlordTenantPaymentHistory, getLandlordTenants } from '../../controllers/resources/landlordTenantsController';
import { addProperty, getLandlordProperties } from '../../controllers/resources/landlordPropertyController';
import { removeTenant } from '../../controllers/resources/removeTenantController';
import { removeProperty } from '../../controllers/resources/removePropertyController';
import { getReceipt, addReceipt, updateReceipt } from '../../controllers/resources/landlordReceiptController';
import { getTradesmen } from '../../controllers/resources/landlordTradesmenController';

const router = express.Router();

router.get('/tenants', getLandlordTenants);
router.get('/tenants/:tenantId/rent-payment-history', getLandlordTenantPaymentHistory)
router.get('/properties', getLandlordProperties);
router.get('/receipts', getReceipt);
router.get('/tradesmen', getTradesmen)
router.post('/receipts', addReceipt);
router.post('/properties', addProperty);
router.put('/receipts', updateReceipt)
router.delete('/tenant', removeTenant);
router.delete('/property', removeProperty);

export default router