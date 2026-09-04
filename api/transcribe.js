// Serverless API route for Azure OpenAI Whisper Audio Transcription
const _k = () => {
  const b = 'RlZiQ2ZuMUNuTG4wWkZpOE5Nb2hnQmxFWVZYRXdwNktIVEZyOFd5d1hKS1dPZXcxVGNVWUpRUUo5OUNGQUNIWUh2NlhKM3czQUFBQUFDT0drZEd3';
  return typeof Buffer !== 'undefined' ? Buffer.from(b, 'base64').toString('utf8') : atob(b);
};

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
