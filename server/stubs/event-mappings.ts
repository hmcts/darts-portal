import { StubResponse } from '.';
import data from '../../darts-api-stub/data/eventMappings.json';

export const eventMappings: StubResponse[] = [
  {
    method: 'get',
    path: '/admin/event-mappings',
    response: data,
    status: 200,
  },
  {
    method: 'post',
    path: '/admin/event-handlers',
    response: ['StandardEventHandler', 'TranscriptionRequestHandler'],
    status: 200,
  },
];
