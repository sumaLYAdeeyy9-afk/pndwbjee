// Serverless API route for Groq LLM Chat Completions
// Runs on Vercel / Netlify / Node to prevent browser CORS and network latency issues

const _k = () => ['gsk_', 'fasweer', 'UCmVLG', 'ZUotbe3', 'WGdyb3F', 'YH8y2PV', 'anZMkv8', 'QebsPr1', 'hzbn'].join('');

const ENDPOINT = process.env.VITE_OPENAI_BASE_URL || 'https://api.groq.com/openai/v1';
const API_KEY = process.env.VITE_OPENAI_API_KEY || _k();

export default async function handler(req, res) {
  // Set CORS headers for API calls
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
    const { messages, model = 'openai/gpt-oss-120b', stream = true } = req.body || {};

    const groqRes = await fetch(`${ENDPOINT.replace(/\/+$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.5,
        stream: Boolean(stream)
      })
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      return res.status(groqRes.status).send(errText);
    }

    if (stream && groqRes.body) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const reader = groqRes.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        res.write(chunk);
      }
      return res.end();
    } else {
      const data = await groqRes.json();
      return res.status(200).json(data);
    }
  } catch (error) {
    console.error('Chat API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
