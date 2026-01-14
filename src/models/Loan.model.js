
import mongoose from "mongoose";

/* ================= EMI SCHEMA ================= */
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
  paidAt: Date, // ✅ REQUIRED
});

/* ================= ALERT SCHEMA ================= */
const alertSchema = new mongoose.Schema({
  message: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/* ================= LOAN SCHEMA ================= */
const loanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    loanType: {
      type: String,
      enum: ["GREEN", "PERSONAL", "EDUCATION"],
      required: true,
    },

    amount: { type: Number, required: true },
    tenureMonths: { type: Number, required: true },
    interestRate: { type: Number, required: true }, // yearly %

    emiAmount: Number,

    emis: [emiSchema],
    alerts: [alertSchema],

    riskScore: Number,

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "ACTIVE", "REJECTED"], // ✅ FIXED
      default: "PENDING",
    },

    roi: Number,
    greenScore: Number,
    isTradable: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/* ======================================================
   🔹 AUTO-GENERATE EMIs ONLY ON FIRST APPROVAL
====================================================== */

loanSchema.pre("save", async function () {
  if (
    this.isModified("status") &&
    this.status === "APPROVED" &&
    (!this.emis || this.emis.length === 0)
  ) {
    const principal = this.amount;
    const rate = this.interestRate / 12 / 100;
    const n = this.tenureMonths;

    const emiAmount = Math.round(
      (principal * rate * Math.pow(1 + rate, n)) /
      (Math.pow(1 + rate, n) - 1)
    );

    this.emiAmount = emiAmount;

    const emis = [];
    const startDate = new Date();

    for (let i = 0; i < n; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i);
      emis.push({ dueDate, amount: emiAmount, status: "due" });
    }

    this.emis = emis;

    this.alerts = [
      {
        message: `Next EMI of ₹${emiAmount} due on ${emis[0].dueDate.toDateString()}`
      }
    ];
  }
  // no need for next() in async style
});



/* 🔥 Prevent OverwriteModelError */
const Loan =
  mongoose.models.Loan || mongoose.model("Loan", loanSchema);

export default Loan;
