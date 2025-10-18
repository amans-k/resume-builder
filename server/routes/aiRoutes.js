import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { enhanceProfessionalSummary, enhanceJobDescription } from "../controllers/aiController.js";

const aiRouter = express.Router();

// ✅ FINAL ROUTES
aiRouter.post("/enhance-pro-sum", protect, enhanceProfessionalSummary);
aiRouter.post("/enhance-job-desc", protect, enhanceJobDescription);

export default aiRouter;