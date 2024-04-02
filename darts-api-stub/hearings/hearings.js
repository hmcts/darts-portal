const express = require('express');
const { localArray } = require('../localArray');
const { getRolesByUserId } = require('../users');

const router = express.Router();

const resBody104 = {
  type: 'CASE_104',
  title: 'The requested case cannot be found',
  status: 404,
};

const resBodyAuth100 = {
  type: 'AUTHORISATION_100',
  title: 'User is not authorised for the associated courthouse',
  status: 403,
};

const transcriptOne = [
  {
    transcription_id: 0,
    hearing_id: 1,
    hearing_date: '2023-10-12',
    type: 'Sentencing remarks',
    requested_on: '2023-10-12T00:00:00Z',
    requested_by_name: 'Joe Bloggs',
    status: 'With Transcriber',
  },
  {
    transcription_id: 1,
    hearing_id: 1,
    hearing_date: '2023-10-12',
    type: 'Sentencing remarks',
    requested_on: '',
    requested_by_name: 'Joe Bloggs',
    status: 'Complete',
  },
  {
    transcription_id: 3,
    hearing_id: 1,
    hearing_date: '2023-10-12',
    type: 'Sentencing remarks',
    requested_on: '2023-10-21T00:00:00Z',
    requested_by_name: 'Joe Bloggs',
    status: 'Complete',
  },
];

const transcriptTwo = [
  {
    transcription_id: 1,
    hearing_id: 2,
    hearing_date: '2023-10-12',
    type: 'Sentencing remarks',
    requested_on: '2023-10-12T00:00:00Z',
    requested_by_name: 'Joe Bloggs',
    status: 'Requested',
  },
  {
    transcription_id: 1,
    hearing_id: 2,
    hearing_date: '2023-10-12',
    type: 'Sentencing remarks',
    requested_on: '2023-10-12T00:00:00Z',
    requested_by_name: 'Joe Bloggs',
    status: 'Requested',
  },
  {
    transcription_id: 1,
    hearing_id: 2,
    hearing_date: '2023-10-12',
    type: 'Sentencing remarks',
    requested_on: '2023-10-12T00:00:00Z',
    requested_by_name: 'Joe Bloggs',
    status: 'Complete',
  },
  {
    transcription_id: 1,
    hearing_id: 2,
    hearing_date: '2023-10-12',
    type: 'Sentencing remarks',
    requested_on: '2023-10-12T00:00:00Z',
    requested_by_name: 'Joe Bloggs',
    status: 'Complete',
  },
];

const events = [
  {
    id: -1,
    timestamp: '2023-11-13T08:59:00.000Z',
    name: 'Case called on',
    text: 'Record: New Case',
  },
  {
    id: 0,
    timestamp: '2023-11-13T09:00:00.000Z',
    name: 'Case called on',
    text: 'Record: New Case',
  },
  {
    id: 1,
    timestamp: '2023-11-13T09:00:10.000Z',
    name: 'Case called on',
    text: 'Record: New Case',
  },
  {
    id: 2,
    timestamp: '2023-11-13T09:00:20.000Z',
    name: 'Case called on',
    text: 'Record: New Case',
  },
  {
    id: 3,
    timestamp: '2023-11-13T09:00:30.000Z',
    name: 'Case called on',
    text: 'Record: New Case',
  },
  {
    id: 4,
    timestamp: '2023-11-13T09:00:50.000Z',
    name: 'Case called on',
    text: 'Record: New Case',
  },
  {
    id: 5,
    timestamp: '2023-11-13T09:01:50.000Z',
    name: 'Case called on',
    text: 'Record: New Case',
  },
];

// Fetch the annotations from the case module
const getAnnotationsByHearingId = (hearingId) => {
  const annotations = localArray('annotations');
  return annotations.value.filter((annotation) => annotation.hearing_id === parseInt(hearingId));
};

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
    case '4':
      res.send(events);
      break;
    default:
      res.send(events);
      break;
  }
});

// transcripts stub data
router.get('/:hearingId/transcripts', (req, res) => {
  // if the user only has TRANSLATION_QA role, the respond with 403
  const userRoles = getRolesByUserId(parseInt(req.headers.user_id, 10));
  if (userRoles?.length === 1 && userRoles[0].roleName === 'TRANSLATION_QA') {
    return res.status(403).send(resBodyAuth100);
  }
  switch (req.params?.hearingId) {
    case '404':
      res.status(404).send(resBody104);
      break;
    case '1':
      res.send(transcriptOne);
      break;
    case '2':
      res.send(transcriptTwo);
      break;
    default:
      res.send([]);
      break;
  }
});

// annotations stub data
router.get('/:hearingId/annotations', (req, res) => {
  const hearingId = req.params?.hearingId;
  switch (hearingId) {
    case undefined:
    case '404':
      res.status(404).send(resBody104);
      break;
    default:
      const annotations = getAnnotationsByHearingId(hearingId);
      res.send(annotations);
      break;
  }
});

module.exports = router;
