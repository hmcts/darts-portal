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

// GET /api/transcriptions
router.get('', (req, res) => {
  switch (req.query?.case_id) {
    case '1':
    case '3':
    case '4':
      res.send(retentionHistory);
      return;
    default:
      res.send([]);
  }
});

// POST /api/transcriptions
router.post('', (req, res) => {
  switch (req.body?.case_id) {
    case '3':
      res.sendStatus(403);
      return;
    case '4':
      res.sendStatus(422);
      return;
    default:
      res.send(req.body);
  }
});

module.exports = router;
