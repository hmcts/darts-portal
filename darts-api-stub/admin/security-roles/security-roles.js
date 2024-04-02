const express = require('express');
const { localArray } = require('../../localArray');

const router = express.Router();

const defaultSecurityRoles = [
  {
    id: 1,
    role_name: 'APPROVER',
    display_name: 'Approver',
    display_state: true,
  },
  {
    id: 2,
    role_name: 'REQUESTOR',
    display_name: 'Requestor',
    display_state: true,
  },
  {
    id: 3,
    role_name: 'JUDGE',
    display_name: 'Judge',
    display_state: true,
  },
  {
    id: 4,
    role_name: 'TRANSCRIBER',
    display_name: 'Transcriber',
    display_state: true,
  },
  {
    id: 5,
    role_name: 'TRANSLATION_QA',
    display_name: 'Translation QA',
    display_state: true,
  },
  {
    id: 6,
    role_name: 'RCJ APPEALS',
    display_name: 'RCJ Appeals',
    display_state: true,
  },
  {
    id: 7,
    role_name: 'ADMIN',
    display_name: 'Admin',
    display_state: true,
  },
  {
    id: 8,
    role_name: 'DONT DISPLAY ROLE',
    display_name: 'Dont Display Role',
    display_state: false,
  },
];

const securityRoles = localArray('securityRoles');
// Clear out old values on restart
securityRoles.value = defaultSecurityRoles;

router.get('/', (_, res) => {
  res.send(securityRoles.value);
});

module.exports = router;
