/* Throwaway static server so the Academy can be opened over http rather than file://. */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'C:\\Users\\erikb\\Documents\\Claude\\Projects\\MINIBOXSALES TOOL';
const PORT = 8899;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
                '.jpg': 'image/jpeg', '.png': 'image/png', '.json': 'application/json' };

http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel === '/') rel = '/MiniBox_Academy_v3.0.html';
  const file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT)) { res.writeHead(403).end('no'); return; }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404).end('not found: ' + rel); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    res.end(buf);
  });
}).listen(PORT, () => console.log('serving ' + ROOT + ' on http://localhost:' + PORT));
