import express from 'express';
import { getUser } from '../../controllers/resources/usersController';

const router = express.Router()

router.get('/', getUser)

export default router