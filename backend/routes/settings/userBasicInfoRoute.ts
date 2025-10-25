import express from 'express';
import { userBasicInfoController } from '../../controllers/settings/userBasicInfoController';

const router = express.Router()

router.get('/usersettings', userBasicInfoController)

export default router