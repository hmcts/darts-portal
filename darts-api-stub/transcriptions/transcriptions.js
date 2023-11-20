const express = require('express');

const router = express.Router();

router.use(express.json());

const mockTranscriptionDetails = {
  case_id: 1,
  case_number: 'C20220620001',
  courthouse: 'Swansea',
  defendants: ['Defendant Dave'],
  judges: ['HHJ M. Hussain KC	'],
  transcript_file_name: 'C20220620001_0.docx',
  hearing_date: '2023-11-08',
  urgency: 'Standard',
  request_type: 'Specified Times',
  transcription_start_ts: '2023-06-26T13:00:00Z',
  transcription_end_ts: '2023-06-26T16:00:00Z',
};

const mockTranscriptionDetailsNoName = {
  case_id: 1,
  case_number: 'C20220620001',
  courthouse: 'Swansea',
  defendants: ['Defendant Dave'],
  judges: ['HHJ M. Hussain KC	'],
  hearing_date: '2023-11-08',
  urgency: 'Standard',
  request_type: 'Specified Times',
  transcription_start_ts: '2023-06-26T13:00:00Z',
  transcription_end_ts: '2023-06-26T16:00:00Z',
};

router.get('/types', (req, res) => {
  res.send([
    { trt_id: 0, description: 'Duplicate' },
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

router.get('/:transcriptId', (req, res) => {
  switch (req.params.transcriptId) {
    case '403':
      const error403 = {
        type: 'AUTHORISATION_100',
        title: 'User is not authorised for the associated courthouse',
        status: 403,
      };
      res.status(403).send(error403);
      break;
    case '404':
      const error404 = {
        type: 'TRANSCRIPTION_101',
        title: 'The requested transcript cannot be found',
        status: 404,
      };
      res.status(404).send(error404);
      break;
    case '1':
      res.status(200).send(mockTranscriptionDetails);
      break;
    case '2':
      res.status(200).send(mockTranscriptionDetailsNoName);
      break;
    default:
      res.status(200).send(mockTranscriptionDetails);
  }
});

router.post('/', (req, res) => {
  //If start time is below then return 409
  const exists = req.body.start_date_time.indexOf('00:00:00Z') !== -1 && true;
  const dupe = req.body.transcription_type_id == 0 && true;

  if (exists || dupe) {
    res.status(409).send({ duplicate_transcription_id: 1 });
  } else {
    res.send({ transcription_id: 123 });
  }
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
        transcription_type: 'Court log',
        status: 'Complete',
        urgency: '3 Working days',
        requested_ts: '2023-06-26T13:00:00Z',
      },
    ],
  });
});

module.exports = router;
