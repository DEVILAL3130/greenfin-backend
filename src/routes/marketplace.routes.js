import express from "express";
import { getMarketplaceLoans } from "../controllers/marketplace.controller.js";

const router = express.Router();

router.get("/loans", getMarketplaceLoans);

export default router;
