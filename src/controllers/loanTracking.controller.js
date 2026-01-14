

import Loan from "../models/Loan.model.js";

export const getLoanTracking = async (req, res) => {
  try {
    // 1️⃣ Find latest active/approved loan
    const loan = await Loan.findOne({
      user: req.user._id,
      status: { $in: ["APPROVED", "ACTIVE"] },
    }).sort({ createdAt: -1 });

    if (!loan) {
      return res.json({
        activeLoan: null,
        emiCalendar: [],
        alerts: [],
        repaymentProgress: 0,
        message: "No active loan",
      });
    }

    const emis = loan.emis || [];

    // 2️⃣ EMI Calendar (WITH emiId 🔥)
    const emiCalendar = emis.map((emi) => ({
  emiId: emi._id,
  loanId: loan._id,       // 🔥 Add this line
  dueDate: emi.dueDate,
  month: emi.dueDate
    ? new Date(emi.dueDate).toLocaleString("default", {
        month: "short",
        year: "numeric",
      })
    : "N/A",
  status: emi.status,
  amount: emi.amount,
}));


    // 3️⃣ Repayment Progress
    const totalEmis = emis.length;
    const paidEmis = emis.filter((emi) => emi.status === "paid").length;

    const repaymentProgress =
      totalEmis === 0 ? 0 : Math.round((paidEmis / totalEmis) * 100);

    // 4️⃣ Alerts (OBJECT FORMAT ✅)
    const alerts = [];

    const nextDueEmi = emis.find((emi) => emi.status === "due");

    if (nextDueEmi) {
      alerts.push({
        message: `Next EMI of ₹${nextDueEmi.amount} due on ${new Date(
          nextDueEmi.dueDate
        ).toDateString()}`,
      });
    } else if (totalEmis > 0 && paidEmis === totalEmis) {
      alerts.push({ message: "🎉 All EMIs paid. Loan completed." });
    }

    // 5️⃣ Final Response
    res.json({
      activeLoan: loan, // 🔥 VERY IMPORTANT
      emiCalendar,
      repaymentProgress,
      alerts,
    });
  } catch (error) {
    console.error("Loan Tracking Error:", error);
    res.status(500).json({
      message: "Failed to load loan tracking",
    });
  }
};
