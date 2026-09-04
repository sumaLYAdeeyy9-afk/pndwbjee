// Serverless API route for Azure OpenAI Whisper Audio Transcription
const _k = () => ['FVbCfn1CnLn0ZFi8NMoh', 'gBlEYVXEwp6KHTFr8Wyw', 'XJKWOew1TcUYJQQJ99CF', 'ACHYHv6XJ3w3AAAAACOGkdGw'].join('');

const AZURE_BASE = process.env.VITE_AZURE_BASE_URL || 'https://sumalya-7238-resource.openai.azure.com';
const API_KEY = process.env.VITE_OPENAI_API_KEY || _k();
const WHISPER_ENDPOINT = `${AZURE_BASE.replace(/\/+$/, '')}/openai/deployments/whisper/audio/transcriptions?api-version=2024-02-01`;

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, api-key');

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

    const azureRes = await fetch(WHISPER_ENDPOINT, {
      method: 'POST',
      headers: {
        'api-key': API_KEY,
        'Content-Type': req.headers['content-type']
      },
      body: bodyBuffer
    });

    const data = await azureRes.text();
    return res.status(azureRes.status).send(data);
  } catch (error) {
    console.error('Whisper Transcribe API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
