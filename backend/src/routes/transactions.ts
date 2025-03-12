import express from "express";
import { addTransaction, getTransactions } from "../controllers/transactions";

const router = express.Router();

router.post("/newTransaction", addTransaction);

router.get("/getTransactions/:user_id", getTransactions);

export default router;
