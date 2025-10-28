import express from 'express';
import { getUser } from '../../controllers/resources/usersController';
import { inviteTenant } from '../../controllers/resources/inviteTenantController';

const router = express.Router()

router.get('/', getUser);
router.post('/invite/tenant', inviteTenant);

export default router