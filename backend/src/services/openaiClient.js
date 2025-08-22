import axios from 'axios';


export async function generateSingleQuestion({ conceptName, text }) {
const prompt = `You are a helpful tutor. Create exactly ONE multiple-choice question (with 4 options A-D) based on the concept name and text. Return JSON with keys: question, options (array), answer (one of A/B/C/D).\nConcept: ${conceptName}\nText: ${text}`;


try {
// Example using OpenAI Responses API via proxy; replace with your SDK if preferred
const res = await axios.post(
'https://api.openai.com/v1/chat/completions',
{
model: 'gpt-4o-mini',
messages: [
{ role: 'system', content: 'You output JSON only.' },
{ role: 'user', content: prompt }
],
temperature: 0.7
},
{ headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
);


const content = res.data.choices?.[0]?.message?.content || '{}';
// Attempt to parse JSON from model output
const firstBrace = content.indexOf('{');
const lastBrace = content.lastIndexOf('}');
const json = JSON.parse(content.slice(firstBrace, lastBrace + 1));
// Ensure shape
return {
question: json.question || 'Question unavailable',
options: json.options || ["A","B","C","D"],
answer: json.answer || 'A'
};
} catch (e) {
console.error('OpenAI error:', e.response?.data || e.message);
return { question: 'Fallback: No question', options: ['A','B','C','D'], answer: 'A' };
}
}