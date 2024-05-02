const express = require('express');
const { userIdHasAnyRoles } = require('../../users');
const { SUPER_ADMIN } = require('../../roles');

const router = express.Router();

const workflow = [
  {
    workflow_actor: 2,
    status_id: 0,
    workflow_ts: '2034-01-01T00:00:00Z',
    comments: [
      {
        comment: 'This is a comment',
        commented_at: '2034-01-01T00:00:00Z',
        author_id: 0,
      },
    ],
  },
  {
    workflow_actor: 3,
    status_id: 2,
    workflow_ts: '2024-01-01T00:00:00Z',
    comments: [
      {
        comment: 'lorem ipsum dolor sit amet',
        commented_at: '2034-01-01T00:00:00Z',
        author_id: 0,
      },
    ],
  },
  {
    workflow_actor: 4,
    status_id: 1,
    workflow_ts: '2020-12-09T00:00:00Z',
    comments: [
      {
        comment: 'lorem ipsum',
        commented_at: '2020-01-01T00:00:00Z',
        author_id: 0,
      },
    ],
  },
];

function authCheck(req, res) {
  if (!userIdHasAnyRoles([SUPER_ADMIN], req.headers.user_id))
    return res.status(403).send({
      detail: `You do not have permission`,
    });
}

router.get('/', (req, res) => {
  authCheck(req, res);
  if (req.query.is_current && req.query.transcription_id) {
    res.send(workflow);
  } else {
    res.sendStatus(400);
  }
});

module.exports = router;
