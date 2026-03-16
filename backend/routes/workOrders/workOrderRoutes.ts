import express from 'express';
import { getMonthlyWorkOrders } from '../../controllers/workOrders/getMonthlyWorkOrdersController';

const router = express.Router();

router.get('/:landlordId/:propertyId/monthly', getMonthlyWorkOrders)

export default router