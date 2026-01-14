import Loan from "../models/Loan.js";
import LoanOwnership from "../models/LoanOwnership.js";
import LoanTrade from "../models/LoanTrade.js";

/**
 * GET tradable loans
 */
export const listTradableLoans = async (req, res) => {
  const loans = await Loan.find({ isTradable: true })
    .select("roi greenScore riskLevel")
    .lean();

  res.json(loans);
};

/**
 * BUY loan portion
 */
export const buyLoanPortion = async (req, res) => {
  const { loanId, percentage, price } = req.body;

  const loan = await Loan.findById(loanId);
  if (!loan || !loan.isTradable)
    return res.status(400).json({ message: "Loan not tradable" });

  // Seller = platform / primary lender (simplified)
  const sellerOwnership = await LoanOwnership.findOne({
    loan: loanId,
    owner: loan.user,
  });

  if (!sellerOwnership || sellerOwnership.percentage < percentage) {
    return res.status(400).json({ message: "Insufficient ownership" });
  }

  // Update ownership
  sellerOwnership.percentage -= percentage;
  await sellerOwnership.save();

  await LoanOwnership.create({
    loan: loanId,
    owner: req.user.id,
    percentage,
  });

  // Record trade
  await LoanTrade.create({
    loan: loanId,
    seller: loan.user,
    buyer: req.user.id,
    percentage,
    price,
  });

  res.json({ message: "Loan portion purchased successfully" });
};

/**
 * GET ownership breakdown
 */
export const getLoanOwnership = async (req, res) => {
  const ownership = await LoanOwnership.find({
    loan: req.params.loanId,
  })
    .populate("owner", "email")
    .lean();

  res.json(ownership);
};
