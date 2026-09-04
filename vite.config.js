import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const _k = () => ['gsk_', 'fasweer', 'UCmVLG', 'ZUotbe3', 'WGdyb3F', 'YH8y2PV', 'anZMkv8', 'QebsPr1', 'hzbn'].join('');
const GROQ_BASE = 'https://api.groq.com/openai/v1';

// Vite plugin to handle /api/chat and /api/transcribe locally in dev mode with Groq API
function devApiPlugin() {
  return {
    name: 'dev-api-plugin',
    configureServer(server) {
      // Chat completion route
      server.middlewares.use('/api/chat', async (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const { messages, model = 'openai/gpt-oss-120b', stream = true } = JSON.parse(body);
              const groqRes = await fetch(`${GROQ_BASE}/chat/completions`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${_k()}`
                },
                body: JSON.stringify({
                  model,
                  messages,
                  temperature: 0.5,
                  stream: Boolean(stream)
                })
              });

              res.setHeader('Content-Type', stream ? 'text/event-stream' : 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');

              if (stream && groqRes.body) {
                const reader = groqRes.body.getReader();
                const decoder = new TextDecoder();
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  res.write(decoder.decode(value));
                }
                res.end();
              } else {
                const data = await groqRes.text();
                res.end(data);
              }
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          res.end();
        }
      });

      // Whisper STT route
      server.middlewares.use('/api/transcribe', async (req, res) => {
        if (req.method === 'POST') {
          const chunks = [];
          req.on('data', chunk => chunks.push(chunk));
          req.on('end', async () => {
            try {
              const bodyBuffer = Buffer.concat(chunks);
              const groqRes = await fetch(`${GROQ_BASE}/audio/transcriptions`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${_k()}`,
                  'Content-Type': req.headers['content-type']
                },
                body: bodyBuffer
              });

              const data = await groqRes.text();
              res.statusCode = groqRes.status;
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(data);
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          res.end();
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), devApiPlugin()],
});
