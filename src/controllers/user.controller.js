
import Document from "../models/Document.model.js";

// Get documents uploaded by current user
export const getUserDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    
    res.json(documents);
  } catch (error) {
    console.error("Get User Documents Error:", error);
    res.status(500).json({ message: "Failed to fetch documents" });
  }
};

// Delete document (only if deletable)
export const deleteUserDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    if (!doc.deletable) {
      return res.status(403).json({ message: "Verified documents cannot be deleted" });
    }

    await doc.deleteOne();
    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Delete Document Error:", error);
    res.status(500).json({ message: "Failed to delete document" });
  }
};
