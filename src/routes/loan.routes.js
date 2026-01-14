
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";

import { applyLoan } from "../controllers/loan.controller.js";
import { getLoanTracking } from "../controllers/loanTracking.controller.js";
import { getActiveLoansForDashboard } from "../controllers/loanDashboard.controller.js";

const router = express.Router();

router.post("/apply", protect, applyLoan);

// Dashboard
router.get("/active", protect, getActiveLoansForDashboard);

// Loan Tracking page
router.get("/tracking", protect, getLoanTracking);

export default router;
