// backend/src/controllers/conceptController.js
import Concept from "../models/Concept.js";
import cloudinary from "../config/cloudinary.js";
import { ocrExtractByUrl } from "../services/ocrClient.js";
import { generateSingleQuestion } from "../services/openaiClient.js";

// Create concept
export const createConcept = async (req, res) => {
  try {
    const { folderId, name, description } = req.body;
    let imageUrl = null, extractedText = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
      extractedText = await ocrExtractByUrl(imageUrl);
    }

    const inputText = extractedText || description || "";
    const question = await generateSingleQuestion({ 
      conceptName: name, 
      text: inputText 
    });

    const concept = await Concept.create({
      folderId: folderId,          // Fixed: aligned with model
      userId: req.user.id,         // Fixed: aligned with model
      conceptName: name,           // Fixed: aligned with model
      description,
      imageUrl,
      question
    });

    res.status(201).json(concept);
  } catch (error) {
    console.error('Create concept error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get concepts inside folder
export const getConcepts = async (req, res) => {
  try {
    const { folderId } = req.params;
    
    // Validate user owns the folder or concepts
    const concepts = await Concept.find({ 
      folderId: folderId,
      userId: req.user.id  // Ensure user can only see their concepts
    }).sort({ createdAt: -1 });
    
    res.json(concepts);
  } catch (error) {
    console.error('Get concepts error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get single concept by ID
export const getConceptById = async (req, res) => {
  try {
    const { conceptId } = req.params;
    
    const concept = await Concept.findOne({
      _id: conceptId,
      userId: req.user.id  // Ensure user owns this concept
    });
    
    if (!concept) {
      return res.status(404).json({ message: 'Concept not found' });
    }
    
    res.json(concept);
  } catch (error) {
    console.error('Get concept error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update concept
export const updateConcept = async (req, res) => {
  try {
    const { conceptId } = req.params;
    const { name, description } = req.body;
    let updateData = {};

    if (name) updateData.conceptName = name;
    if (description) updateData.description = description;

    // Handle new image upload
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      updateData.imageUrl = result.secure_url;
      
      // Re-generate question with new content
      const extractedText = await ocrExtractByUrl(result.secure_url);
      const inputText = extractedText || description || "";
      updateData.question = await generateSingleQuestion({ 
        conceptName: name, 
        text: inputText 
      });
    }

    const concept = await Concept.findOneAndUpdate(
      { _id: conceptId, userId: req.user.id },
      updateData,
      { new: true }
    );

    if (!concept) {
      return res.status(404).json({ message: 'Concept not found' });
    }

    res.json(concept);
  } catch (error) {
    console.error('Update concept error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete concept
export const deleteConcept = async (req, res) => {
  try {
    const { conceptId } = req.params;
    
    const concept = await Concept.findOneAndDelete({
      _id: conceptId,
      userId: req.user.id
    });

    if (!concept) {
      return res.status(404).json({ message: 'Concept not found' });
    }

    res.json({ message: 'Concept deleted successfully' });
  } catch (error) {
    console.error('Delete concept error:', error);
    res.status(500).json({ message: error.message });
  }
};