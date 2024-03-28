const express = require('express');
const { DateTime } = require('luxon');
const router = express.Router();

const { localArray } = require('../localArray');
const { getEarliestDatefromKey, getLatestDatefromKey } = require('../utils/date');
const { JUDGE, SUPER_ADMIN } = require('../roles');
const { userIdhasAnyRoles, getUserNamebyUserId } = require('../users');

const dateFormat = 'yyyy-MM-dd';
const defaultRetentionHistory = [
  {
    case_id: 1,
    retention_last_changed_date: '2023-10-11T00:18:00Z',
    retention_date: '2025-12-15',
    amended_by: 'Judge Phil',
    retention_policy_applied: 'Permanent',
    comments: 'Permanent policy applied',
    status: 'PENDING',
  },
  {
    case_id: 1,
    retention_last_changed_date: '2023-10-12T00:15:00Z',
    retention_date: '2030-07-10',
    amended_by: 'Judge Samuel',
    retention_policy_applied: 'Manual',
    comments: 'Manual policy applied',
    status: 'COMPLETE',
  },
  {
    case_id: 1,
    retention_last_changed_date: '2024-01-13T12:15:00Z',
    retention_date: '2030-09-15',
    amended_by: 'Judge Samuel',
    retention_policy_applied: 'Manual',
    comments: 'Manual policy applied',
    status: 'COMPLETE',
  },
  {
    case_id: 5,
    retention_last_changed_date: '2024-01-13T12:15:00Z',
    retention_date: '2066-03-25',
    amended_by: 'Judge Samuel',
    retention_policy_applied: 'Manual',
    comments: 'Manual policy applied',
    status: 'COMPLETE',
  },
];

const retentionHistory = localArray('retentionHistory');
// Clear out old values on restart
retentionHistory.value = defaultRetentionHistory;

const getRetentionHistoryByCaseId = (caseId) => {
  const filteredRetentionHistory = retentionHistory.value.filter((history) => history.case_id === parseInt(caseId));
  // Remove case_id key
  return filteredRetentionHistory.map((record) => {
    const { case_id, ...filtered } = record;
    return filtered;
  });
};

// GET /api/retentions
router.get('', (req, res) => {
  if (req.query?.case_id) {
    res.send(getRetentionHistoryByCaseId(req.query?.case_id));
    return;
  }
  // Otherwise return it all
  res.send(retentionHistory.value);
});

// POST /api/retentions
router.post('', (req, res) => {
  switch (req.body?.case_id) {
    case undefined:
      res.status(400).send("'case_id' is required");
      return;
    case '3':
      res.sendStatus(403);
      return;
    case '4':
      res.sendStatus(422);
      return;
    default:
      const permanentCount = {
        years: 99,
        months: 0,
        days: 0,
      };
      const { case_id } = req.body;
      const retention = {};
      // We need to work out date in however much time past the permanent duration for validation
      // or if is_permanent_retention included
      const permanent_date = DateTime.now().plus(permanentCount);
      if (req.body?.is_permanent_retention) {
        retention.retention_date = permanent_date;
      } else {
        // Use the date that should be included
        retention.retention_date = DateTime.fromFormat(req.body.retention_date, dateFormat).startOf('day');
        if (!retention.retention_date.isValid) {
          // If date is not in right format or not included, return 400
          res.status(400).send({
            title: 'Bad request',
            detail: `retention_date not in required format: '${dateFormat}'`,
          });
          return;
        }
        if (retention.retention_date > permanent_date) {
          // If date is more than 99 years
          res.status(422).send({
            title: 'The retention date being applied is too late.',
            detail: `caseId '${case_id}' must have a retention date before the maximum retention date '${permanent_date.toFormat(dateFormat)}'.`,
            max_duration: `${permanentCount.years}Y${permanentCount.months}M${permanentCount.days}D`,
          });
          return;
        }
        const earliestRetentionDate = DateTime.fromISO(
          getEarliestDatefromKey(retentionHistory.value, 'retention_last_changed_date').retention_date
        ).startOf('day');
        const latestRetentionDate = DateTime.fromISO(
          getLatestDatefromKey(retentionHistory.value, 'retention_last_changed_date').retention_date
        ).startOf('day');
        if (
          retention.retention_date < latestRetentionDate &&
          !userIdhasAnyRoles([SUPER_ADMIN, JUDGE], req.headers.user_id)
        ) {
          // If date is less than the latest retention date and user is not Admin or Judge
          res.status(403).send({
            title: 'The retention date being applied is too early.',
            detail: `You do not have permission to lower the retention date for caseId '${case_id}' before last retention date '${latestRetentionDate.toFormat(dateFormat)}'.`,
          });
          return;
        }
        if (retention.retention_date < earliestRetentionDate) {
          // If date is less than the original retention date
          res.status(422).send({
            title: 'The retention date being applied is too early.',
            detail: `caseId '${case_id}' must have a retention date after the last completed automated retention date '${earliestRetentionDate.toFormat(dateFormat)}'.`,
            latest_automated_retention_date: earliestRetentionDate.toFormat(dateFormat),
          });
          return;
        }
      }
      retention.retention_date = retention.retention_date.toFormat(dateFormat);
      // If it's a validate only query, just stop right here and send it back
      if (req.query?.validate_only == 'true') {
        res.send(retention);
        return;
      }
      // Otherwise, add the rest
      // Set to ISO string
      retention.case_id = parseInt(req.body.case_id);
      retention.retention_last_changed_date = DateTime.now().toISO({ setZone: true });
      // Work out which user made the request by the user ID in the headers
      retention.amended_by = getUserNamebyUserId(req.headers.user_id);
      retention.retention_policy_applied = req.body?.is_permanent_retention ? 'Permanent' : 'Manual';
      retention.comments = req.body.comments;
      retention.status = 'COMPLETE';

      retentionHistory.value.push(retention);
      res.send(retention);
  }
});

module.exports = router;
