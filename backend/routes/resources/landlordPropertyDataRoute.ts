import express from 'express';
import { addPropertyController } from '../../controllers/resources/addPropertyController';

const router = express.Router()

router.post('/addproperty/:id', addPropertyController)

export default router