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
