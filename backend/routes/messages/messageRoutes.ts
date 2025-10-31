import express from 'express';
import { sendMessage } from '../../controllers/messages/messagesController';

const router = express.Router();

router.post('/send', sendMessage)

export default router