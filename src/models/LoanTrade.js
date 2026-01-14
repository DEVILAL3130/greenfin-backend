import mongoose from "mongoose";

const loanTradeSchema = new mongoose.Schema(
  {
    loan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loan",
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    percentage: Number,
    price: Number,
  },
  { timestamps: true }
);

export default mongoose.model("LoanTrade", loanTradeSchema);
