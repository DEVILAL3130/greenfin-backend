
import express from "express";
import { payEmi } from "../controllers/emi.controller.js";
import { downloadEmiReceipt } from "../controllers/emiReceipt.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/pay", protect, payEmi);
// 📜 EMI Receipt
router.get(
  "/receipt/:loanId/:emiId",
  protect,
  downloadEmiReceipt
);

export default router;
