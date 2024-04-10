import express from 'express';
import { getMessages, getMessage } from '../controllers/messageController.js';

const router = express.Router();

router.get('/', getMessages);
router.get('/:id', getMessage);

export { router };