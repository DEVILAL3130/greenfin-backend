import mongoose from "mongoose";

const loanOwnershipSchema = new mongoose.Schema(
  {
    loan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loan",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    percentage: {
      type: Number, // % ownership
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "LoanOwnership",
  loanOwnershipSchema
);
