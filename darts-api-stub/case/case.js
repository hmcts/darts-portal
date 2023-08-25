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
  retain_until: '2023-08-10T11:23:24.858Z',
};

const multipleCases = [
  {
    caseID: 1,
    caseNumber: 'C20220620001',
    courthouse: 'Swansea',
    defendants: ['Defendant Dave'],
    judges: ['Judge Judy'],
    reportingRestriction: 'Section 4(2) of the Contempt of Court Act 1981',
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
    caseID: 2,
    caseNumber: 'C20220620002',
    courthouse: 'Slough',
    defendants: ['Defendant Derren'],
    judges: ['Judge Juniper'],
    hearings: [],
  },
  {
    caseID: 3,
    caseNumber: 'C20220620003',
    courthouse: 'Reading',
    defendants: ['Defendant Darran', 'Defendant Daniel'],
    judges: ['Judge Julie'],
    reportingRestriction: 'Section 4(2) of the Contempt of Court Act 1981',
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
    caseID: 4,
    caseNumber: 'C20220620004',
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
    caseID: 1,
    caseNumber: 'C20220620001',
    courthouse: 'Swansea',
    defendants: ['Defendant Dave'],
    judges: ['Judge Judy'],
    reportingRestriction: 'Section 4(2) of the Contempt of Court Act 1981',
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
    caseID: 2,
    caseNumber: 'C20220620002',
    courthouse: 'Slough',
    defendants: ['Defendant Derren'],
    judges: ['Judge Juniper'],
    hearings: [],
  },
  {
    caseID: 3,
    caseNumber: 'C20220620003',
    courthouse: 'Reading',
    defendants: ['Defendant Darran', 'Defendant Daniel'],
    judges: ['Judge Julie'],
    reportingRestriction: 'Section 4(2) of the Contempt of Court Act 1981',
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
    caseID: 4,
    caseNumber: 'C20220620004',
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
    caseID: 1,
    caseNumber: 'C20220620001',
    courthouse: 'Swansea',
    defendants: ['Defendant Dave'],
    judges: ['Judge Judy'],
    reportingRestriction: 'Section 4(2) of the Contempt of Court Act 1981',
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
    caseID: 2,
    caseNumber: 'C20220620002',
    courthouse: 'Slough',
    defendants: ['Defendant Derren'],
    judges: ['Judge Juniper'],
    hearings: [],
  },
  {
    caseID: 3,
    caseNumber: 'C20220620003',
    courthouse: 'Reading',
    defendants: ['Defendant Darran', 'Defendant Daniel'],
    judges: ['Judge Julie'],
    reportingRestriction: 'Section 4(2) of the Contempt of Court Act 1981',
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
    caseID: 4,
    caseNumber: 'C20220620004',
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
    caseID: 1,
    caseNumber: 'C20220620001',
    courthouse: 'Swansea',
    defendants: ['Defendant Dave'],
    judges: ['Judge Judy'],
    reportingRestriction: 'Section 4(2) of the Contempt of Court Act 1981',
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
    caseID: 2,
    caseNumber: 'C20220620002',
    courthouse: 'Slough',
    defendants: ['Defendant Derren'],
    judges: ['Judge Juniper'],
    hearings: [],
  },
  {
    caseID: 3,
    caseNumber: 'C20220620003',
    courthouse: 'Reading',
    defendants: ['Defendant Darran', 'Defendant Daniel'],
    judges: ['Judge Julie'],
    reportingRestriction: 'Section 4(2) of the Contempt of Court Act 1981',
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
    caseID: 4,
    caseNumber: 'C20220620004',
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

// CASES STUB APIs
// Simple search
router.get('/{caseId}', (req, res) => {
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
    default:
      res.send(singleCase);
      break;
  }
});

// Advanced search stub API
router.get('/search', (req, res) => {
  switch (req.query.case_number) {
    case 'CASE_100':
      const resBody100 = {
        type: 'CASE_100',
        title: 'Too many results have been returned. Please change search criteria.',
        status: 401,//CHANGE BACK TO 400
      };
      res.status(401).send(resBody100);
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

module.exports = router;
