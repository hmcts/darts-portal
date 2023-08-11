const express = require('express');

const router = express.Router();

router.get('/login-or-refresh', (_, res) => {
  res.header('Location', 'http://localhost:4551/external-user/login');
  res.status(302).send();
});

router.post('/handle-oauth-code', (_, res) => {
  //Objects which reflect express-session module
  const permissions = [{ permissionId: 1, permissionName: 'local dev permissions' }];
  const roles = [
    {
      roleId: 123,
      roleName: 'local dev',
      permissions: permissions,
    },
  ];
  const userState = {
    userId: 123,
    userName: 'localdev01',
    roles: roles,
  };
  const securityToken = {
    userState: userState,
    accessToken: 'fake-jwt',
  };
  res.send(securityToken);
});

router.get('/logout', (_, res) => {
  res.header('Location', 'http://localhost:4551/external-user/handle-logout');
  res.status(302).send();
});

router.get('/login', (_, res) => {
  res.render('external-login');
});

router.get('/handle-logout', (_, res) => {
  res.render('external-logout');
});

//CASES Mock objects
const singleCase = {
  case_id: 1,
  courthouse: 'SWANSEA',
  case_number: 'CASE1001',
  defendants: ['Defendant Dave', 'Defendant Debbie'],
  judges: ['Judge Judy', 'Judge Jones'],
  prosecutors: ['Polly Prosecutor', 'Pipp Prosecutor'],
  defenders: ['Derek Defender', 'Dingo Defender'],
  retain_until: '2023-08-10T11:23:24.858Z',
};

const multipleCases = [
  {
    caseID: 1,
    caseNumber: 'C20220620001',
    courthouse: 'SWANSEA',
    defendants: ['Defendant Dave', 'Defendant Debbie'],
    judges: ['Judge Judy', 'Judge Jones'],
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
    courthouse: 'SLOUGH',
    defendants: ['Defendant Dave', 'Defendant Debbie'],
    judges: ['Judge Judy', 'Judge Jones'],
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
    caseID: 3,
    caseNumber: 'C20220620003',
    courthouse: 'READING',
    defendants: ['Defendant Dave', 'Defendant Debbie'],
    judges: ['Judge Judy', 'Judge Jones'],
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
];

// CASES STUB APIs
// Simple search
router.get('/cases/:caseId', (_, res) => {
  singleCase.case_id = req.params.caseId;

  switch (req.params.caseId) {
    default:
      res.send(singleCase);
      break;
  }
});

// Advanced search stub API
router.get('/cases/search', (_, res) => {
  switch (req.params.case_number) {
    case '501':
      res.status(100).send('TOO_MANY_RESULTS');
      break;
    case 'INVALID_REQUEST':
      res.status(103).send('INVALID_REQUEST');
      break;
    case '0':
      res.status(104).send('CASE_NOT_FOUND');
      break;
    case 'INVALID_COURTHOUSE':
      res.status(105).send('COURTHOUSE_PROVIDED_DOES_NOT_EXIST');
      break;
    default:
      res.send(multipleCases);
      break;
  }
});

//case api error returns
// TOO_MANY_RESULTS(
// "100",
// HttpStatus.BAD_REQUEST,
// "Too many results have been returned. Please change search criteria."
// ),
// NO_CRITERIA_SPECIFIED(
// "101",
// HttpStatus.BAD_REQUEST,
// "No search criteria has been specified, please add at least 1 criteria to search for."
// ),
// CRITERIA_TOO_BROAD(
// "102",
// HttpStatus.BAD_REQUEST,
// "Search criteria is too broad, please add at least 1 more criteria to search for."
// ),
// INVALID_REQUEST(
// "103",
// HttpStatus.BAD_REQUEST,
// "The request is not valid.."
// ),
// CASE_NOT_FOUND(
// "104",
// HttpStatus.NOT_FOUND,
// "The requested case cannot be found"
// ),
// COURTHOUSE_PROVIDED_DOES_NOT_EXIST(
// "105",
// HttpStatus.BAD_REQUEST,
// "Provided courthouse does not exist"
// );

module.exports = router;
