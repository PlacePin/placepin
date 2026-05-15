import express from 'express';
import { updateAddress } from '../../controllers/resources/updateAddressController';

const router = express.Router();

router.post('/address', updateAddress);

export default router