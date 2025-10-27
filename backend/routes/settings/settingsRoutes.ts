import express from 'express';
import { settingsBasicInfo } from '../../controllers/settings/settingsBasicInfoController';

const router = express.Router()

router.get('/', settingsBasicInfo)

export default router