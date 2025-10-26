import express from 'express';
import { settingsBasicInfoController } from '../../controllers/settings/settingsBasicInfoController';

const router = express.Router()

router.get('/', settingsBasicInfoController)

export default router