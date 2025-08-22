import express from "express";
import { createFolder, getFolders } from "../controllers/folderController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Protected routes
router.post("/",protect, createFolder);
router.get("/", protect,getFolders);

export default router;
