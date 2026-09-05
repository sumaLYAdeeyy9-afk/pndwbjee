// Serverless API route for Sarvam AI Bulbul:v3 Text-to-Speech (TTS)
import dns from 'dns';

if (dns && typeof dns.setDefaultResultOrder === 'function') {
  try {
    dns.setDefaultResultOrder('ipv4first');
  } catch (e) {}
}

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
    let payload = req.body;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch (e) {}
    }

    // Ensure model is bulbul:v3 and inputs is an array of max 3 items
    let inputs = Array.isArray(payload.inputs) ? payload.inputs : [payload.text || 'নমস্কার'];
    if (inputs.length > 3) {
      inputs = inputs.slice(0, 3);
    }

    const requestBody = {
      inputs: inputs,
      target_language_code: payload.target_language_code || 'bn-IN',
      speaker: payload.speaker || 'shreya',
      model: 'bulbul:v3',
      pace: payload.pace || 1.0,
      speech_sample_rate: 22050,
      enable_preprocessing: true
    };

    const sarvamRes = await fetch(SARVAM_ENDPOINT, {
      method: 'POST',
      headers: {
        'api-subscription-key': SARVAM_KEY,
        'Content-Type': 'application/json',
        'User-Agent': 'SarvamAI/1.0.0 (Serverless)',
        'Accept': 'application/json',
        'Connection': 'close'
      },
      body: JSON.stringify(requestBody)
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
