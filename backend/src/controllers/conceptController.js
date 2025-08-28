import Concept from "../models/Concept.js";
import  cloudinary  from "../config/cloudinary.js";
import { ocrExtractByUrl } from "../services/ocrClient.js";
import { generateSingleQuestion } from "../services/openaiClient.js";

// Create concept
export const createConcept = async (req, res) => {
  try {
    const { folderId, name, description } = req.body;
    let imageUrl = null, extractedText = "";

    if (req.file) {
      // const result = await cloudinary(req.file.path);
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
      extractedText = await  ocrExtractByUrl(imageUrl);
    }

    const inputText = extractedText || description || "";
    const question = await generateSingleQuestion(name, inputText);

    const concept = await Concept.create({
      folder: folderId,
      name,
      description,
      imageUrl,
      question,
      user: req.user.id
    });

    res.status(201).json(concept);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get concepts inside folder
export const getConcepts = async (req, res) => {
  try {
    const concepts = await Concept.find({ folder: req.params.folderId });
    res.json(concepts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
