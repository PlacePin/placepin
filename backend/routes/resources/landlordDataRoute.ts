import express from 'express';
import { getLandlordTenants } from '../../controllers/resources/landlordTenantsController';
import { addProperty, getLandlordProperties } from '../../controllers/resources/landlordPropertyController';

const router = express.Router();

router.get('/tenants', getLandlordTenants);
router.post('/properties', addProperty);
router.get('/properties', getLandlordProperties)

export default router