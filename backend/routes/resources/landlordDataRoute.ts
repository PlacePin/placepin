import express from 'express';
import { getLandlordTenants } from '../../controllers/resources/landlordTenantsController';
import { addProperty, getLandlordProperties, updatePropertyInfo } from '../../controllers/resources/landlordPropertyController';
import { removeTenant } from '../../controllers/resources/removeTenantController';
import { removeProperty } from '../../controllers/resources/removePropertyController';
import { getReceipt, addReceipt, updateReceipt } from '../../controllers/resources/landlordReceiptController';
import { getTradesmen } from '../../controllers/resources/landlordTradesmenController';
import { getTenantGiftCatalog, sendTenantGift } from '../../controllers/gifts/tenantGiftController';

const router = express.Router();

router.get('/tenants', getLandlordTenants);
router.get('/tenant-gifts/catalog', getTenantGiftCatalog);
router.post('/tenant-gifts/send', sendTenantGift);
router.get('/properties', getLandlordProperties);
router.get('/receipts', getReceipt);
router.get('/tradesmen', getTradesmen)
router.post('/receipts', addReceipt);
router.post('/properties', addProperty);
router.put('/receipts', updateReceipt)
router.put('/properties', updatePropertyInfo)
router.delete('/tenant', removeTenant);
router.delete('/property', removeProperty);

export default router