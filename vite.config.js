import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const _k = () => ['FVbCfn1CnLn0ZFi8NMoh', 'gBlEYVXEwp6KHTFr8Wyw', 'XJKWOew1TcUYJQQJ99CF', 'ACHYHv6XJ3w3AAAAACOGkdGw'].join('');
const AZURE_BASE = 'https://sumalya-7238-resource.openai.azure.com';
const AZURE_CHAT_ENDPOINT = `${AZURE_BASE}/openai/v1`;
const AZURE_WHISPER_ENDPOINT = `${AZURE_BASE}/openai/deployments/whisper/audio/transcriptions?api-version=2024-02-01`;

// Vite plugin to handle /api/chat and /api/transcribe locally in dev mode
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
              const { messages, model = 'gpt-5.4-mini', stream = true } = JSON.parse(body);
              const azureRes = await fetch(`${AZURE_CHAT_ENDPOINT}/chat/completions`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'api-key': _k()
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

              if (stream && azureRes.body) {
                const reader = azureRes.body.getReader();
                const decoder = new TextDecoder();
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  res.write(decoder.decode(value));
                }
                res.end();
              } else {
                const data = await azureRes.text();
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
              const azureRes = await fetch(AZURE_WHISPER_ENDPOINT, {
                method: 'POST',
                headers: {
                  'api-key': _k(),
                  'Content-Type': req.headers['content-type']
                },
                body: bodyBuffer
              });

              const data = await azureRes.text();
              res.statusCode = azureRes.status;
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
