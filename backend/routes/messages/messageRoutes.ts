import express from 'express';
import { sendMessage } from '../../controllers/messages/messagesController';
import { getConversations, getUsernames } from '../../controllers/messages/conversationsController';
import { getSuggestions, markSuggestionRead, submitSuggestion } from '../../controllers/messages/suggestionBoxController';

const router = express.Router();

router.post('/send', sendMessage)
router.get('/usernames', getUsernames)
router.get('/conversations', getConversations)
router.post('/suggestions', submitSuggestion)
router.get('/suggestions', getSuggestions)
router.patch('/suggestions/:id/read', markSuggestionRead)

export default router