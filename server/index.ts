import { startServer } from './server';

import * as propertiesVolume from '@hmcts/properties-volume';
import config from 'config';
propertiesVolume.addTo(config);

const PORT = config.get('port');
const READY_MESSAGE = `> Ready on http://localhost:${PORT}`;

const server = startServer();

server.listen(PORT, () => {
  console.log(READY_MESSAGE);
});
