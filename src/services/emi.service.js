
import Loan from "../models/Loan.model.js";

export const checkEmiStatus = async () => {
  try {
    const loans = await Loan.find({ status: "ACTIVE" });

    for (const loan of loans) {
      loan.alerts = loan.alerts || [];
      loan.alerts.push("EMI due in 3 days");
      await loan.save();
    }
  } catch (error) {
    console.error("EMI Cron Error:", error.message);
  }
};
