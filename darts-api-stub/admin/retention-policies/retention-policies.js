const express = require('express');
const { userIdHasAnyRoles } = require('../../users');
const { SUPER_ADMIN } = require('../../roles');

const router = express.Router();
const retentionPolicies = [
  {
    id: 0,
    name: 'DARTS Permanent Retention v3',
    display_name: 'Legacy Permanent',
    description: 'lorem ipsum',
    fixed_policy_key: 2,
    duration: '1Y0M0D',
    policy_start_at: '2025-01-01T00:00:00Z',
    policy_end_at: '',
  },
  {
    id: 1,
    name: 'DARTS Standard Retention v3',
    display_name: 'Legacy Standard',
    description: 'lorem ipsum',
    fixed_policy_key: 2,
    duration: '1Y6M0D',
    policy_start_at: '2024-01-01T00:00:00Z',
    policy_end_at: '2099-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'DARTS Not Guilty Policy',
    display_name: 'Not Guilty',
    description: 'lorem ipsum',
    fixed_policy_key: 2,
    duration: '1Y6M0D',
    policy_start_at: '2024-01-01T00:00:00Z',
    policy_end_at: '2024-01-31T00:00:00Z',
  },
];

router.get('/', (req, res) => {
  if (!userIdHasAnyRoles([SUPER_ADMIN], req.headers.user_id))
    return res.status(403).send({
      detail: `You do not have permission`,
    });
  res.send(retentionPolicies);
});

module.exports = router;
