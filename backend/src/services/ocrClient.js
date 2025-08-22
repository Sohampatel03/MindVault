import axios from 'axios';


const base = process.env.OCR_SERVICE_URL || 'http://localhost:8000';


export async function ocrExtractByUrl(imageUrl) {
// Assumes your Python service supports URL-based OCR; if not, switch to file upload flow
try {
const res = await axios.post(`${base}/extract-by-url`, { image_url: imageUrl });
return res.data?.text || '';
} catch (e) {
console.error('OCR service error:', e.message);
return '';
}
}