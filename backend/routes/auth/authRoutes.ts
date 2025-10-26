import express from 'express';
import { loginController } from '../../controllers/auth/loginController';
import { signupController } from '../../controllers/auth/signupController';

const router = express.Router();

router.post('/login', loginController);
router.post('/signup', signupController);

export default router