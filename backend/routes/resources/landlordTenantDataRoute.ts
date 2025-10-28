import express from 'express';
import { getLandlordTenants } from '../../controllers/resources/landlordTenantsController';

const router = express.Router()

router.get('/tenants', getLandlordTenants)

export default router