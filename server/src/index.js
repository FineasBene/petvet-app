const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');
const app = require('./app');
const sessionMiddleware = require('./middleware/session');
const { connectMongo, setupChat } = require('./chat');

const HTTP_PORT  = parseInt(process.env.PORT || '3001');
const HTTPS_PORT = parseInt(process.env.HTTPS_PORT || '3443');

const keyFile  = path.join(__dirname, '../../certs/server.key');
const certFile = path.join(__dirname, '../../certs/server.crt');

let server;

if (fs.existsSync(keyFile) && fs.existsSync(certFile)) {
  const credentials = {
    key:  fs.readFileSync(keyFile),
    cert: fs.readFileSync(certFile),
  };
  server = https.createServer(credentials, app);
  server.listen(HTTPS_PORT, '0.0.0.0', () =>
    console.log(`PetVet HTTPS server pornit pe portul ${HTTPS_PORT}`)
  );
  // Redirecționează HTTP → HTTPS
  http.createServer((req, res) => {
    const host = (req.headers.host || 'localhost').split(':')[0];
    res.writeHead(301, { Location: `https://${host}:${HTTPS_PORT}${req.url}` });
    res.end();
  }).listen(HTTP_PORT, '0.0.0.0', () =>
    console.log(`HTTP redirect activ pe portul ${HTTP_PORT}`)
  );
} else {
  server = http.createServer(app);
  server.listen(HTTP_PORT, '0.0.0.0', () =>
    console.log(`PetVet HTTP server pornit pe portul ${HTTP_PORT} (ruleaza npm run gen-cert pentru HTTPS)`)
  );
}

const io = new Server(server, {
  cors: { origin: true, credentials: true }
});

setupChat(io, sessionMiddleware);
connectMongo().catch(() => {});
