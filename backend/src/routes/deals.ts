import express from "express";
import { getDeals } from "../controllers/deals";

const router = express.Router();

router.get("/", getDeals);

export default router;
