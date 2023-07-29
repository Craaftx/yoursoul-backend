import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import ioService from './services/socket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const HTML_PATH = __dirname + '/pages/html';

const app = express();
const server = http.createServer(app);

app.use(cors());

app.use(express.static('public'));

// app.get('/', (_, res) => {
//   res.sendFile(HTML_PATH + '/index.html');
// });

ioService(server);

server.listen(process.env.PORT, () => {
  console.log(`[Express] Server listening on *:${process.env.PORT}`);
});
