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
  if (req.url === '/health' || req.url === '/') {
    res.statusCode = 200;
    res.end('ok');
    return;
  }
  if (req.method === 'POST' && req.url && req.url.includes('/v1/chat/completions')) {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      let stream = false;
      try {
        stream = Boolean(JSON.parse(Buffer.concat(chunks).toString('utf8')).stream);
      } catch {
        stream = false;
      }
      if (stream) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.write(
          'data: {"id":"chatcmpl-llama-test","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"llama-proxy-ok"},"finish_reason":null}]}\n\n',
        );
        res.write('data: [DONE]\n\n');
        res.end();
        return;
      }
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          id: 'chatcmpl-llama-test',
          object: 'chat.completion',
          created: Math.floor(Date.now() / 1000),
          model: 'llamacpp',
          choices: [
            {
              index: 0,
              message: { role: 'assistant', content: 'llama-proxy-ok' },
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
