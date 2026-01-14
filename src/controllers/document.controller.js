
import Document from "../models/Document.model.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

/**
 * =====================================================
 * UPLOAD DOCUMENT
 * POST /api/documents/upload
 * Private
 * =====================================================
 */
export const uploadDocument = async (req, res) => {
  try {
    const { loanId } = req.body;

    // 🔴 REQUIRED CHECKS
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!loanId) {
      return res.status(400).json({ message: "Loan ID is required" });
    }

    // ☁️ Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "documents",
          resource_type: "raw", // ✅ PDFs
          access_mode: "public",
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });

    // 💾 Save to DB
    const document = await Document.create({
      userId: req.user._id,   // ✅ SINGLE USER FIELD
      loanId,                 // ✅ LINK TO LOAN
      name: req.file.originalname,
      fileUrl: uploadResult.secure_url,
      status: "UPLOADED",
      deletable: true,
    });

    res.status(201).json({
      success: true,
      document: {
        id: document._id,
        name: document.name,
        url: document.fileUrl,
        status: document.status,
        deletable: document.deletable,
        loanId: document.loanId,
      },
    });
  } catch (error) {
    console.error("Document Upload Error:", error);
    res.status(500).json({ message: "Document upload failed" });
  }
};

/**
 * =====================================================
 * GET USER DOCUMENTS
 * GET /api/documents
 * Private
 * =====================================================
 */
export const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      documents: documents.map((doc) => ({
        id: doc._id,
        name: doc.name,
        url: doc.fileUrl,
        status: doc.status,
        deletable: doc.deletable,
        loanId: doc.loanId,
      })),
    });
  } catch (error) {
    console.error("Get Documents Error:", error);
    res.status(500).json({ message: "Failed to fetch documents" });
  }
};

/**
 * =====================================================
 * DELETE DOCUMENT
 * DELETE /api/documents/:id
 * Private
 * =====================================================
 */
export const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    // 🔐 Only owner
    if (doc.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (!doc.deletable) {
      return res.status(403).json({ message: "Delete not allowed" });
    }

    await doc.deleteOne();

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Delete Document Error:", error);
    res.status(500).json({ message: "Failed to delete document" });
  }
};
