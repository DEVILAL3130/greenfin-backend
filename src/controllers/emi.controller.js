import Loan from "../models/Loan.model.js";

export const payEmi = async (req, res) => {
  try {
  console.log("PAY EMI BODY:", req.body);

    const { loanId, emiId } = req.body || {};
    if (!loanId || !emiId) {
      return res.status(400).json({ message: "loanId and emiId are required" });
    }

    const loan = await Loan.findOne({
      _id: loanId,
      user: req.user._id,
      status: { $in: ["APPROVED", "ACTIVE"] },
    });

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    const emi = loan.emis.id(emiId);
    if (!emi) {
      return res.status(404).json({ message: "EMI not found" });
    }

    if (emi.status === "paid") {
      return res.status(400).json({ message: "EMI already paid" });
    }

    // Mark EMI paid
    emi.status = "paid";
    emi.paidAt = new Date();

    // Activate loan if first payment
    if (loan.status === "APPROVED") loan.status = "ACTIVE";

    // Remove old alerts
    loan.alerts = loan.alerts.filter((a) => !a.message.includes("Next EMI"));

    // Add next EMI alert
    const nextEmi = loan.emis.find((e) => e.status === "due");
    if (nextEmi) {
      loan.alerts.push({
        message: `Next EMI of ₹${nextEmi.amount} due on ${nextEmi.dueDate.toDateString()}`,
      });
    } else {
      loan.alerts.push({ message: "🎉 Loan fully paid" });
    }

    await loan.save();

    res.json({
      message: "EMI paid successfully",
      loan,
    });
  } catch (error) {
    console.error("Pay EMI Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
