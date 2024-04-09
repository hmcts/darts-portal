const express = require('express');

const router = express.Router();
const { localArray } = require('../localArray');
const { getLatestDatefromKey } = require('../utils/date');
const { getRolesByUserId } = require('../users');

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

const getLatestRetentionDate = (caseId) => {
  const retentionHistory = localArray('retentionHistory');
  const rows = retentionHistory.value.filter((history) => history.case_id === parseInt(caseId));
  const latest = getLatestDatefromKey(rows, 'retention_last_changed_date');
  return latest?.retention_date;
};

const getLatestRetentionChange = (caseId) => {
  const retentionHistory = localArray('retentionHistory');
  const rows = retentionHistory.value.filter((history) => history.case_id === parseInt(caseId));
  const latest = getLatestDatefromKey(rows, 'retention_last_changed_date');
  return latest?.retention_last_changed_date;
};

// CASES Mock objects
const singleCase = {
  case_id: 1,
  courthouse: 'Swansea',
  courthouse_id: 1,
  case_number: 'C20220620001',
  defendants: ['Defendant Dave'],
  judges: ['Judge Judy'],
  prosecutors: ['Polly Prosecutor'],
  defenders: ['Derek Defender'],
  retain_until_date_time: getLatestRetentionDate(1),
  case_closed_date_time: '2023-08-15T14:57:24.858Z',
  retention_date_time_applied: getLatestRetentionChange(1),
  retention_policy_applied: 'Manual',
  reporting_restrictions: [
    {
      hearing_id: 1,
      event_id: 1,
      event_name: 'Section 4(2) of the Contempt of Court Act 1981',
      event_text: '',
      event_ts: '2023-09-01T09:00:00Z',
    },
    {
      hearing_id: 1,
      event_id: 2,
      event_name: 'Section 39, Children and Young People Act 1933',
      event_text: '',
      event_ts: '2023-09-01T10:00:00Z',
    },
    {
      hearing_id: 2,
      event_id: 3,
      event_name: 'Section 40, Children and Young People Act 1933',
      event_text: '',
      event_ts: '2023-10-10T09:00:00Z',
    },
    {
      hearing_id: 1,
      event_id: 4,
      event_name: 'Restrictions lifted',
      event_text: '',
      event_ts: '2023-09-01T09:00:00Z',
    },
    {
      hearing_id: 3,
      event_id: 5,
      event_name: 'Section 2 of the Sexual Offenders (Amendment) Act 1992',
      event_text: '',
      event_ts: '2023-10-11T09:00:00Z',
    },
  ],
  retain_until: '2023-08-10T11:23:24.858Z',
};

//CASES Mock objects
const singleCaseTwo = {
  case_id: 2,
  courthouse: 'Reading',
  courthouse_id: 2,
  case_number: 'CASE1001',
  defendants: ['Defendant Dave'],
  judges: ['Judge Judy'],
  prosecutors: ['Patrick Prosecutor'],
  defenders: ['Derek Defender'],
};

const defaultCaseHearings = [
  {
    case_id: 2,
    id: 2,
    date: '2023-09-01',
    judges: ['Bob Ross'],
    courtroom: '4',
    transcript_count: 0,
  },
  {
    case_id: 2,
    id: 2,
    date: '2023-03-01',
    judges: ['Defender Dave'],
    courtroom: '2',
    transcript_count: 2,
  },
  {
    case_id: 1,
    id: 1,
    date: '2023-09-01',
    judges: ['HHJ M. Hussain KC'],
    courtroom: '3',
    transcript_count: 1,
  },
  {
    case_id: 1,
    id: 2,
    date: '2023-10-10',
    courtroom: '4',
    judges: ['Judge Jonny'],
    transcript_count: 2,
  },
  {
    case_id: 1,
    id: 3,
    date: '2023-10-11',
    courtroom: '9',
    judges: ['Alex Jonny'],
    transcript_count: 3,
  },
  {
    case_id: 1,
    id: 4,
    date: '2023-12-01',
    courtroom: '9',
    judges: ['Zach Malik'],
    transcript_count: 50,
  },
  {
    case_id: 1,
    id: 5,
    date: '2024-01-05',
    courtroom: '9',
    judges: ['Fred Masey'],
    transcript_count: 53,
  },
  {
    case_id: 1,
    id: 6,
    date: '2024-03-10',
    courtroom: '11',
    judges: ['Zach Attack'],
    transcript_count: 51,
  },
];

const multipleCases = [
  {
    case_id: 1,
    case_number: 'C20220620001',
    courthouse_id: 1,
    courthouse: 'Swansea',
    defendants: ['Defendant Dave'],
    judges: ['Judge Judy'],
    reporting_restriction: 'Section 4(2) of the Contempt of Court Act 1981',
    hearings: [
      {
        id: 1,
        date: '2023-08-10',
        courtroom: '3',
        judges: ['Judge Judy'],
      },
    ],
  },
  {
    case_id: 2,
    case_number: 'C20220620002',
    courthouse: 'Slough',
    courthouse_id: 2,
    defendants: ['Defendant Derren'],
    judges: ['Judge Juniper'],
    hearings: [],
  },
  {
    case_id: 3,
    case_number: 'C20220620003',
    courthouse: 'Reading',
    courthouse_id: 3,
    defendants: ['Defendant Darran', 'Defendant Daniel'],
    judges: ['Judge Julie', 'Judge Judy'],
    reporting_restriction: 'Section 4(2) of the Contempt of Court Act 1981',
    hearings: [
      {
        id: 2,
        date: '2023-08-10',
        courtroom: '3',
        judges: ['Judge Judy'],
      },
    ],
  },
  {
    case_id: 4,
    case_number: 'C20220620004',
    courthouse: 'Windsor',
    courthouse_id: 4,
    defendants: ['Defendant Dileep', 'Defendant Debs'],
    judges: ['Judge Josephine', 'Judge Jackie'],
    hearings: [
      {
        id: 3,
        date: '2023-08-10',
        courtroom: '3',
        judges: ['Judge Judy'],
      },
      {
        id: 4,
        date: '2033-09-10',
        courtroom: '5',
        judges: ['Judge Judy'],
      },
    ],
  },
  {
    case_id: 5,
    case_number: 'C20220620005',
    courthouse: 'Swansea',
    courthouse_id: 5,
    defendants: ['Defendant Dave'],
    judges: ['Judge Judy'],
    reporting_restriction: 'Section 4(2) of the Contempt of Court Act 1981',
    hearings: [
      {
        id: 5,
        date: '2023-08-10',
        courtroom: '1',
        judges: ['Judge Judy'],
      },
    ],
  },
  {
    case_id: 6,
    case_number: 'C20220620006',
    courthouse: 'Slough',
    courthouse_id: 6,
    defendants: ['Defendant Derren'],
    judges: ['Judge Juniper'],
    hearings: [],
  },
  {
    case_id: 7,
    case_number: 'C20220620007',
    courthouse: 'Reading',
    courthouse_id: 7,
    defendants: ['Defendant Darran', 'Defendant Daniel'],
    judges: ['Judge Julie', 'Judge Judy'],
    reporting_restriction: 'Section 4(2) of the Contempt of Court Act 1981',
    hearings: [
      {
        id: 6,
        date: '2023-08-10',
        courtroom: '3',
        judges: ['Judge Judy'],
      },
    ],
  },
  {
    case_id: 8,
    case_number: 'C20220620008',
    courthouse: 'Windsor',
    courthouse_id: 8,
    defendants: ['Defendant Dileep', 'Defendant Debs'],
    judges: ['Judge Josephine', 'Judge Jackie'],
    hearings: [
      {
        id: 7,
        date: '2023-08-10',
        courtroom: '3',
        judges: ['Judge Judy'],
      },
      {
        id: 8,
        date: '2033-09-10',
        courtroom: '5',
        judges: ['Judge Judy'],
      },
    ],
  },
  {
    case_id: 9,
    case_number: 'C20220620009',
    courthouse: 'Swansea',
    courthouse_id: 9,
    defendants: ['Defendant Dave'],
    judges: ['Judge Judy'],
    reporting_restriction: 'Section 4(2) of the Contempt of Court Act 1981',
    hearings: [
      {
        id: 9,
        date: '2023-08-10',
        courtroom: '1',
        judges: ['Judge Judy'],
      },
    ],
  },
  {
    case_id: 10,
    case_number: 'C20220620010',
    courthouse: 'Slough',
    courthouse_id: 10,
    defendants: ['Defendant Derren'],
    judges: ['Judge Juniper'],
    hearings: [],
  },
  {
    case_id: 11,
    case_number: 'C20220620011',
    courthouse: 'Reading',
    courthouse_id: 11,
    defendants: ['Defendant Darran', 'Defendant Daniel'],
    judges: ['Judge Julie', 'Judge Judy'],
    reporting_restriction: 'Section 4(2) of the Contempt of Court Act 1981',
    hearings: [
      {
        id: 10,
        date: '2023-08-10',
        courtroom: '3',
        judges: ['Judge Judy'],
      },
    ],
  },
  {
    case_id: 12,
    case_number: 'C20220620012',
    courthouse: 'Windsor',
    courthouse_id: 12,
    defendants: ['Defendant Dileep', 'Defendant Debs'],
    judges: ['Judge Josephine', 'Judge Jackie'],
    hearings: [
      {
        id: 11,
        date: '2023-08-10',
        courtroom: '3',
        judges: ['Judge Judy'],
      },
      {
        id: 12,
        date: '2033-09-10',
        courtroom: '5',
        judges: ['Judge Judy'],
      },
    ],
  },
  {
    case_id: 13,
    case_number: 'C20220620013',
    courthouse: 'Swansea',
    courthouse_id: 13,
    defendants: ['Defendant Dave'],
    judges: ['Judge Judy'],
    reporting_restriction: 'Section 4(2) of the Contempt of Court Act 1981',
    hearings: [
      {
        id: 13,
        date: '2023-08-10',
        courtroom: '1',
        judges: ['Judge Judy'],
      },
    ],
  },
  {
    case_id: 14,
    case_number: 'C20220620014',
    courthouse: 'Slough',
    defendants: ['Defendant Derren'],
    judges: ['Judge Juniper'],
    hearings: [],
  },
  {
    case_id: 15,
    case_number: 'C20220620015',
    courthouse: 'Reading',
    defendants: ['Defendant Darran', 'Defendant Daniel'],
    judges: ['Judge Julie', 'Judge Judy'],
    reporting_restriction: 'Section 4(2) of the Contempt of Court Act 1981',
    hearings: [
      {
        id: 14,
        date: '2023-08-10',
        courtroom: '3',
        judges: ['Judge Judy'],
      },
    ],
  },
  {
    case_id: 16,
    case_number: 'C20220620016',
    courthouse: 'Windsor',
    defendants: ['Defendant Dileep', 'Defendant Debs'],
    judges: ['Judge Josephine', 'Judge Jackie'],
    hearings: [
      {
        id: 15,
        date: '2023-08-10',
        courtroom: '3',
        judges: ['Judge Judy'],
      },
      {
        id: 16,
        date: '2033-09-10',
        courtroom: '5',
        judges: ['Judge Judy'],
      },
    ],
  },
];

const transcriptOne = [
  {
    transcription_id: 1,
    hearing_id: 2,
    hearing_date: '2023-10-13',
    type: 'Sentencing remarks',
    requested_on: '2024-01-01T00:00:00Z',
    requested_by_name: 'Scott Smith',
    status: 'Requested',
  },
  {
    transcription_id: 1,
    hearing_id: 2,
    hearing_date: '2023-10-12',
    type: 'Court log',
    requested_on: '2024-01-02T00:00:00Z',
    requested_by_name: 'Chris Evans',
    status: 'Awaiting Authorisation',
  },
  {
    transcription_id: 1,
    hea_id: 2,
    hearing_date: '2023-10-11',
    type: 'Sentencing remarks',
    requested_on: '2024-01-10T00:00:00Z',
    requested_by_name: 'Carl Edwards',
    status: 'Approved',
  },
  {
    transcription_id: 1,
    hea_id: 2,
    hearing_date: '2023-10-10',
    type: 'Antecedents',
    requested_on: '2023-10-12T00:00:00Z',
    requested_by_name: 'Rhys Jones',
    status: 'Rejected',
  },
  {
    transcription_id: 1,
    hea_id: 2,
    hearing_date: '2023-10-15',
    type: 'Sentencing remarks',
    requested_on: '2023-11-11T00:00:00Z',
    requested_by_name: 'Jarred Collins',
    status: 'With Transcriber',
  },
  {
    transcription_id: 1,
    hea_id: 2,
    hearing_date: '2023-10-01',
    type: 'Mitigation',
    requested_on: '2023-11-12T00:00:00Z',
    requested_by_name: 'Gary Jones',
    status: 'Complete',
  },
  {
    transcription_id: 1,
    hea_id: 2,
    hearing_date: '2023-10-29',
    type: 'Sentencing remarks',
    requested_on: '2023-10-16T00:00:00Z',
    requested_by_name: 'Phil Davies',
    status: 'Closed',
  },
];

const transcriptTwo = [
  {
    transcription_id: 1,
    hea_id: 2,
    hearing_date: '2023-10-12',
    type: 'Sentencing remarks',
    requested_on: '2023-10-12T00:00:00Z',
    requested_by_name: 'Joe Bloggs',
    status: 'Requested',
  },
  {
    transcription_id: 1,
    hea_id: 2,
    hearing_date: '2023-10-12',
    type: 'Sentencing remarks',
    requested_on: '2023-10-12T00:00:00Z',
    requested_by_name: 'Joe Bloggs',
    status: 'Awaiting Authorisation',
  },
  {
    transcription_id: 1,
    hea_id: 2,
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
    status: 'Rejected',
  },
];

const defaultAnnotations = [
  {
    case_id: 1,
    annotation_id: 2,
    hearing_id: 3,
    hearing_date: '2023-10-11',
    annotation_ts: '2023-10-06T12:00:00.000Z',
    annotation_text: 'A summary notes of this annotation...',
    annotation_documents: [
      {
        annotation_document_id: 1,
        file_name: 'Annotation.doc',
        file_type: 'DOC',
        uploaded_by: 'Mr User McUserFace',
        uploaded_ts: '2023-12-15T12:00:00.000Z',
      },
    ],
  },
  {
    case_id: 1,
    annotation_id: 3,
    hearing_id: 4,
    hearing_date: '2023-12-01',
    annotation_ts: '2023-12-16T12:00:00.000Z',
    annotation_text: 'A summary note of this annotation...',
    annotation_documents: [
      {
        annotation_document_id: 4,
        file_name: 'AnnotationBeta.doc',
        file_type: 'DOCX',
        uploaded_by: 'Mrs Jane Ince',
        uploaded_ts: '2024-01-16T12:00:00.000Z',
      },
    ],
  },
  {
    case_id: 2,
    annotation_id: 1,
    hearing_id: 2,
    hearing_date: '2023-09-01',
    annotation_ts: '2023-12-15T12:00:00.000Z',
    annotation_text: 'A summary notes of this annotation...',
    annotation_documents: [
      {
        annotation_document_id: 1,
        file_name: 'Annotation.doc',
        file_type: 'DOC',
        uploaded_by: 'Mr User McUserFace',
        uploaded_ts: '2023-12-15T12:00:00.000Z',
      },
    ],
  },
];

const hearings = localArray('hearings');
// Clear out old values on restart
hearings.value = defaultCaseHearings;

const getHearingsByCaseId = (caseId) => {
  const filteredHearings = hearings.value.filter((hearing) => hearing.case_id === parseInt(caseId));
  return filteredHearings.map((record) => {
    // Remove case_id key
    const { case_id, ...filteredHearing } = record;
    return filteredHearing;
  });
};

const annotations = localArray('annotations');
// Clear out old values on restart
annotations.value = defaultAnnotations;

const getAnnotationsByCaseId = (caseId) => {
  const filteredAnnotations = annotations.value.filter((annotation) => annotation.case_id === parseInt(caseId));
  // Remove case_id key
  return filteredAnnotations.map((record) => {
    const { case_id, ...filteredAnnotation } = record;
    return filteredAnnotation;
  });
};

// Advanced search stub API
router.post('/search', (req, res) => {
  const searchTerms = req.body;
  const notNullProperties = Object.keys(searchTerms).filter((x) => searchTerms[x] != undefined).length;
  // expected API response if searching for courthouse only
  if (notNullProperties === 1 && searchTerms.courthouse) {
    const resBody102 = {
      type: 'CASE_102',
      title: 'Search criteria is too broad, please add at least 1 more criteria to search for.',
      status: 400,
    };
    return res.status(400).send(resBody102);
  }
  // yield many results by doing a judge search "Judge Judy"
  if (notNullProperties === 1 && searchTerms.judge_name) {
    return res
      .status(200)
      .send(
        multipleCases.filter(
          (c) =>
            c.judges.includes(searchTerms.judge_name) ||
            c.hearings.find((h) => h.judges.includes(searchTerms.judge_name))
        )
      );
  }
  switch (req.body.case_number) {
    case 'INTERNAL_SERVER_ERROR':
      res.sendStatus(500);
      break;
    case 'TOO_MANY_RESULTS':
      const resBody100 = {
        type: 'CASE_100',
        title: 'Too many results have been returned. Please change search criteria.',
        status: 400,
      };
      res.status(400).send(resBody100);
      break;
    case 'UNKNOWN_ERROR':
      const resBody103 = {
        type: 'CASE_103',
        title: 'The request is not valid..',
        status: 400,
      };
      res.status(400).send(resBody103);
      break;
    case 'ALL':
      res.status(200).send(multipleCases);
      break;
    default:
      res.status(200).send(multipleCases.filter((c) => c.case_number === req.body.case_number));
      break;
  }
});

// CASES STUB APIs
// Simple search
router.get('/:caseId', (req, res) => {
  singleCase.case_id = req.params.caseId;
  singleCase.retain_until_date_time = getLatestRetentionDate(singleCase.case_id);
  singleCase.retention_date_time_applied = getLatestRetentionChange(singleCase.case_id);

  switch (req.params.caseId) {
    // this is returned by the API when a non-integer is passed as the case ID
    case '400':
      const resBodyBadReq = {
        title: 'Bad request',
        status: 400,
      };
      res.status(400).send(resBodyBadReq);
      break;
    case '403':
      res.status(403).send(resBodyAuth100);
      break;
    case '404':
      res.status(404).send(resBody104);
      break;
    case '500':
      res.sendStatus(500);
      break;
    case '2':
      res.send(singleCaseTwo);
      break;
    default:
      res.send(singleCase);
      break;
  }
});

// CASES STUB APIs
// transcripts stub data
router.get('/:caseId/transcripts', (req, res) => {
  // if the user only has TRANSLATION_QA role, the respond with 403
  const userRoles = getRolesByUserId(parseInt(req.headers.user_id, 10));
  if (userRoles?.length === 1 && userRoles[0].roleName === 'TRANSLATION_QA') {
    return res.status(403).send(resBodyAuth100);
  }

  singleCase.case_id = req.params.caseId;
  singleCase.retain_until_date_time = getLatestRetentionDate(singleCase.case_id);
  singleCase.retention_date_time_applied = getLatestRetentionChange(singleCase.case_id);

  switch (req.params.caseId) {
    case '404':
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

// CASES STUB APIs
// hearings
router.get('/:caseId/hearings', (req, res) => {
  const caseId = req.params?.caseId;
  switch (caseId) {
    case undefined:
    case '404':
      res.status(404).send(resBody104);
      break;
    case '2':
      res.send(getHearingsByCaseId(caseId));
      break;
    default:
      // Just leaving this as 1 at the moment to replicate
      // existing data, for potential future expansion
      const caseHearings = getHearingsByCaseId(1);
      res.send(caseHearings);
      break;
  }
});

// CASES STUB APIs
// annotations stub
router.get('/:caseId/annotations', (req, res) => {
  const caseId = req.params?.caseId;
  switch (caseId) {
    case undefined:
    case '404':
      res.status(404).send(resBody104);
      break;
    default:
      const annotations = getAnnotationsByCaseId(caseId);
      res.send(annotations);
      break;
  }
});

// TODO: is this correct?
router.get('/hearings/:hearingId/audios', (req, res) => {
  switch (req.params.hearingId) {
    case '1':
      const body1 = [
        {
          id: 1,
          media_start_timestamp: '2023-07-31T02:32:24.620Z',
          media_end_timestamp: '2023-07-31T14:32:24.620Z',
        },
        {
          id: 2,
          media_start_timestamp: '2023-07-31T04:30:24.620Z',
          media_end_timestamp: '2023-07-31T14:32:24.620Z',
        },
        {
          id: 3,
          media_start_timestamp: '2023-07-31T05:32:24.620Z',
          media_end_timestamp: '2023-07-31T14:32:24.620Z',
        },
      ];
      res.send(body1);
      break;
    case '2':
      const body2 = [
        {
          id: 4,
          media_start_timestamp: '2023-07-31T14:32:24.620Z',
          media_end_timestamp: '2023-07-31T14:32:24.620Z',
        },
      ];
      res.send(body2);
      break;
    default:
      res.send([]);
      break;
  }
});

module.exports = router;
