import express from 'express';
import { landlordTenantsController } from '../../controllers/resources/landlordTenantsController';

const router = express.Router()

router.get('/landlordtenants/:id', landlordTenantsController)

export default router