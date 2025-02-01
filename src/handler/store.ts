import http from 'http';

import config from '../config.js';
import sh from './shat.js';

async function handler(req: http.IncomingMessage, res: http.ServerResponse) {
  let path = req.url || '/';

  if (path.startsWith('/'))
    path = path.slice(1);

  path = path.replace(/\?.+$/g, '');

  if (!path.length)
    return res.writeHead(404);

  console.log(path, 'GENERATING SHIT');
  const chatsounds = sh.new(Buffer.from(path, 'base64url').toString('utf-8'));
  const buffer = await chatsounds.buffer({
    format: 'ogg',
    codec: 'libopus',
    audioChannels: 2,
    sampleRate: 48000
  });

  if (!buffer)
    return res.writeHead(404);

  res.writeHead(200, { 'content-type': 'audio/ogg' });
  res.write(buffer);
}

async function safeHandler(req: http.IncomingMessage, res: http.ServerResponse) {
  try {
    await handler(req, res);
  } catch (err) {
    console.log(err);
    res.writeHead(500);
  }

  res.end();
}

const server = http.createServer(safeHandler);

export function listen() {
  server.listen(config.port, () => {
    console.log('listening on :' + config.port);
  });
}