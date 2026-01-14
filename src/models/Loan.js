

import mongoose from "mongoose";

const emiSchema = new mongoose.Schema({
  dueDate: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["paid", "due", "missed"],
    default: "due",
  },
});

const loanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    principal: Number,
    tenureMonths: Number,

    emis: [emiSchema], // 👈 SOURCE OF EMI DATA

    riskLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },

    isTradable: {
      type: Boolean,
      default: false,
    },

    roi: Number,
    greenScore: Number,

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "ACTIVE", "CLOSED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

const Loan = mongoose.models.Loan || mongoose.model("Loan", loanSchema);
export default Loan;

