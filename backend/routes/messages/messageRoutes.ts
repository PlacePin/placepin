import express from 'express';
import { sendMessage } from '../../controllers/messages/messagesController';
import { getConversations, getUsernames } from '../../controllers/messages/conversationsController';

const router = express.Router();

router.post('/send', sendMessage)
router.get('/usernames', getUsernames)
router.get('/conversations', getConversations)

export default router