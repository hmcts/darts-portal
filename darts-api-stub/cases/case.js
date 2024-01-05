const express = require('express');

const router = express.Router();

// CASES Mock objects
const singleCase = {
  case_id: 1,
  courthouse: 'Swansea',
  case_number: 'C20220620001',
  defendants: ['Defendant Dave'],
  judges: ['Judge Judy'],
  prosecutors: ['Polly Prosecutor'],
  defenders: ['Derek Defender'],
  reporting_restriction: 'Section 4(2) of the Contempt of Court Act 1981',
  reporting_restrictions: [
    {
      hearing_id: 1,
      event_id: 123,
      event_name: 'Section 4(2) of the Contempt of Court Act 1981',
      event_text: '',
      event_ts: '2023-08-21T09:00:00Z',
    },
    {
      hearing_id: 1,
      event_id: 123,
      event_name: 'Section 39, Children and Young People Act 1933',
      event_text: '',
      event_ts: '2023-08-21T09:00:00Z',
    },
    {
      hearing_id: 2,
      event_id: 123,
      event_name: 'Section 40, Children and Young People Act 1933',
      event_text: '',
      event_ts: '2023-08-21T09:00:00Z',
    },
    {
      hearing_id: 1,
      event_id: 123,
      event_name: 'Restrictions lifted',
      event_text: '',
      event_ts: '2023-08-21T09:00:00Z',
    },
  ],
  retain_until: '2023-08-10T11:23:24.858Z',
};

//CASES Mock objects
const singleCaseTwo = {
  case_id: 2,
  courthouse: 'Reading',
  case_number: 'CASE1001',
  defendants: ['Defendant Dave'],
  judges: ['Judge Judy'],
  prosecutors: ['Patrick Prosecutor'],
  defenders: ['Derek Defender'],
  retain_until: '',
};

const singleCaseHearings = [
  {
    id: 2,
    date: '2023-09-01',
    judges: ['Bob Ross'],
    courtroom: '4',
    transcript_count: 0,
  },
  {
    id: 2,
    date: '2023-03-01',
    judges: ['Defender Dave'],
    courtroom: '2',
    transcript_count: 2,
  },
];

const singleCaseMultiHearings = [
  {
    id: 1,
    date: '2023-09-01',
    judges: ['HHJ M. Hussain KC'],
    courtroom: '3',
    transcript_count: 1,
  },
  {
    id: 2,
    date: '2023-10-10',
    courtroom: '4',
    judges: ['Judge Jonny'],
    transcript_count: 2,
  },
  {
    id: 3,
    date: '2023-10-11',
    courtroom: '9',
    judges: ['Alex Jonny'],
    transcript_count: 3,
  },
  {
    id: 4,
    date: '2023-12-01',
    courtroom: '9',
    judges: ['Zach Malik'],
    transcript_count: 50,
  },
  {
    id: 5,
    date: '2024-01-05',
    courtroom: '9',
    judges: ['Fred Masey'],
    transcript_count: 53,
  },
  {
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
    defendants: ['Defendant Derren'],
    judges: ['Judge Juniper'],
    hearings: [],
  },
  {
    case_id: 3,
    case_number: 'C20220620003',
    courthouse: 'Reading',
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
    defendants: ['Defendant Derren'],
    judges: ['Judge Juniper'],
    hearings: [],
  },
  {
    case_id: 7,
    case_number: 'C20220620007',
    courthouse: 'Reading',
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
    defendants: ['Defendant Derren'],
    judges: ['Judge Juniper'],
    hearings: [],
  },
  {
    case_id: 11,
    case_number: 'C20220620011',
    courthouse: 'Reading',
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
    hearing_date: '2023-10-12',
    type: 'Sentencing remarks',
    requested_on: '',
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
    status: 'Awaiting Authorisation',
  },
  {
    transcription_id: 1,
    hea_id: 2,
    hearing_date: '2023-10-12',
    type: 'Sentencing remarks',
    requested_on: '2023-10-12T00:00:00Z',
    requested_by_name: 'Joe Bloggs',
    status: 'Approved',
  },
  {
    transcription_id: 1,
    hea_id: 2,
    hearing_date: '2023-10-12',
    type: 'Sentencing remarks',
    requested_on: '2023-10-12T00:00:00Z',
    requested_by_name: 'Joe Bloggs',
    status: 'Rejected',
  },
  {
    transcription_id: 1,
    hea_id: 2,
    hearing_date: '2023-10-12',
    type: 'Sentencing remarks',
    requested_on: '2023-10-12T00:00:00Z',
    requested_by_name: 'Joe Bloggs',
    status: 'With Transcriber',
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
    hea_id: 2,
    hearing_date: '2023-10-12',
    type: 'Sentencing remarks',
    requested_on: '2023-10-12T00:00:00Z',
    requested_by_name: 'Joe Bloggs',
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

// Advanced search stub API
router.get('/search', (req, res) => {
  const searchTerms = req.query;
  // expected API response if searching for courthouse only
  if (Object.keys(searchTerms).length === 1 && searchTerms.courthouse) {
    const resBody102 = {
      type: 'CASE_102',
      title: 'Search criteria is too broad, please add at least 1 more criteria to search for.',
      status: 400,
    };
    return res.status(400).send(resBody102);
  }
  // yield many results by doing a judge search "Judge Judy"
  if (Object.keys(searchTerms).length === 1 && searchTerms.judge_name) {
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
  switch (req.query.case_number) {
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
      res.status(200).send(multipleCases.filter((c) => c.case_number === req.query.case_number));
      break;
  }
});

// CASES STUB APIs
// Simple search
router.get('/:caseId', (req, res) => {
  singleCase.case_id = req.params.caseId;

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
      const resBodyAuth100 = {
        type: 'AUTHORISATION_100',
        title: 'User is not authorised for the associated courthouse',
        status: 403,
      };
      res.status(403).send(resBodyAuth100);
      break;
    case '404':
      const resBody104 = {
        type: 'CASE_104',
        title: 'The requested case cannot be found',
        status: 404,
      };
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
  singleCase.case_id = req.params.caseId;

  switch (req.params.caseId) {
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

// CASES STUB APIs
// hearings
router.get('/:caseId/hearings', (req, res) => {
  switch (req.params.caseId) {
    case '404':
      const resBody104 = {
        type: 'CASE_104',
        title: 'The requested case cannot be found',
        status: 404,
      };
      res.status(404).send(resBody104);
      break;
    case '2':
      res.send(singleCaseHearings);
      break;
    default:
      res.send(singleCaseMultiHearings);
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
