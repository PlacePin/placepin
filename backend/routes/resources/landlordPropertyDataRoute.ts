import express from 'express';
import { addPropertyController } from '../../controllers/resources/addPropertyController';

const router = express.Router()

router.post('/properties/', addPropertyController)

export default router