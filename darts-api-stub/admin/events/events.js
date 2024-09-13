const router = require('express').Router();

const events = [
  {
    id: 111,
    created_at: '2024-01-01T00:00:00Z',
    name: 'Event 1',
    text: 'This is an event',
    chronicle_id: '123',
    antecedent_id: '456',
    courthouse: {
      id: 1,
      display_name: 'Cardiff',
    },
    courtroom: {
      id: 1,
      name: 'Room 1',
    },
  },
  {
    id: 222,
    created_at: '2024-01-02T00:00:00Z',
    name: 'Event 2',
    text: 'This is another event',
    chronicle_id: '789',
    antecedent_id: '012',
    courthouse: {
      id: 2,
      display_name: 'Swansea',
    },
    courtroom: {
      id: 2,
      name: 'Room 2',
    },
  },
  {
    id: 333,
    created_at: '2024-01-03T00:00:00Z',
    name: 'Event 3',
    text: 'This is yet another event',
    chronicle_id: '345',
    antecedent_id: '678',
    courthouse: {
      id: 3,
      display_name: 'Newport',
    },
    courtroom: {
      id: 3,
      name: 'Room 3',
    },
  },
];

router.post('/search', (req, res) => {
  if (req.body.case_number === 'NO_RESULTS') {
    res.send([]);
    return;
  }

  if (req.body.case_number === 'TOO_MANY_RESULTS') {
    res.status(400).send('Too many results found. Please refine your search.');
    return;
  }

  res.send(events);
});

const viewEvents = events.map((event) => ({
  ...event,
  event_mapping: {
    id: 1,
  },
  is_log_entry: false,
  version: 'v1',
  is_data_anonymised: false,
  case_expired_at: '2024-06-01T13:00:00Z',
  created_by: 1,
  last_modified_by: 2,
  last_modified_at: '2024-06-01T13:00:00Z',
  documentum_id: '123456',
  message_id: '654321',
  source_id: 'source123',
}));

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const viewEvent = viewEvents.find((event) => event.id === Number(req.params.id));
  if (!viewEvent) {
    return res.status(404).send('Event not found');
  }

  if (id === 333) {
    return res.send({ ...viewEvent, is_data_anonymised: true });
  }

  res.send(viewEvent);
});

module.exports = router;
