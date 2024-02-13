const express = require('express');
const { localArray } = require('../localArray');

const router = express.Router();

const resBody104 = {
  type: 'CASE_104',
  title: 'The requested case cannot be found',
  status: 404,
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

const defaultAnnotations = [
  {
    annotation_id: 1,
    hearing_id: 2,
    hearing_date: '2023-12-14',
    annotation_ts: '2023-12-15T12:00:00.000Z',
    annotation_text: 'A summary notes of this annotation...',
    annotation_documents: [
      {
        annotation_document_id: 1,
        file_name: 'Annotation.docx',
        file_type: 'DOCX',
        uploaded_by: 'Mr User McUserFace',
        uploaded_ts: '2023-12-15T12:00:00.000Z',
      },
    ],
  },
];

const annotations = localArray('annotations');
// Clear out old values on restart
annotations.value = defaultAnnotations;

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

const getAnnotationsByHearingId = (hearingId) => {
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
