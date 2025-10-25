import express from 'express';
import { userController } from '../../controllers/resources/userController';

const router = express.Router()

router.get('/user', userController)

export default router