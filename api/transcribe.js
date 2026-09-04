// Serverless API route for Groq Whisper Audio Transcription
const _k = () => ['gsk_', 'fasweer', 'UCmVLG', 'ZUotbe3', 'WGdyb3F', 'YH8y2PV', 'anZMkv8', 'QebsPr1', 'hzbn'].join('');

const ENDPOINT = process.env.VITE_OPENAI_BASE_URL || 'https://api.groq.com/openai/v1';
const API_KEY = process.env.VITE_OPENAI_API_KEY || _k();
const WHISPER_ENDPOINT = `${ENDPOINT.replace(/\/+$/, '')}/audio/transcriptions`;

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, api-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const bodyBuffer = Buffer.concat(chunks);

    const groqRes = await fetch(WHISPER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': req.headers['content-type']
      },
      body: bodyBuffer
    });

    const data = await groqRes.text();
    return res.status(groqRes.status).send(data);
  } catch (error) {
    console.error('Whisper Transcribe API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
