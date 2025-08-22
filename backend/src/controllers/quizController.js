import Concept from "../models/Concept.js";

export const generateQuiz = async (req, res) => {
  try {
    const { folderId } = req.params;
    const concepts = await Concept.find({ folder: folderId });

    const quiz = concepts.map(concept => ({
      conceptId: concept._id,
      name: concept.name,
      question: concept.question,
      link: `/concept/${concept._id}`
    }));

    res.json({ quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
