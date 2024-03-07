const express = require('express');

const router = express.Router();

const defaultSecurityRoles = [
  {
    id: 1,
    display_name: 'Approver',
    display_state: true,
  },
  {
    id: 2,
    display_name: 'Requestor',
    display_state: true,
  },
  {
    id: 3,
    display_name: 'Judge',
    display_state: true,
  },
  {
    id: 4,
    display_name: 'Transcriber',
    display_state: true,
  },
  {
    id: 5,
    display_name: 'Translation QA',
    display_state: true,
  },
  {
    id: 6,
    display_name: 'RCJ Appeals',
    display_state: true,
  },
  {
    id: 7,
    display_name: 'Admin',
    display_state: true,
  },
  {
    id: 8,
    display_name: 'Dont Display Role',
    display_state: false,
  },
];

router.get('/', (_, res) => {
  res.send(
    defaultSecurityRoles.map((securityRole) => ({ ...securityRole, name: securityRole.display_name.toUpperCase() }))
  );
});

module.exports = router;
