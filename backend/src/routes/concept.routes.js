// backend/src/routes/concept.routes.js
import express from "express";
import multer from "multer";
import { protect } from "../middleware/auth.js";
import {
  createConcept,
  getConcepts,
  getConceptById,
  updateConcept,
  deleteConcept
} from "../controllers/conceptController.js";

const router = express.Router();

// Disk storage for multer
const upload = multer({ dest: "uploads/" });

// Create concept (expects form-data: folderId, name, description?, image?)
router.post("/", protect, upload.single("image"), createConcept);

// Get all concepts in a folder
router.get("/folder/:folderId", protect, getConcepts);

// Get one concept by ID
router.get("/:conceptId", protect, getConceptById);

// Update concept (can change name/description and re-upload image)
router.patch("/:conceptId", protect, upload.single("image"), updateConcept);

// Delete concept
router.delete("/:conceptId", protect, deleteConcept);

export default router;