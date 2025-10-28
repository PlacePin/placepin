import express from 'express';
import { getLandlordTenants } from '../../controllers/resources/landlordTenantsController';
import { addProperty } from '../../controllers/resources/landlordPropertyController';

const router = express.Router();

router.get('/tenants', getLandlordTenants);
router.post('/properties', addProperty);

export default router