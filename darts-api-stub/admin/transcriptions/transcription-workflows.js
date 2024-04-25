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
        comment: 'string',
        commented_at: '2034-01-01T00:00:00Z',
        author_id: 0,
      },
    ],
  },
  {
    workflow_actor: 3,
    status_id: 0,
    workflow_ts: '2024-01-01T00:00:00Z',
    comments: [
      {
        comment: 'string',
        commented_at: '2034-01-01T00:00:00Z',
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
  if (req.query.current && req.query.transcription_id) {
    res.send(workflow);
  } else {
    res.sendStatus(400);
  }
});

module.exports = router;
