const router = require('express').Router();

const events = [
  {
    id: 111,
    is_data_anonymised: false,
    event_status: 4,
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
    cases: [
      {
        id: 1,
        courthouse: {
          id: 1,
          display_name: 'Courthouse 1',
        },
        case_number: 'CASE1',
      },
      {
        id: 2,
        courthouse: {
          id: 2,
          display_name: 'Courthouse 2',
        },
        case_number: 'CASE12',
      },
    ],
    hearings: [
      {
        id: 1,
        case_id: 1,
        case_number: 'CASE1',
        hearing_date: '2024-06-11',
        courthouse: {
          id: 0,
          display_name: 'Courthouse 1',
        },
        courtroom: {
          id: 2,
          name: 'Room 1',
        },
      },
      {
        id: 2,
        case_id: 1,
        case_number: 'CASE1',
        hearing_date: '2024-06-11',
        courthouse: {
          id: 3,
          display_name: 'Courthouse 1',
        },
        courtroom: {
          id: 0,
          name: 'Room 1',
        },
      },
    ],
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
    cases: [
      {
        id: 1,
        courthouse: {
          id: 1,
          display_name: 'Courthouse 1',
        },
        case_number: 'CASE1',
      },
      {
        id: 2,
        courthouse: {
          id: 2,
          display_name: 'Courthouse 2',
        },
        case_number: 'CASE12',
      },
    ],
    hearings: [
      {
        id: 1,
        case_id: 1,
        case_number: 'CASE1',
        hearing_date: '2024-06-11',
        courthouse: {
          id: 0,
          display_name: 'Courthouse 1',
        },
        courtroom: {
          id: 2,
          name: 'Room 1',
        },
      },
      {
        id: 2,
        case_id: 1,
        case_number: 'CASE1',
        hearing_date: '2024-06-11',
        courthouse: {
          id: 3,
          display_name: 'Courthouse 1',
        },
        courtroom: {
          id: 0,
          name: 'Room 1',
        },
      },
    ],
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
    is_data_anonymised: true,
    is_case_expired: true,
    cases: [
      {
        id: 1,
        courthouse: {
          id: 1,
          display_name: 'Courthouse 1',
        },
        case_number: 'CASE1',
      },
      {
        id: 2,
        courthouse: {
          id: 2,
          display_name: 'Courthouse 2',
        },
        case_number: 'CASE12',
      },
    ],
    hearings: [
      {
        id: 1,
        case_id: 1,
        case_number: 'CASE1',
        hearing_date: '2024-06-11',
        courthouse: {
          id: 0,
          display_name: 'Courthouse 1',
        },
        courtroom: {
          id: 2,
          name: 'Room 1',
        },
      },
      {
        id: 2,
        case_id: 1,
        case_number: 'CASE1',
        hearing_date: '2024-06-11',
        courthouse: {
          id: 3,
          display_name: 'Courthouse 1',
        },
        courtroom: {
          id: 0,
          name: 'Room 1',
        },
      },
    ],
  },
];

const versions = {
  current_version: {
    id: 1001,
    documentum_id: 'DOC-20240217-001',
    source_id: 2001,
    message_id: 'MSG-20240217-001',
    text: 'Defendant entered the courtroom and proceedings began.',
    event_mapping: {
      id: 3001,
      type: 'Hearing',
      sub_type: 'Initial Appearance',
      name: 'Defendant Appearance',
      handler: 'Court Clerk',
      is_active: true,
      has_restrictions: false,
      created_at: '2024-05-09T14:26:31.118Z',
      has_events: true,
    },
    is_log_entry: true,
    courthouse: {
      id: 4001,
      display_name: 'Manchester Crown Court',
    },
    courtroom: {
      id: 5001,
      name: 'Courtroom 3',
    },
    version: '1.3',
    chronicle_id: 'CHRON-20240217-001',
    antecedent_id: 'ANT-20240217-001',
    is_data_anonymised: false,
    event_ts: '2025-02-17T15:34:55.786Z',
    is_current: true,
    created_at: '2025-02-17T15:34:55.786Z',
    created_by: 101,
    last_modified_at: '2025-02-17T15:34:55.786Z',
    last_modified_by: 102,
  },
  previous_versions: [
    {
      id: 1000,
      documentum_id: 'DOC-20240210-001',
      source_id: 2000,
      message_id: 'MSG-20240210-001',
      text: 'Proceedings started at 10:00 AM with the judge presiding.',
      event_mapping: {
        id: 3000,
        type: 'Hearing',
        sub_type: 'Preliminary Hearing',
        name: 'Judge Seated',
        handler: 'Court Clerk',
        is_active: true,
        has_restrictions: false,
        created_at: '2024-05-08T10:15:00.000Z',
        has_events: true,
      },
      is_log_entry: true,
      courthouse: {
        id: 4000,
        display_name: 'Manchester Crown Court',
      },
      courtroom: {
        id: 5000,
        name: 'Courtroom 3',
      },
      version: '1.2',
      chronicle_id: 'CHRON-20240210-001',
      antecedent_id: 'ANT-20240210-001',
      is_data_anonymised: false,
      event_ts: '2025-02-10T10:30:00.000Z',
      is_current: false,
      created_at: '2025-02-10T10:30:00.000Z',
      created_by: 103,
      last_modified_at: '2025-02-15T11:45:00.000Z',
      last_modified_by: 104,
    },
    {
      id: 999,
      documentum_id: 'DOC-20240130-001',
      source_id: 1999,
      message_id: 'MSG-20240130-001',
      text: 'Courtroom preparation completed, awaiting judge arrival.',
      event_mapping: {
        id: 2999,
        type: 'Setup',
        sub_type: 'Preparation',
        name: 'Courtroom Prepared',
        handler: 'Bailiff',
        is_active: true,
        has_restrictions: false,
        created_at: '2024-01-30T08:45:00.000Z',
        has_events: true,
      },
      is_log_entry: true,
      courthouse: {
        id: 3999,
        display_name: 'Manchester Crown Court',
      },
      courtroom: {
        id: 4999,
        name: 'Courtroom 3',
      },
      version: '1.1',
      chronicle_id: 'CHRON-20240130-001',
      antecedent_id: 'ANT-20240130-001',
      is_data_anonymised: false,
      event_ts: '2025-01-30T09:00:00.000Z',
      is_current: false,
      created_at: '2025-01-30T09:00:00.000Z',
      created_by: 105,
      last_modified_at: '2025-02-01T12:00:00.000Z',
      last_modified_by: 106,
    },
    {
      id: 998,
      documentum_id: 'DOC-20240120-001',
      source_id: 1998,
      message_id: 'MSG-20240120-001',
      text: 'Case scheduled for upcoming trial session.',
      event_mapping: {
        id: 2998,
        type: 'Scheduling',
        sub_type: 'Trial Setup',
        name: 'Trial Scheduled',
        handler: 'Court Administrator',
        is_active: true,
        has_restrictions: false,
        created_at: '2024-01-20T07:30:00.000Z',
        has_events: true,
      },
      is_log_entry: true,
      courthouse: {
        id: 3998,
        display_name: 'Manchester Crown Court',
      },
      courtroom: {
        id: 4998,
        name: 'Courtroom 3',
      },
      version: '1.0',
      chronicle_id: 'CHRON-20240120-001',
      antecedent_id: 'ANT-20240120-001',
      is_data_anonymised: false,
      event_ts: '2025-01-20T08:00:00.000Z',
      is_current: false,
      created_at: '2025-01-20T08:00:00.000Z',
      created_by: 107,
      last_modified_at: '2025-01-25T13:15:00.000Z',
      last_modified_by: 108,
    },
  ],
};

router.post('/search', (req, res) => {
  if (req.body.case_number === 'NO_RESULTS') {
    res.send([]);
    return;
  }

  if (req.body.case_number === 'NO_CRITERIA') {
    res.status(400).send({ type: 'COMMON_105', title: 'The search criteria is too broad', status: 400 });
    return;
  }

  if (req.body.case_number === 'TOO_MANY_RESULTS') {
    res.status(400).send({
      type: 'EVENT_107',
      title: 'The search resulted in too many results',
      status: 400,
      detail: 'Number of results exceeded 1000 please narrow your search.',
    });
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
    if (event.id !== 333) {
      event.is_data_anonymised = false;
    }
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
    return res.send({ id: id, ...viewEvents[0] });
  }
  res.send(viewEvent);
});

router.patch('/:id', (req, res) => {
  res.sendStatus(200);
});

router.get('/:id/versions', (req, res) => {
  res.send(versions);
});

module.exports = router;
