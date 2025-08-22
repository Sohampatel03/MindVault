import express from "express";
import multer from "multer";
import { protect } from "../middleware/auth.js";
import {
  // apne controller me jo names hain unke hisaab se import kar lo
  createConcept,
  getConcepts,        // GET list by folder
//   getConceptById,     // optional
//   updateConcept,      // optional
//   deleteConcept       // optional
} from "../controllers/conceptController.js";

const router = express.Router();

// Disk storage use — controller me likely req.file.path use ho raha hoga (Cloudinary uploadToCloudinary(path))
const upload = multer({ dest: "uploads/" });

// Create concept (expects form-data: folderId, name, description?, image?)
router.post("/", protect, upload.single("image"), createConcept);

// Get all concepts in a folder
router.get("/folder/:folderId", protect, getConcepts);

// (Optional) get one concept
// router.get("/:conceptId", protect, getConceptById);

// (Optional) update a concept (can allow changing name/description and re-upload image)
// router.patch("/:conceptId", protect, upload.single("image"), updateConcept);

// (Optional) delete concept
// router.delete("/:conceptId", protect, deleteConcept);

export default router;
