import { startServer } from '../dist/server/server';
const PORT = 3000;
const READY_MESSAGE = `> Ready on http://localhost:${PORT}`;

const server = startServer({ disableAuthentication: true });

server.listen(PORT, () => {
  console.log(READY_MESSAGE);
});
