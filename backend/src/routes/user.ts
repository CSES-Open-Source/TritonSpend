import express from "express";
import { updateUserSettings, logout } from "../controllers/user";

const router = express.Router();

router.put("/settings", updateUserSettings);

router.post("/logout", logout);

export default router;
