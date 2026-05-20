import express from 'express';
import {
  createFolder,
  getFolders,
  getFolderById,
  updateFolder,
  deleteFolder,
} from '../controllers/folderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createFolder);
router.get('/', protect, getFolders);
router.get('/:folderId', protect, getFolderById);
router.patch('/:folderId', protect, updateFolder);
router.delete('/:folderId', protect, deleteFolder);

export default router;