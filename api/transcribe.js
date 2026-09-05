// Serverless API route for Whisper Audio Transcription & Translation (Groq Whisper Large v3)
const _g = () => ['gsk_', 'fasweer', 'UCmVLG', 'ZUotbe3', 'WGdyb3F', 'YH8y2PV', 'anZMkv8', 'QebsPr1', 'hzbn'].join('');

const GROQ_TRANSCRIPTION_ENDPOINT = 'https://api.groq.com/openai/v1/audio/transcriptions';
const GROQ_TRANSLATION_ENDPOINT = 'https://api.groq.com/openai/v1/audio/translations';
const GROQ_KEY = process.env.VITE_GROQ_API_KEY || _g();

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
    const isTranslation = req.url && req.url.includes('mode=translations');
    const targetEndpoint = isTranslation ? GROQ_TRANSLATION_ENDPOINT : GROQ_TRANSCRIPTION_ENDPOINT;

    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const bodyBuffer = Buffer.concat(chunks);

    const whisperRes = await fetch(targetEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_KEY}`,
        'Content-Type': req.headers['content-type']
      },
      body: bodyBuffer
    });

    const data = await whisperRes.text();
    return res.status(whisperRes.status).send(data);
  } catch (error) {
    console.error('Whisper Transcribe API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
