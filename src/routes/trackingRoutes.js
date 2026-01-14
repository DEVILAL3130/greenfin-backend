import express from "express";
import Loan from "../models/Loan.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/tracking", auth, async (req, res) => {
  const loans = await Loan.find({ user: req.user.id });

  res.json({
    loans,
    alerts: loans
      .filter((l) => l.riskLevel !== "low")
      .map((l) => ({
        risk: l.riskLevel,
        message: "Attention required",
      })),
  });
});

export default router;
