
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getLoanTracking } from "../controllers/loanTracking.controller.js";

const router = express.Router();

/**
 * GET /api/loan/tracking
 */
router.get("/", protect, getLoanTracking);

export default router;
