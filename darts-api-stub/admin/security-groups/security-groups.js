const express = require('express');

const router = express.Router();

const defaultSecurityGroups = [
  {
    id: 1,
    security_role_id: 1,
    name: 'Judiciary',
  },
  {
    id: 2,
    security_role_id: 2,
    name: 'Opus Transcribers',
  },
  {
    id: 3,
    security_role_id: 3,
    name: 'Super user (DARTS portal)',
  },
  {
    id: 4,
    security_role_id: 4,
    name: 'Admin (Admin portal)',
  },
  {
    id: 5,
    security_role_id: 5,
    name: 'Super admin (Admin portal)',
  },
  {
    id: 6,
    security_role_id: 6,
    name: 'Cardiff Requesters',
  },
  {
    id: 7,
    security_role_id: 7,
    name: 'Cardiff Approvers',
  },
];

router.get('/', (_, res) => {
  res.send(defaultSecurityGroups);
});

module.exports = router;
