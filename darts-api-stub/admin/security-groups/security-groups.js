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
  {
    id: 8,
    security_role_id: 8,
    name: 'Visually Hidden Group',
  },
  {
    id: 9,
    security_role_id: 4,
    name: 'Magic Transcribers Inc',
  },
  {
    id: 10,
    security_role_id: 4,
    name: 'Transcribers R Us',
  },
  {
    id: 11,
    security_role_id: 4,
    name: 'Skriber Tech UK',
  },
];

router.get('/', (req, res) => {
  const roleIds = req?.query?.['role-ids'];
  if (roleIds)
    return res.send(defaultSecurityGroups.filter((securityGroup) => roleIds.includes(securityGroup.security_role_id)));
  res.send(defaultSecurityGroups);
});

module.exports = { router, defaultSecurityGroups };
