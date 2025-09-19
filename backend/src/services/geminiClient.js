// backend/src/services/geminiClient.js
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config();

// Initialize Gemini with API Key
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing at runtime.");
  throw new Error("GEMINI_API_KEY is missing. Check your .env file.");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateSingleQuestion({ conceptName, text }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  // If you specifically want 1.1: use "gemini-1.1-flash"

  const prompt = `You are a helpful tutor. Create exactly ONE multiple-choice question (with 4 options A-D) based on the concept name and text. Return JSON with keys: question, options (array), answer (one of A/B/C/D).

Concept: ${conceptName}
Text: ${text}

Make the question challenging but fair, with clear options and one correct answer.`;

  try {
    // Generate response from Gemini
    const result = await model.generateContent(prompt);

    const content =
      result.response.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    // Extract JSON safely
    let cleanContent = content.trim();
    const firstBrace = cleanContent.indexOf("{");
    const lastBrace = cleanContent.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleanContent = cleanContent.slice(firstBrace, lastBrace + 1);
    }

    const json = JSON.parse(cleanContent);

    // Validate response structure
    if (!json.question || !Array.isArray(json.options) || !json.answer) {
      throw new Error("Invalid response format from Gemini");
    }

    if (json.options.length !== 4) {
      throw new Error("Expected exactly 4 options");
    }

    if (!["A", "B", "C", "D"].includes(json.answer)) {
      throw new Error("Answer must be A, B, C, or D");
    }

    return {
      question: json.question,
      options: json.options,
      answer: json.answer,
    };
  } catch (e) {
    console.error("Gemini error:", e.message);

    // Fallback question
    return {
      question: `What is the main concept of "${conceptName}"?`,
      options: [
        "Option A - Please review the concept",
        "Option B - Question generation failed",
        "Option C - Try uploading clearer content",
        "Option D - Contact support if this persists",
      ],
      answer: "A",
    };
  }
}
