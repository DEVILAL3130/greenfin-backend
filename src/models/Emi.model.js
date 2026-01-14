import mongoose from "mongoose";

const emiSchema = new mongoose.Schema(
  {
    loanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loan",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    month: String,
    amount: Number,
    status: {
      type: String,
      enum: ["PAID", "DUE", "UPCOMING"],
      default: "UPCOMING",
    },
    dueDate: Date,
    paidAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("EMI", emiSchema);
