import express from 'express';
import { analyzeCode } from '../controllers/debugController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/analyze', authMiddleware, analyzeCode);

export default router;
