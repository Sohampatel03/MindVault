import Folder from "../models/Folder.js";

// Create folder
export const createFolder = async (req, res) => {
  try {
    const folder = await Folder.create({ name: req.body.name, userId: req.user.id });
    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all folders for user
export const getFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.user.id });
    res.json(folders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
