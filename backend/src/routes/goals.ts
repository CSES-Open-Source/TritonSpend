import express from "express";
// import { addTransaction, getTransactions } from "../controllers/transactions";
import { addGoal, deleteGoal, editGoal, getGoals } from "src/controllers/goals";
const router = express.Router();

// router.post("/newTransaction", addTransaction);

// router.get("/getTransactions/:user_id", getTransactions);
router.post("/addGoal", addGoal);
router.get("/getGoals/:user_id", getGoals);
router.put("/editGoal", editGoal);
router.delete("/deleteGoal", deleteGoal);
export default router;
