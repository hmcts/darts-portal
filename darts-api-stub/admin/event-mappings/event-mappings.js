const express = require('express');
const router = express.Router();

const eventMapping = [
  {
    id: 1,
    type: '1000',
    sub_type: '1001',
    name: 'Event map 1',
    handler: 'StandardEventHandler',
    is_active: true,
    has_restrictions: false,
    created_at: '2024-05-05T11:00:00Z',
  },
  {
    id: 2,
    type: '1000',
    sub_type: '1001',
    name: 'Event map 2',
    handler: 'TranscriptionRequestHandler',
    is_active: false,
    has_restrictions: true,
    created_at: '2024-05-05T13:00:00Z',
  },
  {
    id: 3,
    type: '1010',
    sub_type: '1011',
    name: 'Mapping entry 3',
    handler: 'TranscriptionRequestHandler',
    is_active: true,
    has_restrictions: true,
    created_at: '2024-04-02T17:00:00Z',
  },
  {
    id: 4,
    type: '999',
    sub_type: '1008',
    name: 'Fourth event mapping',
    handler: 'StandardEventHandler',
    is_active: true,
    has_restrictions: false,
    created_at: '2023-12-01T13:00:00Z',
  },
  {
    id: 5,
    type: '1111',
    sub_type: '1112',
    name: 'Prosecution opened',
    handler: 'StandardEventHandler',
    is_active: true,
    has_restrictions: true,
    created_at: '2024-02-01T11:00:00Z',
  },
  {
    id: 6,
    type: '9999',
    sub_type: '5555',
    name: 'Prosecution opened',
    handler: 'StandardEventHandler',
    is_active: false,
    has_restrictions: false,
    created_at: '2024-01-03T00:00:00Z',
  },
];

router.get('/', (_, res) => res.json(eventMapping));

module.exports = router;
