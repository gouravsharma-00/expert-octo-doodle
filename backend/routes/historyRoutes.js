import express from 'express';
import { getHistory, deleteHistory } from '../controllers/historyController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getHistory);
router.delete('/:id', authMiddleware, deleteHistory);

export default router;
