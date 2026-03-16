import express from 'express';
import { getMonthlyWorkOrders } from '../../controllers/workOrders/getMonthlyWorkOrdersController';
import { getPropertyWorkOrders } from '../../controllers/workOrders/propertyWorkOrdersController';

const router = express.Router();

router.get('/:landlordId/:propertyId/monthly', getMonthlyWorkOrders)
router.get('/:landlordId/:propertyId', getPropertyWorkOrders)

export default router