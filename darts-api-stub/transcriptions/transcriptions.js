const express = require('express');
const router = express.Router();
const path = require('path');

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
      transcription_urgency: {
        transcription_urgency_id: 1,
        description: 'Overnight',
        priority_order: 1,
      },
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
      transcription_urgency: {
        transcription_urgency_id: 1,
        description: 'Up to 3 working days',
        priority_order: 3,
      },
      requested_ts: '2023-06-26T13:00:00Z',
    },
    {
      transcription_id: 4,
      case_id: 72346,
      case_number: 'REJ12345',
      courthouse_name: 'Cardiff',
      hearing_date: '2023-06-10',
      transcription_type: 'Court log',
      status: 'Rejected',
      transcription_urgency: {
        transcription_urgency_id: 1,
        description: 'Overnight',
        priority_order: 1,
      },
      requested_ts: '2023-06-26T13:00:00Z',
    },
    {
      transcription_id: 5,
      case_id: 72346,
      case_number: 'FGH12345',
      courthouse_name: 'Swansea',
      hearing_date: '2023-06-10',
      transcription_type: 'Court log',
      status: 'Complete',
      transcription_urgency: {
        transcription_urgency_id: 1,
        description: 'Up to 3 working days',
        priority_order: 3,
      },
      requested_ts: '2023-06-26T13:00:00Z',
    },
  ],
  approver_transcriptions: [
    {
      transcription_id: 1,
      case_id: 12345,
      case_number: 'T12345',
      courthouse_name: 'Cardiff',
      hearing_date: '2023-06-09',
      transcription_type: 'Court log',
      status: 'Complete',
      transcription_urgency: {
        transcription_urgency_id: 1,
        description: 'Up to 3 working days',
        priority_order: 3,
      },
      requested_ts: '2023-06-26T13:00:00Z',
    },
    {
      transcription_id: 10,
      case_id: 72345,
      case_number: 'CXYZ12345',
      courthouse_name: 'Newcastle',
      hearing_date: '2023-04-09',
      transcription_type: 'Court log',
      status: 'Complete',
      transcription_urgency: {
        transcription_urgency_id: 1,
        description: 'Up to 3 working days',
        priority_order: 3,
      },
      requested_ts: '2023-04-09T09:58:34Z',
    },
    {
      transcription_id: 3,
      case_id: 23452,
      case_number: 'T34567',
      courthouse_name: 'Cardiff',
      hearing_date: '2023-06-11',
      transcription_type: 'Court log',
      status: 'Complete',
      transcription_urgency: {
        transcription_urgency_id: 1,
        description: 'Overnight',
        priority_order: 1,
      },
      requested_ts: '2023-06-28T13:00:00Z',
    },
    {
      transcription_id: 4,
      case_id: 76543,
      case_number: 'T45678',
      courthouse_name: 'Cardiff',
      hearing_date: '2023-06-12',
      transcription_type: 'Court log',
      status: 'Complete',
      transcription_urgency: {
        transcription_urgency_id: 1,
        description: 'Up to 7 working days',
        priority_order: 7,
      },
      requested_ts: '2023-06-29T13:00:00Z',
    },
    {
      transcription_id: 5,
      case_id: 87543,
      case_number: 'T56789',
      courthouse_name: 'Cardiff',
      hearing_date: '2023-06-13',
      transcription_type: 'Court log',
      status: 'Complete',
      transcription_urgency: {
        transcription_urgency_id: 1,
        description: 'Up to 2 working days',
        priority_order: 2,
      },
      requested_ts: '2023-06-30T13:00:00Z',
    },
  ],
};

const mockTranscriptionDetails = {
  case_id: 1,
  case_reporting_restrictions: [
    {
      hearing_id: 1,
      event_id: 123,
      event_name: 'Section 4(2) of the Contempt of Court Act 1981',
      event_text: '',
      event_ts: '2023-08-07T09:00:00Z',
    },
  ],
  case_number: 'C20220620001',
  courthouse: 'Swansea',
  courthouse_id: 1,
  status: 'With Transcriber',
  from: 'MoJ CH Swansea',
  requestor: {
    user_id: 1,
    user_full_name: 'Joe Smith',
  },
  received: '2023-11-17T12:53:07.468Z',
  requestor_comments: 'Please expedite my request',
  rejection_reason: 'This request will take longer to transcribe within the urgency level you require.',
  defendants: ['Defendant Dave', 'Defendant Bob'],
  judges: ['HHJ M. Hussain KC	', 'Ray Bob'],
  transcript_file_name: 'C20220620001_0.docx',
  hearing_date: '2023-11-08',
  transcription_urgency: {
    transcription_urgency_id: 1,
    description: 'Standard',
    priority_order: 4,
  },
  request_type: 'Specified Times',
  request_id: 123456789,
  transcription_id: 1,
  transcription_start_ts: '2023-06-26T13:00:00Z',
  transcription_end_ts: '2023-06-26T16:00:00Z',
  is_manual: true,
  hearing_id: 1,
  requestor: {
    user_id: 1,
    user_full_name: 'Eric Bristow',
  },
};

const mockTranscriptionDetailsTwo = {
  case_id: 2,
  case_reporting_restrictions: [
    {
      hearing_id: 1,
      event_id: 123,
      event_name: 'Section 4(2) of the Contempt of Court Act 1981',
      event_text: '',
      event_ts: '2023-08-07T09:00:00Z',
    },
  ],
  case_number: 'C20220620001',
  courthouse: 'Swansea',
  status: 'Complete',
  from: 'MoJ CH Swansea',
  requestor: {
    user_id: 1,
    user_full_name: 'Joe Smith',
  },
  courthouse_id: 1,
  received: '2023-11-17T12:53:07.468Z',
  requestor_comments: 'Please expedite my request',
  defendants: ['Defendant Dave', 'Defendant Bob'],
  judges: ['HHJ M. Hussain KC	', 'Ray Bob'],
  transcript_file_name: 'C20220620001_0.docx',
  hearing_date: '2023-08-07',
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
  transcription_urgency: {
    transcription_urgency_id: 1,
    description: 'Standard',
    priority_order: 4,
  },
  request_type: 'Specified Times',
  transcription_start_ts: '2023-06-26T13:00:00Z',
  transcription_end_ts: '2023-06-26T16:00:00Z',
  case_reporting_restrictions: [
    {
      hearing_id: 1,
      event_id: 123,
      event_name: 'Section 4(2) of the Contempt of Court Act 1981',
      event_text: '',
      event_ts: '2023-11-08T09:00:00Z',
    },
  ],
};

let unassignedTranscriptions = [
  {
    transcription_id: 4,
    case_id: 72345,
    case_number: 'T12348',
    courthouse_name: 'Newcastle',
    hearing_date: '2023-06-10',
    transcription_type: 'Court Log',
    status: 'Approved',
    transcription_urgency: {
      transcription_urgency_id: 1,
      description: 'Up to 2 working days',
      priority_order: 2,
    },
    requested_ts: '2023-08-01T10:00:00Z',
    state_change_ts: '2023-06-27T13:00:00Z',
    is_manual: true,
  },
  {
    transcription_id: 54,
    case_id: 32345,
    case_number: 'T12345',
    courthouse_name: 'Cardiff',
    hearing_date: '2022-03-11',
    transcription_type: 'Specified Times',
    status: 'Approved',
    transcription_urgency: {
      transcription_urgency_id: 1,
      description: 'Overnight',
      priority_order: 1,
    },
    requested_ts: '2022-06-27T12:00:00Z',
    state_change_ts: '2023-06-27T13:00:00Z',
    is_manual: true,
  },
  {
    transcription_id: 6,
    case_id: 32445,
    case_number: 'T12346',
    courthouse_name: 'Swansea',
    hearing_date: '2021-04-18',
    transcription_type: 'Sentencing Remarks',
    status: 'Approved',
    transcription_urgency: {
      transcription_urgency_id: 1,
      description: 'Up to 3 working days',
      priority_order: 3,
    },
    requested_ts: '2022-02-28T13:00:00Z',
    state_change_ts: '2023-06-27T13:00:00Z',
    is_manual: true,
  },
  {
    transcription_id: 7,
    case_id: 32445,
    case_number: 'T12347',
    courthouse_name: 'Windsor',
    hearing_date: '2023-11-03',
    transcription_type: 'Court Log',
    status: 'Approved',
    transcription_urgency: {},
    requested_ts: '2023-12-25T13:00:00Z',
    state_change_ts: '2023-06-27T13:00:00Z',
    is_manual: false,
  },
  {
    transcription_id: 10,
    case_id: 32445,
    case_number: 'T12341',
    courthouse_name: 'Manchester',
    hearing_date: '2023-06-15',
    transcription_type: 'Antecedents',
    status: 'Approved',
    transcription_urgency: {
      transcription_urgency_id: 1,
      description: 'Up to 3 working days',
      priority_order: 3,
    },
    requested_ts: '2021-09-09T13:00:00Z',
    state_change_ts: '2023-06-27T13:00:00Z',
    is_manual: false,
  },
];

let assignedTranscriptions = [
  {
    transcription_id: 0,
    case_id: 3,
    case_number: 'T2023453499',
    courthouse_name: 'Southwark',
    hearing_date: '2023-07-17',
    transcription_type: 'Antecedents',
    status: 'With Transcriber',
    transcription_urgency: {
      transcription_urgency_id: 1,
      description: 'Up to 12 working days',
      priority_order: 12,
    },
    requested_ts: '2024-01-10T10:00:00Z',
    state_change_ts: '2023-08-13T13:00:00Z',
    is_manual: false,
  },
  {
    transcription_id: 1,
    case_id: 3,
    case_number: 'T2023453423',
    courthouse_name: 'Reading',
    hearing_date: '2023-08-06',
    transcription_type: 'Court Log',
    status: 'With Transcriber',
    transcription_urgency: {
      transcription_urgency_id: 1,
      description: 'Overnight',
      priority_order: 1,
    },
    requested_ts: '2023-08-12T13:00:00Z',
    state_change_ts: '2023-08-13T13:00:00Z',
    is_manual: true,
  },
  {
    transcription_id: 2,
    case_id: 3,
    case_number: 'T2023453422',
    courthouse_name: 'Cardiff',
    hearing_date: '2023-08-07',
    transcription_type: 'Sentencing remarks',
    status: 'With Transcriber',
    transcription_urgency: {
      transcription_urgency_id: 1,
      description: 'Up to 3 working days',
      priority_order: 3,
    },
    requested_ts: '2023-08-21T14:00:00Z',
    state_change_ts: '2023-08-13T13:00:00Z',
    is_manual: false,
  },
  {
    transcription_id: 3,
    case_id: 3,
    case_number: 'T2023453436',
    courthouse_name: 'Newcastle',
    hearing_date: '2023-06-10',
    transcription_type: 'Court Log',
    status: 'Complete',
    requested_ts: '2023-06-27T16:00:00Z',
    state_change_ts: '2023-06-27T13:00:00Z',
    is_manual: true,
  },
  {
    transcription_id: 4,
    case_id: 3,
    case_number: 'T2023453427',
    courthouse_name: 'Reading',
    hearing_date: '2023-08-06',
    transcription_type: 'Court Log',
    status: 'Complete',
    transcription_urgency: {
      transcription_urgency_id: 1,
      description: 'Overnight',
      priority_order: 1,
    },
    requested_ts: '2023-08-12T13:00:00Z',
    state_change_ts: '2023-08-13T13:00:00Z',
    is_manual: true,
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
    {
      transcription_urgency_id: 2,
      description: 'Overnight',
      priority_order: 1,
    },
    {
      transcription_urgency_id: 7,
      description: 'Up to 2 working days',
      priority_order: 2,
    },
    {
      transcription_urgency_id: 4,
      description: 'Up to 3 working days',
      priority_order: 3,
    },
    {
      transcription_urgency_id: 5,
      description: 'Up to 7 working days',
      priority_order: 4,
    },
    {
      transcription_urgency_id: 6,
      description: 'Up to 12 working days',
      priority_order: 5,
    },
    {
      transcription_urgency_id: 3,
      description: 'Other',
      priority_order: 6,
    },
  ]);
});

router.get('/transcriber-counts', (req, res) => {
  res.send({
    unassigned: unassignedTranscriptions.length,
    assigned: assignedTranscriptions.filter((t) => t.status != 'Complete').length,
  });
});

router.get('/transcriber-view', (req, res) => {
  switch (req.query.assigned) {
    case 'true':
      res.send(assignedTranscriptions);
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
    case '4':
      res.status(200).send(mockTranscriptionDetails);
      break;
    default:
      res.status(200).send(mockTranscriptionDetailsTwo);
  }
});

router.patch('/:transcriptId/document', (req, res) => {
  assignedTranscriptions = assignedTranscriptions.map((t) => {
    if (t.transcription_id == req.params.transcriptId) {
      t.status = 'Complete';
    }
    return t;
  });
  res.status(200).send();
});

router.post('/:transcriptId/document', (req, res) => {
  assignedTranscriptions = assignedTranscriptions.map((t) => {
    if (t.transcription_id == req.params.transcriptId) {
      t.status = 'Complete';
    }
    return t;
  });
  res.status(200).send();
});

router.get('/:transcriptId/document', (req, res) => {
  res.sendFile(path.join(__dirname, './download', 'TestDoc.docx'));
});

router.patch('/:transcriptId', (req, res) => {
  if (req.params.transcriptId == 10) {
    res.status(409).send({
      type: 'TRANSCRIPTION_105',
      title: 'The requested transcript has already been actioned',
      status: 409,
    });
    return;
  }
  const transcript = unassignedTranscriptions.find((t) => t.transcription_id == req.params.transcriptId);
  if (transcript) {
    if (req.body.transcription_status_id == 6) {
      transcript.status = 'Complete';
    } else {
      transcript.status = 'With Transcriber';
    }
    assignedTranscriptions.push(transcript);
    unassignedTranscriptions = unassignedTranscriptions.filter((t) => t.transcription_id != req.params.transcriptId);
  }
  res.status(200).send();
});

router.post('/', (req, res) => {
  //If start time is below then return 409
  const exists = req.body.start_date_time.indexOf('00:00:00Z') !== -1 && true;
  const dupe = req.body.transcription_type_id == 0 && true;

  if (exists || dupe) {
    res.status(409).send({ duplicate_transcription_id: 1, detail: 'Duplicated' });
  } else {
    res.send({ transcription_id: 123 });
  }
});

router.get('/', (req, res) => {
  res.send(yourTranscriptionsStub);
});

router.patch('/', (req, res) => {
  let status = 204;
  req.body.forEach((item) => {
    // send 400 error for last requester transcription hide
    if (item.transcription_id === 5) {
      status = 400;
    }
    const index = yourTranscriptionsStub.requester_transcriptions.findIndex(
      (x) => x.transcription_id == item.transcription_id
    );
    if (index >= 0) {
      yourTranscriptionsStub.requester_transcriptions.splice(index, 1);
    }
  });

  res.sendStatus(status);
});

module.exports = { router, mockTranscriptionDetails };
