
import Loan from "../models/Loan.model.js";
import Document from "../models/Document.model.js";
import User from "../models/User.model.js";
import Sustainability from "../models/Sustainability.js";

/**
 * =====================================================
 * GET PENDING LOANS + DOCUMENTS (ADMIN DASHBOARD)
 * =====================================================
 */
export const getPendingLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ status: "PENDING" })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();

    const result = await Promise.all(
      loans.map(async (loan) => {
        const documents = await Document.find({
          loanId: loan._id,
        }).lean();

        return {
          _id: loan._id,
          user: {
            name: loan.user?.name || "N/A",
            email: loan.user?.email || "N/A",
          },
          loanType: loan.loanType,
          amount: loan.amount,
          riskScore: loan.riskScore,
          status: loan.status,
          createdAt: loan.createdAt,

          documents: documents.map((doc) => ({
            documentId: doc._id,
            name: doc.name,
            fileUrl: doc.fileUrl,
            status: doc.status,
            deletable: doc.deletable,
            uploadedAt: doc.createdAt,
          })),
        };
      })
    );

    res.json(result);
  } catch (error) {
    console.error("Admin Loan Fetch Error:", error);
    res.status(500).json({ message: "Failed to fetch loans" });
  }
};

/**
 * =====================================================
 * GET ALL DOCUMENTS (ADMIN)  ✅ NEW (IMPORTANT)
 * =====================================================
 */
export const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find()
      .populate("userId", "name email")
      .populate("loanId", "loanType amount status")
      .sort({ createdAt: -1 })
      .lean();

    res.json(
      documents.map((doc) => ({
        _id: doc._id,
        name: doc.name,
        fileUrl: doc.fileUrl,
        status: doc.status,
        deletable: doc.deletable,
        uploadedAt: doc.createdAt,
        user: doc.userId,
        loan: doc.loanId,
      }))
    );
  } catch (error) {
    console.error("Admin Document Fetch Error:", error);
    res.status(500).json({ message: "Failed to fetch documents" });
  }
};

/**
 * =====================================================
 * UPDATE LOAN STATUS (APPROVE / REJECT)
 * =====================================================
 */

export const updateLoanStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!req.params.id) {
      return res.status(400).json({ message: "Loan ID required" });
    }

    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    // 🔥 THIS triggers pre("save")
    loan.status = status;
    await loan.save();

    // 🔒 Lock documents after approval
    await Document.updateMany(
      { loanId: loan._id },
      { $set: { deletable: false } }
    );

    res.json({
      message: "Loan approved successfully",
      loanId: loan._id,
    });
  } catch (error) {
    console.error("Loan Status Update Error:", error);
    res.status(500).json({ message: "Failed to update loan" });
  }
};




/**
 * =====================================================
 * VERIFY DOCUMENT (ADMIN)
 * =====================================================
 */

export const verifyDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) return res.status(404).json({ message: "Document not found" });

    // 🔹 SAFETY CHECK FIRST: Make sure userId exists
    if (!doc.userId || doc.userId.toString() === "null") {
      return res.status(400).json({
        message: "Cannot verify document: no associated user.",
      });
    }

    // Skip if already verified
    if (doc.status === "VERIFIED")
      return res.json({ message: "Document already verified" });

    // Mark document as verified
    doc.status = "VERIFIED";
    doc.deletable = false;
    await doc.save();

    // Create or update sustainability safely
    const sustainability = await Sustainability.findOneAndUpdate(
      { userId: doc.userId },
      {
        $setOnInsert: {
          loanId: doc.loanId,
          carbonSavedKg: 2,
          paperSaved: 5,
          greenPoints: 10,
        },
      },
      { upsert: true, new: true }
    );

    // Increment if it already exists
    if (!sustainability.isNew) {
      sustainability.carbonSavedKg += 2;
      sustainability.paperSaved += 5;
      sustainability.greenPoints += 10;
      await sustainability.save();
    }

    return res.json({ message: "Document verified & sustainability updated" });
  } catch (error) {
    console.error("Verify Document Error:", error);
    return res.status(500).json({ message: "Failed to verify document", error: error.message });
  }
};





/**
 * =====================================================
 * USERS
 * =====================================================
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("email role createdAt");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.json({ message: "User role updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update role" });
  }
};

/**
 * =====================================================
 * SUSTAINABILITY STATS
 * =====================================================
 */
export const getSustainabilityStats = async (req, res) => {
  try {
    const verifiedDocs = await Document.countDocuments({
      status: "VERIFIED",
    });

    const paperSaved = verifiedDocs * 5;        // 5 pages per document
    const carbonSavedKg = verifiedDocs * 0.2;   // 0.2 kg CO₂ per document
    const greenPoints = verifiedDocs * 10;      // 10 points per document

    res.json({
      paperSaved,
      carbonSavedKg,
      greenPoints,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to calculate sustainability" });
  }
};
