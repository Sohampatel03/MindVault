import Concept from '../models/Concept.js';
import cloudinary from '../config/cloudinary.js';
import { ocrExtractByUrl } from '../services/ocrClient.js';
import { generateSingleQuestion } from '../services/geminiClient.js';
import fs from 'fs';

// Helper: clean up multer temp file
const cleanupTempFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.error('Failed to delete temp file:', err.message);
    });
  }
};

// Create concept
export const createConcept = async (req, res) => {
  const tempFilePath = req.file?.path || null;

  try {
    const { folderId, name, description } = req.body;

    if (!folderId || !name) {
      return res.status(400).json({ message: 'folderId and name are required' });
    }

    let imageUrl = null;
    let extractedText = '';

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
      extractedText = await ocrExtractByUrl(imageUrl);
    }

    const inputText = extractedText || description || name;
    const question = await generateSingleQuestion({ conceptName: name, text: inputText });

    const concept = await Concept.create({
      folderId,
      userId: req.user.id,
      conceptName: name,
      description,
      imageUrl,
      question,
    });

    res.status(201).json(concept);
  } catch (error) {
    console.error('Create concept error:', error.message);
    res.status(500).json({ message: 'Failed to create concept' });
  } finally {
    cleanupTempFile(tempFilePath);
  }
};

// Get concepts inside folder
export const getConcepts = async (req, res) => {
  try {
    const { folderId } = req.params;
    const concepts = await Concept.find({
      folderId,
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(concepts);
  } catch (error) {
    console.error('Get concepts error:', error.message);
    res.status(500).json({ message: 'Failed to fetch concepts' });
  }
};

// Get single concept by ID
export const getConceptById = async (req, res) => {
  try {
    const concept = await Concept.findOne({
      _id: req.params.conceptId,
      userId: req.user.id,
    });

    if (!concept) return res.status(404).json({ message: 'Concept not found' });

    res.json(concept);
  } catch (error) {
    console.error('Get concept error:', error.message);
    res.status(500).json({ message: 'Failed to fetch concept' });
  }
};

// Update concept
export const updateConcept = async (req, res) => {
  const tempFilePath = req.file?.path || null;

  try {
    const { conceptId } = req.params;
    const { name, description } = req.body;
    const updateData = {};

    if (name) updateData.conceptName = name;
    if (description !== undefined) updateData.description = description;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      updateData.imageUrl = result.secure_url;
      const extractedText = await ocrExtractByUrl(updateData.imageUrl);
      const inputText = extractedText || description || name;
      updateData.question = await generateSingleQuestion({
        conceptName: name || 'Concept',
        text: inputText,
      });
    }

    const concept = await Concept.findOneAndUpdate(
      { _id: conceptId, userId: req.user.id },
      updateData,
      { new: true }
    );

    if (!concept) return res.status(404).json({ message: 'Concept not found' });

    res.json(concept);
  } catch (error) {
    console.error('Update concept error:', error.message);
    res.status(500).json({ message: 'Failed to update concept' });
  } finally {
    cleanupTempFile(tempFilePath);
  }
};

// Delete concept
export const deleteConcept = async (req, res) => {
  try {
    const concept = await Concept.findOneAndDelete({
      _id: req.params.conceptId,
      userId: req.user.id,
    });

    if (!concept) return res.status(404).json({ message: 'Concept not found' });

    res.json({ message: 'Concept deleted successfully' });
  } catch (error) {
    console.error('Delete concept error:', error.message);
    res.status(500).json({ message: 'Failed to delete concept' });
  }
};