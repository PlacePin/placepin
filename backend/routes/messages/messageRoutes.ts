import express from 'express';
import { sendMessage } from '../../controllers/messages/messagesController';
import { getUserConversations } from '../../controllers/messages/conversationsController';

const router = express.Router();

router.post('/send', sendMessage)
router.get('/conversations', getUserConversations)

export default router