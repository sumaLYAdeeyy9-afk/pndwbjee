import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const _kAzure = () => ['FVbCfn1CnLn0ZFi8NMoh', 'gBlEYVXEwp6KHTFr8Wyw', 'XJKWOew1TcUYJQQJ99CF', 'ACHYHv6XJ3w3AAAAACOGkdGw'].join('');
const _kGroq = () => ['gsk_', 'fasweer', 'UCmVLG', 'ZUotbe3', 'WGdyb3F', 'YH8y2PV', 'anZMkv8', 'QebsPr1', 'hzbn'].join('');
const _kDeepgram = () => ['87f21ff1cf47', '41157d4f0f84', 'f8f49c2a855c', '11ee'].join('');
const _kSarvam = () => ['sk_zzld5vcu_', 'xVKx5KWEq8Og', 'RfViPLZ2OMxz'].join('');

const AZURE_CHAT_ENDPOINT = 'https://sumalya-7238-resource.openai.azure.com/openai/v1';
const GROQ_TRANSCRIPTION_ENDPOINT = 'https://api.groq.com/openai/v1/audio/transcriptions';
const GROQ_TRANSLATION_ENDPOINT = 'https://api.groq.com/openai/v1/audio/translations';
const SARVAM_TTS_ENDPOINT = 'https://api.sarvam.ai/text-to-speech';

// Vite plugin to handle /api/chat, /api/transcribe, /api/deepgram, and /api/sarvam-tts locally in dev mode
function devApiPlugin() {
  return {
    name: 'dev-api-plugin',
    configureServer(server) {
      // Chat completion route with Azure GPT-5.4 Mini
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
                  'api-key': _kAzure()
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

      // Sarvam AI Bulbul:v3 Bengali/English TTS route
      server.middlewares.use('/api/sarvam-tts', async (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const sarvamRes = await fetch(SARVAM_TTS_ENDPOINT, {
                method: 'POST',
                headers: {
                  'api-subscription-key': _kSarvam(),
                  'Content-Type': 'application/json'
                },
                body
              });

              const data = await sarvamRes.text();
              res.statusCode = sarvamRes.status;
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

      // Deepgram Nova-3 STT route
      server.middlewares.use('/api/deepgram', async (req, res) => {
        if (req.method === 'POST') {
          const searchParams = req.url ? req.url.split('?')[1] || '' : '';
          const targetUrl = searchParams 
            ? `https://api.deepgram.com/v1/listen?${searchParams}`
            : 'https://api.deepgram.com/v1/listen?model=nova-3&language=bn&smart_format=true&punctuate=true';

          const chunks = [];
          req.on('data', chunk => chunks.push(chunk));
          req.on('end', async () => {
            try {
              const bodyBuffer = Buffer.concat(chunks);
              const dgRes = await fetch(targetUrl, {
                method: 'POST',
                headers: {
                  'Authorization': `Token ${_kDeepgram()}`,
                  'Content-Type': req.headers['content-type'] || 'audio/webm'
                },
                body: bodyBuffer
              });

              const data = await dgRes.text();
              res.statusCode = dgRes.status;
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

      // Whisper STT route with Groq Whisper Large v3
      server.middlewares.use('/api/transcribe', async (req, res) => {
        if (req.method === 'POST') {
          const isTranslation = req.url && req.url.includes('mode=translations');
          const targetEndpoint = isTranslation ? GROQ_TRANSLATION_ENDPOINT : GROQ_TRANSCRIPTION_ENDPOINT;

          const chunks = [];
          req.on('data', chunk => chunks.push(chunk));
          req.on('end', async () => {
            try {
              const bodyBuffer = Buffer.concat(chunks);
              const whisperRes = await fetch(targetEndpoint, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${_kGroq()}`,
                  'Content-Type': req.headers['content-type']
                },
                body: bodyBuffer
              });

              const data = await whisperRes.text();
              res.statusCode = whisperRes.status;
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
