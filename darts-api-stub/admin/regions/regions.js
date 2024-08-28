const express = require('express');
const { userIdHasAnyRoles } = require('../../users');
const { SUPER_ADMIN, SUPER_USER } = require('../../roles');

const router = express.Router();
const defaultRegions = [
  { id: 0, name: 'London' },
  { id: 1, name: 'Midlands' },
  { id: 2, name: 'North west' },
  { id: 3, name: 'North east' },
  { id: 4, name: 'South west' },
  { id: 5, name: 'South east' },
  { id: 6, name: 'Wales' },
];

router.get('/', (req, res) => {
  if (!userIdHasAnyRoles([SUPER_ADMIN, SUPER_USER], req.headers.user_id))
    return res.status(403).send({
      detail: `You do not have permission`,
    });
  res.send(defaultRegions);
});

module.exports = router;
