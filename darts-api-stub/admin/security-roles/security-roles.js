const express = require('express');
const { localArray } = require('../../localArray');

const router = express.Router();

const defaultSecurityRoles = [
  {
    id: 1,
    role_name: 'Approver',
    display_name: 'Approver',
    display_state: true,
  },
  {
    id: 2,
    role_name: 'Requestor',
    display_name: 'Requestor',
    display_state: true,
  },
  {
    id: 3,
    role_name: 'Judge',
    display_name: 'Judge',
    display_state: true,
  },
  {
    id: 4,
    role_name: 'Transcriber',
    display_name: 'Transcriber',
    display_state: true,
  },
  {
    id: 5,
    role_name: 'Translation QA',
    display_name: 'Translation QA',
    display_state: true,
  },
  {
    id: 6,
    role_name: 'RCJ Appeals',
    display_name: 'RCJ Appeals',
    display_state: true,
  },
  {
    id: 7,
    role_name: 'Admin',
    display_name: 'Admin',
    display_state: true,
  },
  {
    id: 8,
    role_name: 'Dont Display Role',
    display_name: 'Dont Display Role',
    display_state: false,
  },
];

const securityRoles = localArray('securityRoles');
// Clear out old values on restart
securityRoles.value = defaultSecurityRoles.map((securityRole) => ({
  ...securityRole,
  role_name: securityRole.display_name.toUpperCase(),
}));

router.get('/', (_, res) => {
  res.send(securityRoles.value);
});

module.exports = router;
