// backend/src/services/openaiClient.js
import axios from 'axios';

export async function generateSingleQuestion({ conceptName, text }) {
  const prompt = `You are a helpful tutor. Create exactly ONE multiple-choice question (with 4 options A-D) based on the concept name and text. Return JSON with keys: question, options (array), answer (one of A/B/C/D).

Concept: ${conceptName}
Text: ${text}

Make the question challenging but fair, with clear options and one correct answer.`;

  try {
    const res = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert quiz creator. Return only valid JSON with the exact format requested: {"question": "...", "options": ["A option", "B option", "C option", "D option"], "answer": "A"}' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      },
      { 
        headers: { 
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        } 
      }
    );

    const content = res.data.choices?.[0]?.message?.content || '{}';
    
    // Clean and parse JSON from model output
    let cleanContent = content.trim();
    const firstBrace = cleanContent.indexOf('{');
    const lastBrace = cleanContent.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleanContent = cleanContent.slice(firstBrace, lastBrace + 1);
    }
    
    const json = JSON.parse(cleanContent);
    
    // Validate response structure
    if (!json.question || !Array.isArray(json.options) || !json.answer) {
      throw new Error('Invalid response format from OpenAI');
    }

    // Ensure we have exactly 4 options
    if (json.options.length !== 4) {
      throw new Error('Expected exactly 4 options');
    }

    // Validate answer is A, B, C, or D
    if (!['A', 'B', 'C', 'D'].includes(json.answer)) {
      throw new Error('Answer must be A, B, C, or D');
    }

    return {
      question: json.question,
      options: json.options,
      answer: json.answer
    };
    
  } catch (e) {
    console.error('OpenAI error:', e.response?.data || e.message);
    
    // Provide meaningful fallback
    return {
      question: `What is the main concept of "${conceptName}"?`,
      options: [
        'Option A - Please review the concept',
        'Option B - Question generation failed',
        'Option C - Try uploading clearer content',
        'Option D - Contact support if this persists'
      ],
      answer: 'A'
    };
  }
}