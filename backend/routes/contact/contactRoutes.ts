import express from 'express';
import { sendContactMessage } from '../../controllers/contact/contactController';

const router = express.Router();

router.post('/', sendContactMessage);

export default router;
