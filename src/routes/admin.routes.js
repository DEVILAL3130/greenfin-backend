
import express from "express";
import { protect, admin } from "../middlewares/authMiddleware.js";
import {
  getPendingLoans,
  updateLoanStatus,
  verifyDocument,
  getAllUsers,
  updateUserRole,
  getSustainabilityStats,
  getAllDocuments, // ✅ DOCUMENT LIST FOR ADMIN
} from "../controllers/admin.controller.js";

const router = express.Router();

// 🔐 Protect all admin routes
router.use(protect);
router.use(admin);

/* ====================== LOANS ====================== */
router.get("/loans", getPendingLoans);
router.post("/loans/:id", updateLoanStatus);

/* ==================== DOCUMENTS ==================== */
router.get("/documents", getAllDocuments);     // ✅ FETCH ALL DOCUMENTS
router.post("/documents/:id", verifyDocument); // ✅ VERIFY / REJECT

/* ====================== USERS ====================== */
router.get("/users", getAllUsers);
router.post("/users/:id/role", updateUserRole);

/* ================= SUSTAINABILITY ================= */
router.get("/sustainability", getSustainabilityStats);

export default router;
