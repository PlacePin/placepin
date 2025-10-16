import express from 'express';
import { inviteTenantController } from '../../controllers/resources/inviteTenantController';

const router = express.Router()

router.post('/invite/tenant', inviteTenantController)

export default router