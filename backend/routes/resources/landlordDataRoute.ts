import express from 'express';
import { getLandlordTenants } from '../../controllers/resources/landlordTenantsController';
import { addProperty, getLandlordProperties } from '../../controllers/resources/landlordPropertyController';
import { removeTenant } from '../../controllers/resources/removeTenantController';

const router = express.Router();

router.get('/tenants', getLandlordTenants);
router.post('/properties', addProperty);
router.get('/properties', getLandlordProperties)
router.delete('/tenant', removeTenant);

export default router