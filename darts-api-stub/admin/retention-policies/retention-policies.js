const express = require('express');
const { userIdHasAnyRoles } = require('../../users');
const { SUPER_ADMIN } = require('../../roles');
const { DateTime } = require('luxon');
const router = express.Router();

const NON_UNIQUE_POLICY_NAME = 'NON_UNIQUE_POLICY_NAME';
const NON_UNIQUE_POLICY_DISPLAY_NAME = 'NON_UNIQUE_POLICY_DISPLAY_NAME';
const NON_UNIQUE_FIXED_POLICY_KEY = 'NON_UNIQUE_FIXED_POLICY_KEY';

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

router.post('/', (req, res) => {
  if (!userIdHasAnyRoles([SUPER_ADMIN], req.headers.user_id))
    return res.status(403).send({
      detail: `You do not have permission`,
    });

  if (req.body.name === NON_UNIQUE_POLICY_NAME) {
    return res.status(400).send({
      type: NON_UNIQUE_POLICY_NAME,
    });
  }

  if (req.body.display_name === NON_UNIQUE_POLICY_DISPLAY_NAME) {
    return res.status(400).send({
      type: NON_UNIQUE_POLICY_DISPLAY_NAME,
    });
  }

  if (req.body.fixed_policy_key === NON_UNIQUE_FIXED_POLICY_KEY) {
    return res.status(400).send({
      type: NON_UNIQUE_FIXED_POLICY_KEY,
    });
  }

  const newPolicy = req.body;
  newPolicy.id = retentionPolicies.length;
  // convert policy_start_at to DateTime
  const policyStart = DateTime.fromISO(newPolicy.policy_start_at);

  // split duration string ('3Y6M12D') into years, months, days
  const [years, months, days] = newPolicy.duration.split(/[YMD]/).map(Number);

  // add duration to policy_start_at
  newPolicy.policy_end_at = policyStart.plus({ years, months, days });

  retentionPolicies.push(newPolicy);
  res.send(newPolicy);
});

module.exports = router;
