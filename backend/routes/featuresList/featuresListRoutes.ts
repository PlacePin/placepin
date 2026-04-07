import express from 'express';
import { addEmailForFeatureUpdates } from '../../controllers/featuresList/featuresListController';

const router = express.Router();

router.post('/emails', addEmailForFeatureUpdates);

export default router;