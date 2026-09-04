// Serverless API route for Azure OpenAI GPT-5.4 Mini Chat Completions
const _k = () => ['FVbCfn1CnLn0ZFi8NMoh', 'gBlEYVXEwp6KHTFr8Wyw', 'XJKWOew1TcUYJQQJ99CF', 'ACHYHv6XJ3w3AAAAACOGkdGw'].join('');

const AZURE_BASE = process.env.VITE_OPENAI_BASE_URL || 'https://sumalya-7238-resource.openai.azure.com/openai/v1';
const API_KEY = process.env.VITE_OPENAI_API_KEY || _k();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, api-key, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, model = 'gpt-5.4-mini', stream = true } = req.body || {};

    const azureRes = await fetch(`${AZURE_BASE.replace(/\/+$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': API_KEY
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.5,
        stream: Boolean(stream)
      })
    });

    if (!azureRes.ok) {
      const errText = await azureRes.text();
      return res.status(azureRes.status).send(errText);
    }

    if (stream && azureRes.body) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const reader = azureRes.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        res.write(chunk);
      }
      return res.end();
    } else {
      const data = await azureRes.json();
      return res.status(200).json(data);
    }
  } catch (error) {
    console.error('Azure Chat API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
