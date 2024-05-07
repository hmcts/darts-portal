import { startServer } from '../dist/server/server/server';

const PORT = 3000;
const READY_MESSAGE = `> Ready on http://localhost:${PORT}`;

const server = startServer();

server.listen(PORT, () => {
  console.log(READY_MESSAGE);
});
