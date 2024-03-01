const c = require('config');
const express = require('express');
const { stubUsers } = require('../../users');
const { DateTime } = require('luxon');

const router = express.Router();

const USERS = stubUsers.map((stubUser) => {
  return {
    id: stubUser.userState.userId,
    description: stubUser.active ? 'Stub Active User' : undefined,
    last_modified_at: DateTime.fromISO('2020-01-11').plus({ days: stubUser.userState.userId * 10 }),
    last_login_at: stubUser.active
      ? DateTime.fromISO('2023-12-01').plus({ days: stubUser.userState.userId * 10 })
      : undefined,
    created_at: DateTime.fromISO('2020-01-01').plus({ days: stubUser.userState.userId * 10 }),
    full_name: stubUser.name,
    email_address: stubUser.userState.userName,
    active: stubUser.active,
    security_group_ids: stubUser.userState.roles.map((role) => role.roleId),
  };
});

// api/admin/users/search
router.post('/search', (req, res) => {
  const searchFullName = req?.body?.full_name?.toLowerCase() || '';
  const searchEmailAddress = req?.body?.email_address?.toLowerCase() || '';
  if (searchFullName === 'NO_RESULTS') {
    return res.send([]);
  }
  return res.send(
    USERS.filter(
      (user) =>
        user.full_name.toLowerCase().includes(searchFullName) &&
        user.email_address.toLowerCase().includes(searchEmailAddress)
    )
  );
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
