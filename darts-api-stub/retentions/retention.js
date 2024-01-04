const express = require('express');

const router = express.Router();

const retentionHistory = [
  {
    retention_last_changed_date: '2023-10-11T00:18:00Z',
    retention_date: '2030-09-15',
    amended_by: 'Judge Phil',
    retention_policy_applied: 'Permanent',
    comments: 'Permanent policy applied',
    status: 'PENDING',
  },
  {
    retention_last_changed_date: '2023-10-12T00:15:00Z',
    retention_date: '2030-09-15',
    amended_by: 'Judge Samuel',
    retention_policy_applied: 'Manual',
    comments: 'Manual policy applied',
    status: 'COMPLETE',
  },
  {
    retention_last_changed_date: '2024-01-13T12:15:00Z',
    retention_date: '2030-09-15',
    amended_by: 'Judge Samuel',
    retention_policy_applied: 'Manual',
    comments: 'Manual policy applied',
    status: 'COMPLETE',
  },
];

router.get('', (req, res) => {
  if (req.query.case_id === '1') {
    res.send(retentionHistory);
  } else {
    res.send([]);
  }
});

module.exports = router;
