import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  listTradableLoans,
  buyLoanPortion,
  getLoanOwnership,
} from "../controllers/trade.controller.js";

const router = express.Router();

router.get("/marketplace", protect, listTradableLoans);
router.post("/buy", protect, buyLoanPortion);
router.get(
  "/ownership/:loanId",
  protect,
  getLoanOwnership
);

export default router;
