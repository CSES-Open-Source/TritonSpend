import express from "express";
import { updateSettings, getUser, getCategoryForUser } from "../controllers/user";

const router = express.Router();

router.put("/updateSettings", updateSettings);

router.get("/:user_id", getUser);

router.get("/category/:user_id", getCategoryForUser);
export default router;