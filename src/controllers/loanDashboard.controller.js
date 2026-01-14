import Loan from "../models/Loan.model.js";

export const getActiveLoansForDashboard = async (req, res) => {
  try {
    const loans = await Loan.find({
      user: req.user._id,
      status: { $in: ["APPROVED", "ACTIVE"] },
    }).sort({ createdAt: -1 });

    if (!loans.length) {
      return res.json({
        loans: [],
      });
    }

    const formattedLoans = loans.map((loan) => {
      const nextEmi = loan.emis?.find((e) => e.status === "due");

      return {
        _id: loan._id,
        loanType: loan.loanType,
        status: loan.status,
        nextEmi: nextEmi
          ? {
              amount: nextEmi.amount,
              dueDate: nextEmi.dueDate,
              emiId: nextEmi._id,
            }
          : null,
        greenImpact: loan.greenImpact || null,
      };
    });

    res.json({
      loans: formattedLoans,
    });
  } catch (error) {
    console.error("Dashboard Loan Error:", error);
    res.status(500).json({
      message: "Failed to load dashboard loans",
    });
  }
};
