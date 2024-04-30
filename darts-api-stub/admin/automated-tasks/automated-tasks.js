const express = require('express');
const router = express.Router();

const automatedTasks = [
  {
    id: 1,
    name: 'Task 1',
    description: 'Simulate 202 success',
    cron_expression: '0 0 1 * * *',
    is_cron_editable: true,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    created_by: 1,
    last_modified_at: '2024-01-01T00:00:00Z',
    last_modified_by: 1,
  },
  {
    id: 2,
    name: 'Task 2',
    description: 'Simulate 404 not found',
    cron_expression: '0 0 2 * * *',
    is_cron_editable: true,
    is_active: false,
    created_at: '2024-01-02T00:00:00Z',
    created_by: 2,
    last_modified_at: '2024-01-02T00:00:00Z',
    last_modified_by: 2,
  },
  {
    id: 3,
    name: 'Task 3',
    description: 'Simulate 409 already running task',
    cron_expression: '0 0 3 * * *',
    is_cron_editable: true,
    is_active: true,
    created_at: '2024-01-03T00:00:00Z',
    created_by: 3,
    last_modified_at: '2024-01-03T00:00:00Z',
    last_modified_by: 3,
  },
];

router.get('/', (_, res) => res.json(automatedTasks));

router.post('/:id/run', (req, res) => {
  const id = req.params.id;

  switch (id) {
    case '1':
      return res.status(202).end();
    case '2':
      return res.sendStatus(404);
    case '3':
      return res.sendStatus(409);
    default:
      return res.sendStatus(404);
  }
});
module.exports = router;
