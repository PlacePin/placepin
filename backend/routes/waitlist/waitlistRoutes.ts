import express from 'express';
import { waitlistController } from '../../controllers/waitlist/waitlistController';

const router = express.Router();

router.post('/join', waitlistController);

export default router;