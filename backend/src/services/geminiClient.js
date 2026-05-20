import dotenv from 'dotenv';
dotenv.config();

let ai = null;

const GEMINI_MODEL = 'gemini-3.5-flash';

if (process.env.GEMINI_API_KEY) {
  try {
    const { GoogleGenAI } = await import('@google/genai');
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    console.log(`✅ Gemini AI initialized (${GEMINI_MODEL})`);
  } catch (err) {
    console.warn('⚠️  Failed to initialize Gemini AI:', err.message);
  }
} else {
  console.warn('⚠️  GEMINI_API_KEY not set — fallback questions will be used.');
}

const getFallback = (conceptName) => ({
  question: `Which of the following best describes "${conceptName}"?`,
  options: [
    'A foundational principle that forms the basis of the topic',
    'An unrelated concept from a different domain',
    'A minor detail with little practical significance',
    'A historical event with no modern relevance',
  ],
  answer: 'A',
});

/**
 * Sleep helper for retry delay
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generate a single MCQ using Gemini AI
 * Retries once on 429 after waiting the suggested retry delay
 */
export async function generateSingleQuestion({ conceptName, text }, retryCount = 0) {
  if (!ai) return getFallback(conceptName);

  const prompt = `You are an expert quiz creator. Based on the concept name and text below, create exactly ONE multiple-choice question.

Rules:
- Return ONLY a valid JSON object
- No markdown, no code blocks, no explanation — raw JSON only
- JSON must have exactly: "question" (string), "options" (array of exactly 4 strings), "answer" (one of: "A", "B", "C", "D")
- Options should NOT include the letter prefix
- Make one option clearly correct and three plausible but wrong

Concept: ${conceptName}
Text: ${text || conceptName}`;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    const raw = response.text || '';

    // Strip markdown code blocks if Gemini wraps response
    const cleaned = raw
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error('No JSON object found in response');
    }

    const json = JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));

    if (
      typeof json.question !== 'string' ||
      !Array.isArray(json.options) ||
      json.options.length !== 4 ||
      !['A', 'B', 'C', 'D'].includes(json.answer)
    ) {
      throw new Error('Invalid response structure from Gemini');
    }

    console.log(`✅ Question generated for: "${conceptName}"`);

    return {
      question: json.question,
      options: json.options,
      answer: json.answer,
    };

  } catch (err) {
    const message = err.message || '';

    // Handle rate limit — retry once after suggested delay
    if (message.includes('429') || message.includes('Too Many Requests')) {
      if (retryCount < 1) {
        // Extract retry delay from error message (e.g. "retry in 24s")
        const match = message.match(/retry[^\d]*(\d+)/i);
        const delaySeconds = match ? parseInt(match[1]) + 2 : 30;

        console.warn(`⚠️  Gemini rate limited. Retrying in ${delaySeconds}s...`);
        await sleep(delaySeconds * 1000);

        return generateSingleQuestion({ conceptName, text }, retryCount + 1);
      }

      console.warn('⚠️  Gemini quota exhausted — using fallback question.');
      return getFallback(conceptName);
    }

    console.error('❌ Gemini generation failed:', message);
    return getFallback(conceptName);
  }
}