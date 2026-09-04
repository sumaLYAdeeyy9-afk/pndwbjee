import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const _k = () => Buffer.from('RlZiQ2ZuMUNuTG4wWkZpOE5Nb2hnQmxFWVZYRXdwNktIVEZyOFd5d1hKS1dPZXcxVGNVWUpRUUo5OUNGQUNIWUh2NlhKM3czQUFBQUFDT0drZEd3', 'base64').toString('utf8');
const AZURE_ENDPOINT = 'https://sumalya-7238-resource.openai.azure.com/openai/v1';

// Vite plugin to handle /api/chat locally in dev mode
function devApiPlugin() {
  return {
    name: 'dev-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const { messages, model = 'gpt-5.4-mini', stream = true } = JSON.parse(body);
              const azureRes = await fetch(`${AZURE_ENDPOINT}/chat/completions`, {
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
    }
  };
}

export default defineConfig({
  plugins: [react(), devApiPlugin()],
});
