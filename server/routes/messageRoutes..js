import express from 'express';
import { getMessages, getMessage, updateMessage } from '../controllers/messageController.js';

const router = express.Router();

router.get('/', getMessages);
router.get('/:id', getMessage);
router.patch('/:id', updateMessage);

export { router };