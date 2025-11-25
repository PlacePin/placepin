import express from 'express';
import { getLandlordTenants } from '../../controllers/resources/landlordTenantsController';
import { addProperty, getLandlordProperties } from '../../controllers/resources/landlordPropertyController';
import { removeTenant } from '../../controllers/resources/removeTenantController';
import { removeProperty } from '../../controllers/resources/removePropertyController';

const router = express.Router();

router.get('/tenants', getLandlordTenants);
router.post('/properties', addProperty);
router.get('/properties', getLandlordProperties)
router.delete('/tenant', removeTenant);
router.delete('/property', removeProperty);

export default router