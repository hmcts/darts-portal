const express = require('express');

const router = express.Router();

router.use(express.json());

const yourTranscriptionsStub = {
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
      courthouse_name: 'Liverpool',
      hearing_date: '2023-06-10',
      transcription_type: 'Court log',
      status: 'With Transcriber',
      urgency: 'Up to 3 working days',
      requested_ts: '2023-06-26T13:00:00Z',
    },
    {
      transcription_id: 3,
      case_id: 72346,
      case_number: 'CXYZ12345',
      courthouse_name: 'Newcastle',
      hearing_date: '2023-06-10',
      transcription_type: 'Court log',
      status: 'Complete',
      urgency: 'Up to 3 working days',
      requested_ts: '2023-06-26T13:00:00Z',
    },
    {
      transcription_id: 4,
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
      urgency: 'Up to 3 working days',
      requested_ts: '2023-06-26T13:00:00Z',
    },
  ],
};

const mockTranscriptionDetails = {
  case_id: 1,
  reporting_restriction: 'Section 4(2) of the Contempt of Court Act 1981',
  case_number: 'C20220620001',
  courthouse: 'Swansea',
  status: 'Rejected',
  from: 'MoJ CH Swansea',
  received: '2023-11-17T12:53:07.468Z',
  requestor_comments: 'Please expedite my request',
  defendants: ['Defendant Dave', 'Defendant Bob'],
  judges: ['HHJ M. Hussain KC	', 'Ray Bob'],
  transcript_file_name: 'C20220620001_0.docx',
  hearing_date: '2023-11-08',
  urgency: 'Standard',
  request_type: 'Specified Times',
  request_id: 123456789,
  transcription_start_ts: '2023-06-26T13:00:00Z',
  transcription_end_ts: '2023-06-26T16:00:00Z',
  is_manual: true,
  hearing_id: 1,
};

const mockTranscriptionDetailsTwo = {
  case_id: 2,
  reporting_restriction: 'Section 4(2) of the Contempt of Court Act 1981',
  case_number: 'C20220620001',
  courthouse: 'Swansea',
  status: 'Complete',
  from: 'MoJ CH Swansea',
  received: '2023-11-17T12:53:07.468Z',
  requestor_comments: 'Please expedite my request',
  defendants: ['Defendant Dave', 'Defendant Bob'],
  judges: ['HHJ M. Hussain KC	', 'Ray Bob'],
  transcript_file_name: 'C20220620001_0.docx',
  hearing_date: '2023-11-08',
  urgency: 'Standard',
  request_type: 'Specified Times',
  request_id: 123456789,
  transcription_start_ts: '2023-06-26T13:00:00Z',
  transcription_end_ts: '2023-06-26T16:00:00Z',
  is_manual: true,
  hearing_id: 1,
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
  reporting_restriction: 'Section 4(2) of the Contempt of Court Act 1981',
};

const unassignedTranscriptions = [
  {
    transcription_id: 1,
    case_id: 72345,
    case_number: 'T12345',
    courthouse_name: 'Newcastle',
    hearing_date: '2023-06-10',
    transcription_type: 'Court Log',
    status: 'Complete',
    urgency: 'Overnight',
    requested_ts: '2023-06-26T13:00:00Z',
    state_change_ts: '2023-06-27T13:00:00Z',
    is_manual: true,
  },
  {
    transcription_id: 2,
    case_id: 32345,
    case_number: 'T12345',
    courthouse_name: 'Newcastle',
    hearing_date: '2023-06-11',
    transcription_type: 'Court Log',
    status: 'Complete',
    urgency: 'Overnight',
    requested_ts: '2023-06-26T13:00:00Z',
    state_change_ts: '2023-06-27T13:00:00Z',
    is_manual: false,
  },
  {
    transcription_id: 3,
    case_id: 32445,
    case_number: 'T12345',
    courthouse_name: 'Newcastle',
    hearing_date: '2023-06-11',
    transcription_type: 'Court Log',
    status: 'Complete',
    urgency: 'Up to 3 working days',
    requested_ts: '2023-06-26T13:00:00Z',
    state_change_ts: '2023-06-27T13:00:00Z',
    is_manual: false,
  },
];

router.get('/types', (req, res) => {
  res.send([
    { transcription_type_id: 0, description: 'Duplicate' },
    { transcription_type_id: 1, description: 'Sentencing Remarks' },
    { transcription_type_id: 2, description: 'Summing up (inc. verdict)' },
    { transcription_type_id: 3, description: 'Antecedents' },
    { transcription_type_id: 4, description: 'Argument and submission of ruling' },
    { transcription_type_id: 5, description: 'Court log' },
    { transcription_type_id: 6, description: 'Mitigation' },
    { transcription_type_id: 7, description: 'Proceedings after verdict' },
    { transcription_type_id: 8, description: 'Proposed opening of facts' },
    { transcription_type_id: 9, description: 'Specified times' },
    { transcription_type_id: 999, description: 'Other' },
  ]);
});

router.get('/urgencies', (req, res) => {
  res.send([
    { transcription_urgency_id: 1, description: 'Overnight' },
    { transcription_urgency_id: 2, description: 'Up to 3 working days' },
    { transcription_urgency_id: 3, description: '7 working days' },
    { transcription_urgency_id: 4, description: '12 working days' },
  ]);
});

router.get('/transcriber-counts', (req, res) => {
  res.send({
    unassigned: unassignedTranscriptions.length,
    assigned: 3,
  });
});

router.get('/transcriber-view', (req, res) => {
  switch (req.query.assigned) {
    case 'true':
      res.send([
        {
          transcription_id: 1,
          case_id: 3,
          case_number: 'T2023453422',
          courthouse_name: 'Reading',
          hearing_date: '2023-08-06',
          transcription_type: 'Court Log',
          status: 'With Transcriber',
          urgency: 'Overnight',
          requested_ts: '2023-08-12T13:00:00Z',
          state_change_ts: '2023-08-13T13:00:00Z',
          is_manual: true,
        },
        {
          transcription_id: 1,
          case_id: 3,
          case_number: 'T2023453436',
          courthouse_name: 'Swansea',
          hearing_date: '2023-06-10',
          transcription_type: 'Court Log',
          status: 'Complete',
          urgency: 'Up to 3 working days',
          requested_ts: '2023-06-26T13:00:00Z',
          state_change_ts: '2023-06-27T13:00:00Z',
          is_manual: true,
        },
      ]);
      break;
    case 'false':
      res.send(unassignedTranscriptions);
      break;
  }
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
    case '3':
      res.status(200).send(mockTranscriptionDetailsNoName);
      break;
    default:
      res.status(200).send(mockTranscriptionDetailsTwo);
  }
});

router.post('/:transcriptId/document', (req, res) => {
  res.status(200).send(req.body);
});

router.patch('/:transcriptId', (req, res) => {
  res.status(200).send(req.body);
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
  res.send(yourTranscriptionsStub);
});

router.patch('/', (req, res) => {
  req.body.forEach((item) => {
    const index = yourTranscriptionsStub.requester_transcriptions.findIndex(
      (x) => x.transcription_id == item.transcription_id
    );
    if (index >= 0) {
      yourTranscriptionsStub.requester_transcriptions.splice(index, 1);
    }
  });

  res.sendStatus(204);
});

module.exports = router;
