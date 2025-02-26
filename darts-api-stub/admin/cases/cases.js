const express = require('express');
const router = express.Router();

const caseSearchResults = [
  {
    id: 1,
    case_number: '123456',
    courthouse: {
      id: 1,
      display_name: 'Courthouse 1',
    },
    courtrooms: [
      {
        id: 1,
        name: 'Courtroom 1',
      },
      {
        id: 2,
        name: 'Courtroom 2',
      },
    ],
    judges: ['Judge 1', 'Judge 2'],
    defendants: ['Defendant 1', 'Defendant 2'],
  },
  {
    id: 2,
    case_number: '654321',
    courthouse: {
      id: 2,
      display_name: 'Courthouse 2',
    },
    courtrooms: [
      {
        id: 2,
        name: 'Courtroom 2',
      },
    ],
    judges: ['Judge 3'],
    defendants: ['Defendant 3'],
  },
  {
    id: 3,
    case_number: '8714155',
    courthouse: {
      id: 3,
      display_name: 'Courthouse 3',
    },
    courtrooms: [
      {
        id: 3,
        name: 'Courtroom 3',
      },
    ],
    judges: ['Judge 4'],
    defendants: ['Defendant 4'],
    is_data_anonymised: true,
    data_anonymised_at: '2023-08-10T11:53:24.858Z',
  },
];

const singleCase = {
  id: 1,
  courthouse: {
    id: 1001,
    display_name: 'SWANSEA',
  },
  case_number: 'CASE1001',
  defendants: ['Joe Bloggs'],
  judges: ['Mr Judge'],
  prosecutors: ['Mrs Prosecutor'],
  defenders: ['Mr Defender'],
  reporting_restrictions: [
    {
      event_id: 123,
      event_name: 'Verdict',
      event_text: 'Manually entered text',
      hearing_id: 123,
      event_ts: '2024-01-01T00:00:00Z',
    },
  ],
  retain_until_date_time: '2030-01-31T15:42:10.361Z',
  case_closed_date_time: '2023-07-20T15:42:10.361Z',
  retention_date_time_applied: '2023-07-22T15:42:10.361Z',
  retention_policy_applied: 'MANUAL',
  case_object_id: '12345',
  case_status: 'OPEN',
  created_at: '2024-01-01T00:00:00Z',
  created_by: 5,
  last_modified_at: '2024-01-01T00:00:00Z',
  last_modified_by: 5,
  is_deleted: false,
  case_deleted_at: '2024-01-01T00:00:00Z',
  is_data_anonymised: false,
  data_anonymised_at: '2024-01-01T00:00:00Z',
  is_interpreter_used: false,
};

router.post('/search', (req, res) => {
  if (req.body.case_number === 'NO_RESULTS') {
    res.send([]);
    return;
  }

  if (req.body.case_number === 'TOO_MANY_RESULTS') {
    res.status(400).send('Too many results found. Please refine your search.');
    return;
  }

  res.send(caseSearchResults);
});

router.get('/:id', (req, res) => {
  res.send(singleCase);
});

module.exports = router;
