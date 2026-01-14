import mongoose from "mongoose";

const sustainabilitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
      unique: true, // ONE sustainability record per user
    },
    loanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loan",
    },
    carbonSavedKg: { type: Number, default: 0 },
    paperSaved: { type: Number, default: 0 },
    greenPoints: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Sustainability", sustainabilitySchema);
