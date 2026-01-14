import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getDashboardSummary } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/", protect, getDashboardSummary);

export default router;
