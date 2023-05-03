import * as config from './config';
import { startServer } from './server';

const PORT = config.port;
const READY_MESSAGE = `> Ready on http://localhost:${PORT}`;

const server = startServer();

server.listen(PORT, () => {
  console.log(READY_MESSAGE);
});
