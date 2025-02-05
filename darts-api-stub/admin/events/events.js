const router = require('express').Router();

const events = [
  {
    id: 111,
    created_at: '2024-01-01T04:14:51Z',
    event_ts: '2024-01-01T04:14:44Z',
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
    created_at: '2024-01-02T11:24:01Z',
    event_ts: '2024-01-02T11:23:47Z',
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
    created_at: '2024-01-02T23:30:17Z',
    event_ts: '2024-01-03T23:30:15Z',
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
    is_event_anonymised: true,
    is_case_expired: true,
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

router.post('/obfuscate', (req, res) => {
  const ids = req.body.eve_ids;
  ids.forEach((id) => {
    const eventsIndex = events.findIndex((event) => event.id === id);
    const viewEventIndex = viewEvents.findIndex((event) => event.id === id);

    events[eventsIndex].is_data_anonymised = true;
    viewEvents[viewEventIndex].is_data_anonymised = true;
  });
  res.status(200).send();
});

const viewEvents = events.map((event) => ({
  ...event,
  event_mapping: {
    id: 1,
  },
  is_log_entry: false,
  version: 'v1',
  is_data_anonymised: false,
  created_by: 1,
  last_modified_by: 2,
  last_modified_at: '2024-06-01T13:00:00Z',
  documentum_id: '123456',
  message_id: '654321',
  source_id: 'source123',
  is_current: true,
}));

router.get('/reset', (req, res) => {
  events.forEach((event) => {
    event.is_data_anonymised = false;
  });

  viewEvents.forEach((event) => {
    event.is_data_anonymised = false;
  });

  res.status(200).send();
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const viewEvent = viewEvents.find((event) => event.id === Number(req.params.id));
  if (!viewEvent) {
    return res.status(404).send('Event not found');
  }
  res.send(viewEvent);
});

module.exports = router;
