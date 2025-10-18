import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { 
  createResume, 
  deleteResume, 
  getPublicResumeById, 
  getResumeById, 
  updateResume,
  getUserResumes  // ✅ ADD THIS IMPORT
} from "../controllers/resumeController.js";

const resumerouter = express.Router();

// ✅ ADD THIS ROUTE - Get all resumes for a user
resumerouter.get("/user-resumes", protect, getUserResumes);

// Corrected routes - using 'resumerouter' consistently
resumerouter.post("/create", protect, createResume);

// FIXED: Remove upload.single("Image") since we're sending JSON data
resumerouter.post("/update", protect, updateResume);

resumerouter.post("/delete/:resumeId", protect, deleteResume);
resumerouter.get("/get/:resumeId", protect, getResumeById);
resumerouter.get("/public/:resumeId", getPublicResumeById);

export default resumerouter;