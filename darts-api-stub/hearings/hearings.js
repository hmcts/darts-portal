const express = require('express');

const router = express.Router();

const transcriptOne = [
  {
    tra_id: 1,
    hea_id: 2,
    hearing_date: '2023-10-12',
    type: 'Sentencing remarks',
    requested_on: '2023-10-12',
    requested_by_name: 'Joe Bloggs',
    status: 'With Transcriber',
  },
  {
    tra_id: 1,
    hea_id: 2,
    hearing_date: '2023-10-12',
    type: 'Sentencing remarks',
    requested_on: '2023-10-12',
    requested_by_name: 'Joe Bloggs',
    status: 'Complete',
  },
];

const transcriptTwo = [
  {
    tra_id: 1,
    hea_id: 2,
    hearing_date: '2023-10-12',
    type: 'Sentencing remarks',
    requested_on: '2023-10-12',
    requested_by_name: 'Joe Bloggs',
    status: 'Requested',
  },
  {
    tra_id: 1,
    hea_id: 2,
    hearing_date: '2023-10-12',
    type: 'Sentencing remarks',
    requested_on: '2023-10-12',
    requested_by_name: 'Joe Bloggs',
    status: 'Requested',
  },
  {
    tra_id: 1,
    hea_id: 2,
    hearing_date: '2023-10-12',
    type: 'Sentencing remarks',
    requested_on: '2023-10-12',
    requested_by_name: 'Joe Bloggs',
    status: 'Complete',
  },
  {
    tra_id: 1,
    hea_id: 2,
    hearing_date: '2023-10-12',
    type: 'Sentencing remarks',
    requested_on: '2023-10-12',
    requested_by_name: 'Joe Bloggs',
    status: 'Complete',
  },
];

router.get('/:hearingId/events', (req, res) => {
  switch (req.params.hearingId) {
    case '1':
      const body1 = [
        {
          id: 1,
          timestamp: '2023-07-31T01:00:00.620Z',
          name: 'Case called on',
          text: 'Record: New Case',
        },
        {
          id: 2,
          timestamp: '2023-07-31T03:00:00.620Z',
          name: 'Case called on',
          text: 'Record: New Case',
        },
        {
          id: 3,
          timestamp: '2023-07-31T08:00:24.620Z',
          name: 'Case called on',
          text: 'Record: New Case',
        },
      ];
      res.send(body1);
      break;
    case '2':
      const body2 = [
        {
          id: 4,
          timestamp: '2023-07-31T14:32:24.620Z',
          name: 'Case called on',
          text: 'Record:New Case',
        },
      ];
      res.send(body2);
      break;
    default:
      res.send([]);
      break;
  }
});

// transcripts stub data
router.get('/:hearingId/transcripts', (req, res) => {
  switch (req.params.hearingId) {
    case '404':
      const resBody104 = {
        type: 'CASE_104',
        title: 'The requested case cannot be found',
        status: 404,
      };
      res.status(404).send(resBody104);
      break;
    case '1':
      res.send(transcriptOne);
      break;
    default:
      res.send(transcriptTwo);
      break;
  }
});

module.exports = router;
