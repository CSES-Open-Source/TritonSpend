import express from 'express';
import { postTransaction } from 'src/controllers/transactionController';

const router = express.Router();
router.post('/transactions', postTransaction);

export default router;