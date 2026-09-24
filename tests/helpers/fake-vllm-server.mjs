#!/usr/bin/env node
import http from 'node:http';

let port = 8080;
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i += 1) {
  if (args[i] === '--port' && args[i + 1]) {
    port = Number(args[i + 1]);
  }
}

const server = http.createServer((req, res) => {
  if (req.url === '/health' || req.url === '/' || req.url === '/v1/models') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ object: 'list', data: [{ id: 'vllm' }] }));
    return;
  }
  if (req.method === 'POST' && req.url && req.url.includes('/v1/chat/completions')) {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          id: 'chatcmpl-vllm-test',
          object: 'chat.completion',
          created: Math.floor(Date.now() / 1000),
          model: 'vllm',
          choices: [
            {
              index: 0,
              message: { role: 'assistant', content: 'vllm-proxy-ok' },
              finish_reason: 'stop',
            },
          ],
          usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
        }),
      );
    });
    return;
  }
  res.statusCode = 404;
  res.end();
});

server.listen(port, '127.0.0.1');
