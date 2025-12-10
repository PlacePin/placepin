import express from 'express';
import { getLandlordTenants } from '../../controllers/resources/landlordTenantsController';
import { addProperty, getLandlordProperties } from '../../controllers/resources/landlordPropertyController';
import { removeTenant } from '../../controllers/resources/removeTenantController';
import { removeProperty } from '../../controllers/resources/removePropertyController';
import { getReceipt } from '../../controllers/resources/landlordReceiptController';

const router = express.Router();

router.get('/tenants', getLandlordTenants);
router.get('/properties', getLandlordProperties)
router.get('/receipts', getReceipt)
router.post('/properties', addProperty);
router.delete('/tenant', removeTenant);
router.delete('/property', removeProperty);

export default router