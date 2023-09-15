const express = require('express');

const router = express.Router();

//CASES Mock objects
const singleCase = {
  case_id: 1,
  courthouse: 'Swansea',
  case_number: 'CASE1001',
  defendants: ['Defendant Dave', 'Defendant Debbie'],
  judges: ['Judge Judy', 'Judge Jones'],
  prosecutors: ['Polly Prosecutor'],
  defenders: ['Derek Defender'],
  reporting_restriction: ['Section 4(2) of the Contempt of Court Act 1981'],
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
  retain_until: '2023-08-10T11:23:24.858Z',
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

const singleCaseTwoHearings = [
  {
    id: 1,
    date: '2023-09-01',
    judges: ['HHJ M. Hussain KC'],
    courtroom: '3',
    transcript_count: 1,
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
        courtroom: '1',
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
    judges: ['Judge Julie'],
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
    case_id: 4,
    case_number: 'C20220620004',
    courthouse: 'Windsor',
    defendants: ['Defendant Dileep', 'Defendant Debs'],
    judges: ['Judge Josephine', 'Judge Jackie'],
    hearings: [
      {
        id: 1,
        date: '2023-08-10',
        courtroom: '3',
        judges: ['Judge Judy'],
      },
      {
        id: 2,
        date: '2033-09-10',
        courtroom: '5',
        judges: ['Judge Judy'],
      },
    ],
  },
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
        courtroom: '1',
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
    judges: ['Judge Julie'],
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
    case_id: 4,
    case_number: 'C20220620004',
    courthouse: 'Windsor',
    defendants: ['Defendant Dileep', 'Defendant Debs'],
    judges: ['Judge Josephine', 'Judge Jackie'],
    hearings: [
      {
        id: 1,
        date: '2023-08-10',
        courtroom: '3',
        judges: ['Judge Judy'],
      },
      {
        id: 2,
        date: '2033-09-10',
        courtroom: '5',
        judges: ['Judge Judy'],
      },
    ],
  },
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
        courtroom: '1',
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
    judges: ['Judge Julie'],
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
    case_id: 4,
    case_number: 'C20220620004',
    courthouse: 'Windsor',
    defendants: ['Defendant Dileep', 'Defendant Debs'],
    judges: ['Judge Josephine', 'Judge Jackie'],
    hearings: [
      {
        id: 1,
        date: '2023-08-10',
        courtroom: '3',
        judges: ['Judge Judy'],
      },
      {
        id: 2,
        date: '2033-09-10',
        courtroom: '5',
        judges: ['Judge Judy'],
      },
    ],
  },
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
        courtroom: '1',
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
    judges: ['Judge Julie'],
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
    case_id: 4,
    case_number: 'C20220620004',
    courthouse: 'Windsor',
    defendants: ['Defendant Dileep', 'Defendant Debs'],
    judges: ['Judge Josephine', 'Judge Jackie'],
    hearings: [
      {
        id: 1,
        date: '2023-08-10',
        courtroom: '3',
        judges: ['Judge Judy'],
      },
      {
        id: 2,
        date: '2033-09-10',
        courtroom: '5',
        judges: ['Judge Judy'],
      },
    ],
  },
];

// Advanced search stub API
router.get('/search', (req, res) => {
  switch (req.query.case_number) {
    case 'CASE_100':
      const resBody100 = {
        type: 'CASE_100',
        title: 'Too many results have been returned. Please change search criteria.',
        status: 400,
      };
      res.status(400).send(resBody100);
      break;
    case 'CASE_101':
      const resBody101 = {
        type: 'CASE_101',
        title: 'No search criteria has been specified, please add at least 1 criteria to search for.',
        status: 400,
      };
      res.status(400).send(resBody101);
      break;
    case 'CASE_102':
      const resBody102 = {
        type: 'CASE_102',
        title: 'Search criteria is too broad, please add at least 1 more criteria to search for.',
        status: 400,
      };
      res.status(400).send(resBody102);
      break;
    case 'CASE_103':
      const resBody103 = {
        type: 'CASE_103',
        title: 'The request is not valid..',
        status: 400,
      };
      res.status(400).send(resBody103);
      break;
    case 'CASE_105':
      const resBody105 = {
        type: 'CASE_105',
        title: 'Provided courthouse does not exist',
        status: 400,
      };
      res.status(400).send(resBody105);
      break;
    case 'SINGLE':
      res.status(200).send([multipleCases[0]]);
      break;
    default:
      res.status(200).send(multipleCases);
      break;
  }
});

// CASES STUB APIs
// Simple search
router.get('/:caseId', (req, res) => {
  singleCase.case_id = req.params.caseId;

  switch (req.params.caseId) {
    case 'CASE_104':
      const resBody104 = {
        type: 'CASE_104',
        title: 'The requested case cannot be found',
        status: 404,
      };
      res.status(400).send(resBody104);
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
// hearings
router.get('/:caseId/hearings', (req, res) => {
  switch (req.params.caseId) {
    case 'CASE_104':
      const resBody104 = {
        type: 'CASE_104',
        title: 'The requested case cannot be found',
        status: 404,
      };
      res.status(400).send(resBody104);
      break;
    case '2':
      res.send(singleCaseHearings);
      break;
    default:
      res.send(singleCaseTwoHearings);
      break;
  }
});

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

router.get('/hearings/:hearingId/events', (req, res) => {
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

module.exports = router;
