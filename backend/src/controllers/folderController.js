import Folder from '../models/Folder.js';

// Create folder
export const createFolder = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ message: 'Folder name is required' });
    }

    const folder = await Folder.create({
      name: name.trim(),
      userId: req.user.id,
    });

    res.status(201).json(folder);
  } catch (error) {
    console.error('Create folder error:', error.message);
    res.status(500).json({ message: 'Failed to create folder' });
  }
};

// Get all folders for user
export const getFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(folders);
  } catch (error) {
    console.error('Get folders error:', error.message);
    res.status(500).json({ message: 'Failed to fetch folders' });
  }
};

// Get single folder
export const getFolderById = async (req, res) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.folderId,
      userId: req.user.id,
    });

    if (!folder) return res.status(404).json({ message: 'Folder not found' });

    res.json(folder);
  } catch (error) {
    console.error('Get folder error:', error.message);
    res.status(500).json({ message: 'Failed to fetch folder' });
  }
};

// Update folder
export const updateFolder = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ message: 'Folder name is required' });
    }

    const folder = await Folder.findOneAndUpdate(
      { _id: req.params.folderId, userId: req.user.id },
      { name: name.trim() },
      { new: true }
    );

    if (!folder) return res.status(404).json({ message: 'Folder not found' });

    res.json(folder);
  } catch (error) {
    console.error('Update folder error:', error.message);
    res.status(500).json({ message: 'Failed to update folder' });
  }
};

// Delete folder
export const deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findOneAndDelete({
      _id: req.params.folderId,
      userId: req.user.id,
    });

    if (!folder) return res.status(404).json({ message: 'Folder not found' });

    res.json({ message: 'Folder deleted successfully' });
  } catch (error) {
    console.error('Delete folder error:', error.message);
    res.status(500).json({ message: 'Failed to delete folder' });
  }
};