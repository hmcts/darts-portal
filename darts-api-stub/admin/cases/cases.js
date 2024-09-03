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

module.exports = router;
