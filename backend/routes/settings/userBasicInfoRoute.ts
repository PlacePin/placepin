import express from 'express';
import { userBasicInfoController } from '../../controllers/settings/userBasicInfoController';

const router = express.Router()

router.get('/usersettings/:id', userBasicInfoController)

export default router