import express from "express";
import {
  addTransaction,
  getTransactions,
  deleteTransaction,
  getSpendingTrend,
} from "../controllers/transactions";

const router = express.Router();

router.post("/newTransaction", addTransaction);

router.get("/getTransactions/:user_id", getTransactions);

// DELETE /transactions/:user_id/:transaction_id
router.delete("/:user_id/:transaction_id", deleteTransaction);

router.get("/spendingTrend/:user_id", getSpendingTrend);

export default router;
