const c = require('config');
const express = require('express');
const { stubUsers } = require('../../users');

const router = express.Router();

const USERS = stubUsers.map((stubUser) => {
  return {
    id: stubUser.userState.userId,
    last_modified_at: '2021-01-20T00:00:00.000000Z',
    last_login_at: '2024-01-23T00:00:00.000000Z',
    created_at: '2021-01-20T00:00:00.000000Z',
    full_name: stubUser.name,
    email_address: stubUser.userState.userName,
    active: stubUser.active,
    security_group_ids: stubUser.userState.roles.map((role) => role.roleId),
  };
});

// api/admin/users/search
router.post('/search', (req, res) => {
  if (req.body.full_name === 'NO_RESULTS') {
    res.send([]);
    return;
  }

  res.send(USERS);
});

router.get('/:userid', (req, res) => {
  const id = req.params.userid;
  if (id) {
    const user = USERS.find((user) => user.id.toString() === id);
    res.send(user);
  } else {
    res.sendStatus(404);
  }
});

router.patch('/:userid', (req, res) => {
  const id = req.params.userid;
  const updatedUser = req.body;
  if (id) {
    const index = USERS.findIndex((user) => user.id.toString() === id);

    USERS[index] = { ...USERS[index], ...updatedUser };

    res.send(USERS[index]);
  } else {
    res.sendStatus(404);
  }
});

router.get('/', (req, res) => {
  const email = req.headers['email-address'];

  if (email) {
    const user = USERS.find((user) => user.email_address === email);
    res.send(user ? [user] : []);
    return;
  }
});

router.post('/', (req, res) => {
  const user = req.body;
  user.id = USERS.length + 1;
  USERS.push(user);
  res.send(user);
});

module.exports = router;
