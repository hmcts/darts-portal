const express = require('express');
const { DateTime } = require('luxon');
const router = express.Router();

const defaultAutomatedTasks = [
  {
    id: 1,
    name: 'Task 1',
    description: 'Simulate 202 success (next cron executions: 200)',
    cron_expression: '0 0 1 * * *',
    is_cron_editable: true,
    batch_size: 1000,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    created_by: 1,
    last_modified_at: '2024-01-01T00:00:00Z',
    last_modified_by: 2,
    rpo_csv_start_hour: 24,
    rpo_csv_end_hour: 72,
    arm_attribute_type: 'RPO',
  },
  {
    id: 2,
    name: 'Task 2',
    description: 'Simulate 404 not found (next cron executions: 400)',
    cron_expression: '0 0 2 * * *',
    is_cron_editable: true,
    batch_size: 500,
    is_active: true,
    created_at: '2024-01-02T00:00:00Z',
    created_by: 2,
    last_modified_at: '2024-01-02T00:00:00Z',
    last_modified_by: 2,
    arm_replay_start_ts: '2024-02-02T02:00:00Z',
    arm_replay_end_ts: '2024-02-02T03:00:00Z',
    arm_attribute_type: 'REPLAY',
  },
  {
    id: 3,
    name: 'Task 3',
    description: 'Simulate 409 already running task (next cron executions: 404)',
    cron_expression: '0 0 3 * * *',
    is_cron_editable: true,
    batch_size: 250,
    is_active: true,
    created_at: '2024-01-03T00:00:00Z',
    created_by: 3,
    last_modified_at: '2024-01-03T00:00:00Z',
    last_modified_by: 4,
  },
  {
    id: 4,
    name: 'Task 4',
    description: 'Simulate running inactive task (next cron executions: 500)',
    cron_expression: '0 0 4 * * *',
    is_cron_editable: true,
    batch_size: 100,
    is_active: false,
    created_at: '2024-01-04T00:00:00Z',
    created_by: 4,
    last_modified_at: '2024-01-04T00:00:00Z',
    last_modified_by: 5,
  },
];

let automatedTasks = structuredClone(defaultAutomatedTasks);

router.get('/reset', (req, res) => {
  automatedTasks = structuredClone(defaultAutomatedTasks);
  res.sendStatus(200);
});

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
    case '4':
      return res.status(202).end();
    default:
      return res.sendStatus(404);
  }
});

router.post('/:id/edit-cron-expression', (req, res) => {
  const id = req.params.id;
  const cronExpression = req.body?.cron_expression;

  setTimeout(() => {
    switch (id) {
      case '1':
        // Use first character of cron expression to determine month offset for next execution time, default to December if not a number 1-9
        const month = /^[1-9]$/.test(cronExpression?.trim()?.[0]) ? Number(cronExpression.trim()[0]) - 1 : 11;
        const nextExecutions = Array.from({ length: 15 }, (_, i) => {
          const scheduledAt = DateTime.fromISO('2025-01-01T08:00:00Z')
            .plus({ days: i })
            .plus({ months: month })
            .toISO();
          return { execution_number: i + 1, scheduled_at: scheduledAt };
        });
        return res.status(200).json(nextExecutions);
      case '2':
        //Invalid cron expression, return 400
        return res.status(400).json({ status: 400 });
      case '3':
        //Automated task not found, return 404
        return res.status(404).json({ status: 404 });
      case '4':
        //Unexpected error, return 500
        return res.status(500).json({ status: 500 });
      default:
        return res.status(404).json({ status: 404 });
    }
  }, 400);
});

router.patch('/:id', (req, res) => {
  const id = req.params.id;
  const { is_active, batch_size, rpo_csv_start_hour, rpo_csv_end_hour, arm_replay_start_ts, arm_replay_end_ts } =
    req.body;

  const task = automatedTasks.find((task) => task.id === Number(id));
  if (!task) return res.sendStatus(404);

  if (batch_size) task.batch_size = Number(batch_size);

  if (rpo_csv_start_hour) task.rpo_csv_start_hour = rpo_csv_start_hour;
  if (rpo_csv_end_hour) task.rpo_csv_end_hour = rpo_csv_end_hour;
  if (arm_replay_start_ts) task.arm_replay_start_ts = arm_replay_start_ts;
  if (arm_replay_end_ts) task.arm_replay_end_ts = arm_replay_end_ts;

  if (is_active != undefined) task.is_active = is_active;

  task.last_modified_at = DateTime.now().toISO();
  task.last_modified_by = 3;

  return res.json({ ...task });
});

router.patch('/:id/edit-cron-expression', (req, res) => {
  const id = req.params.id;
  const { cron_expression } = req.body;

  const task = automatedTasks.find((task) => task.id === Number(id));
  if (!task) return res.sendStatus(404);

  if (cron_expression) task.cron_expression = cron_expression;

  task.last_modified_at = DateTime.now().toISO();
  task.last_modified_by = 3;

  return res.json({ ...task });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  const task = automatedTasks.find((task) => task.id === Number(id));

  if (!task) {
    return res.sendStatus(404);
  }

  return res.json(task);
});

module.exports = router;
