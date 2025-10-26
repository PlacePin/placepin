import express from 'express';
import { settingsBasicInfoController } from '../../controllers/settings/settingsBasicInfoController';

const router = express.Router()

router.get('/settings', settingsBasicInfoController)

export default router