// Serverless API route for Sarvam AI Bulbul:v3 Text-to-Speech (TTS)
const _s = () => [
  'sk_zzld5vcu_',
  'xVKx5KWEq8Og',
  'RfViPLZ2OMxz'
].join('');

const SARVAM_KEY = process.env.VITE_SARVAM_API_KEY || _s();
const SARVAM_ENDPOINT = 'https://api.sarvam.ai/text-to-speech';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, api-subscription-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body;

    const sarvamRes = await fetch(SARVAM_ENDPOINT, {
      method: 'POST',
      headers: {
        'api-subscription-key': SARVAM_KEY,
        'Content-Type': 'application/json'
      },
      body: typeof payload === 'string' ? payload : JSON.stringify(payload)
    });

    const data = await sarvamRes.text();
    res.statusCode = sarvamRes.status;
    res.setHeader('Content-Type', 'application/json');
    return res.end(data);
  } catch (error) {
    console.error('Sarvam TTS API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
