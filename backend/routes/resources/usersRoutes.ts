import express from 'express';
import { userController } from '../../controllers/resources/userController';

const router = express.Router()

router.get('/', userController)

export default router