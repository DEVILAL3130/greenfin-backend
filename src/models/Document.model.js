
import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    // 🔗 Owner (who uploaded)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🔗 Linked Loan (CRITICAL FOR ADMIN)
    loanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loan",
      required: true,
      index: true,
    },

    // 📄 Document info
    name: {
      type: String,
      required: true,
      trim: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    // 📌 Verification status
    status: {
      type: String,
      enum: ["UPLOADED", "VERIFIED", "REJECTED"],
      default: "UPLOADED",
    },

    // 🗑️ Delete control
    deletable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Document", documentSchema);
