import express from 'express';
import { addPropertyController } from '../../controllers/resources/addPropertyController';

const router = express.Router()

router.post('/properties/:id', addPropertyController)

export default router