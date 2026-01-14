
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getUserDocuments, deleteUserDocument } from "../controllers/user.controller.js";

const router = express.Router();

// 🔐 Protected routes
router.use(protect);

// Get current user's profile
router.get("/profile", (req, res) => {
  res.json(req.user);
});

// Get current user's documents
router.get("/documents", getUserDocuments);

// Delete a document (only if deletable)
router.delete("/documents/:id", deleteUserDocument);

export default router;
