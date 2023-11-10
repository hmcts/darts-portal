const express = require('express');

const router = express.Router();

router.get('/types', (req, res) => {
  res.send([
    { trt_id: 1, description: 'Sentencing Remarks' },
    { trt_id: 2, description: 'Summing up (inc. verdict)' },
    { trt_id: 3, description: 'Antecedents' },
    { trt_id: 4, description: 'Argument and submission of ruling' },
    { trt_id: 5, description: 'Court log' },
    { trt_id: 6, description: 'Mitigation' },
    { trt_id: 7, description: 'Proceedings after verdict' },
    { trt_id: 8, description: 'Proposed opening of facts' },
    { trt_id: 9, description: 'Specified times' },
    { trt_id: 999, description: 'Other' },
  ]);
});

router.get('/urgencies', (req, res) => {
  res.send([
    { tru_id: 1, description: 'Overnight' },
    { tru_id: 2, description: '3 working days' },
    { tru_id: 3, description: '7 working days' },
    { tru_id: 4, description: '12 working days' },
  ]);
});

router.post('/', (req, res) => {
  res.send({ transcription_id: 123 });
});

router.get('/', (req, res) => {
  res.send({
    requester_transcriptions: [
      {
        transcription_id: 1,
        case_id: 72345,
        case_number: 'T12345',
        courthouse_name: 'Swansea',
        hearing_date: '2023-06-10',
        transcription_type: 'Court log',
        status: 'Awaiting Authorisation',
        urgency: 'Overnight',
        requested_ts: '2023-06-26T13:00:00Z',
      },
      {
        transcription_id: 2,
        case_id: 72346,
        case_number: 'T12345',
        courthouse_name: 'NEWCASTLE',
        hearing_date: '2023-06-10',
        transcription_type: 'Court log',
        status: 'With Transcriber',
        urgency: '3 Working days',
        requested_ts: '2023-06-26T13:00:00Z',
      },
      {
        transcription_id: 2,
        case_id: 72346,
        case_number: 'T12345',
        courthouse_name: 'Newcastle',
        hearing_date: '2023-06-10',
        transcription_type: 'Court log',
        status: 'Complete',
        urgency: '3 Working days',
        requested_ts: '2023-06-26T13:00:00Z',
      },
      {
        transcription_id: 2,
        case_id: 72346,
        case_number: 'T12345',
        courthouse_name: 'Cardiff',
        hearing_date: '2023-06-10',
        transcription_type: 'Court log',
        status: 'Rejected',
        urgency: 'Overnight',
        requested_ts: '2023-06-26T13:00:00Z',
      },
    ],
    approver_transcriptions: [
      {
        transcription_id: 1,
        case_id: 72345,
        case_number: 'T12345',
        courthouse_name: 'Cardiff',
        hearing_date: '2023-06-10',
        transcription_type: 'court_log',
        status: 'Complete',
        urgency: '3 Working days',
        requested_ts: '2023-06-26T13:00:00Z',
      },
    ],
  });
});

module.exports = router;
