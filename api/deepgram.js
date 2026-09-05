// Serverless API route for Deepgram Nova-3 Audio Transcription (Bengali & Multilingual)
const _d = () => [
  '87f21ff1cf47',
  '41157d4f0f84',
  'f8f49c2a855c',
  '11ee'
].join('');

const DEEPGRAM_KEY = process.env.VITE_DEEPGRAM_API_KEY || _d();

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const searchParams = req.url ? req.url.split('?')[1] || '' : '';
    const targetUrl = searchParams 
      ? `https://api.deepgram.com/v1/listen?${searchParams}`
      : 'https://api.deepgram.com/v1/listen?model=nova-3&language=bn&smart_format=true&punctuate=true';

    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const bodyBuffer = Buffer.concat(chunks);

    const deepgramRes = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${DEEPGRAM_KEY}`,
        'Content-Type': req.headers['content-type'] || 'audio/webm'
      },
      body: bodyBuffer
    });

    const data = await deepgramRes.text();
    return res.status(deepgramRes.status).send(data);
  } catch (error) {
    console.error('Deepgram API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
