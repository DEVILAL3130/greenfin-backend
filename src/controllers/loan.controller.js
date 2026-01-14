
import Loan from "../models/Loan.model.js";
import { calculateEMI } from "../utils/emiCalculator.js";
import { calculateRiskScore } from "../utils/riskEngine.js";

/**
 * @route POST /api/loans/apply
 * @access Private
 */
export const applyLoan = async (req, res) => {
  try {
    const { loanType, amount, tenureMonths } = req.body;
    const userId = req.user._id;

    // 🔹 Interest rate logic
    const interestRates = {
      PERSONAL: 12,
      EDUCATION: 8,
      GREEN: 6,
    };

    const interestRate = interestRates[loanType];
    const emiAmount = calculateEMI(amount, tenureMonths, interestRate);
    const riskScore = calculateRiskScore({
      amount,
      tenureMonths,
      loanType,
    });

    const loan = await Loan.create({
      user: userId,
      loanType,
      amount,
      tenureMonths,
      interestRate,
      emiAmount,
      riskScore,
      status: "PENDING",
    });

    // ✅ IMPORTANT FIX HERE
    res.status(201).json({
      loan, // 👈 FRONTEND NEEDS THIS
    });
  } catch (error) {
    console.error("Loan Apply Error:", error);
    res.status(500).json({ message: "Loan application failed" });
  }
};

// Fetch all active loans for the logged-in user
export const getActiveLoans = async (req, res) => {
  try {
    const loans = await Loan.find({
      user: req.user._id,
      status: { $in: ["APPROVED", "ACTIVE"] },
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ loans }); // return an array of active loans
  } catch (error) {
    console.error("Get Active Loans Error:", error);
    res.status(500).json({ message: "Failed to fetch active loans" });
  }
};