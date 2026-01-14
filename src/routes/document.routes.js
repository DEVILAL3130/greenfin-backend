
import express from "express";
import multer from "multer";
import { protect } from "../middlewares/authMiddleware.js";
import {
  uploadDocument,
  getDocuments,
  deleteDocument,
} from "../controllers/document.controller.js";

const router = express.Router();

/**
 * Multer config
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

/**
 * Routes
 */
router.post(
  "/upload",
  protect,
  upload.single("file"), // ✅ FIXED (matches frontend)
  uploadDocument
);

router.get("/", protect, getDocuments);
router.delete("/:id", protect, deleteDocument);

export default router;
