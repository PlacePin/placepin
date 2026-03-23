import express from 'express';
import { loginController } from '../../controllers/auth/loginController';
import { signupController } from '../../controllers/auth/signupController';
import { forgotPasswordController } from '../../controllers/auth/forgotPasswordController';
import { resetPasswordController } from '../../controllers/auth/resetPasswordController';

const router = express.Router();

router.post('/login', loginController);
router.post('/signup', signupController);
router.post('/forgot-password', forgotPasswordController);
router.post('/reset-password/:token', resetPasswordController);

export default router