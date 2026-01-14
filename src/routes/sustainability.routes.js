import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getSustainabilityReport,
} from "../controllers/sustainability.controller.js";

const router = express.Router();

router.get("/report", protect, getSustainabilityReport);

export default router;
