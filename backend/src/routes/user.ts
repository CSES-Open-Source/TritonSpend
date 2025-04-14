import express from "express";
import { updateUserSettings, logout, getUserStatus} from "../controllers/user";

const router = express.Router();

router.put("/settings", updateUserSettings);

router.post("/logout", logout);

router.get("/status", getUserStatus);

export default router;
