const c = require('config');
const express = require('express');
const { stubUsers } = require('../../users');
const { defaultSecurityGroups } = require('../security-groups/security-groups');
const { DateTime, Settings } = require('luxon');

Settings.defaultZone = 'utc';

generateSecurityGroupIds = (id, numberOfSecurityGroups) => {
  if (id <= numberOfSecurityGroups) {
    // first user has [1], the second user has [1,2], the third user has [1,2,3], etc.
    return Array.from({ length: id }, (_, i) => i + 1);
  }
  // all other users have no security groups
  return [];
};

const router = express.Router();

const DEFAULT_USERS = stubUsers.map((stubUser) => {
  return {
    id: stubUser.userState.userId,
    description: stubUser.active ? 'Stub Active User' : undefined,
    last_modified_at: DateTime.fromISO('2020-01-11T00:00:00Z').plus({ days: stubUser.userState.userId * 10 }),
    last_login_at: stubUser.active
      ? DateTime.fromISO('2023-12-01T00:00:00Z').plus({ days: stubUser.userState.userId * 10 })
      : undefined,
    created_at: DateTime.fromISO('2020-01-01T00:00:00Z').plus({ days: stubUser.userState.userId * 10 }),
    full_name: stubUser.name,
    email_address: stubUser.userState.userName,
    active: stubUser.active,
    security_group_ids: generateSecurityGroupIds(stubUser.userState.userId, defaultSecurityGroups.length),
    rolled_back_transcript_requests: [1, 2, 3],
  };
});
let USERS = [...DEFAULT_USERS];

router.get('/reset', (req, res) => {
  USERS = [...DEFAULT_USERS];
  res.sendStatus(200);
});

// api/admin/users/search
router.post('/search', (req, res) => {
  const searchFullName = req?.body?.full_name?.toLowerCase() || '';
  const searchEmailAddress = req?.body?.email_address?.toLowerCase() || '';
  const active = req?.body?.active;
  const ids = req?.body?.user_ids;

  if (ids) {
    const users = USERS.filter((user) => ids.includes(user.id));
    return res.send(users);
  }

  if (searchFullName === 'NO_RESULTS') {
    return res.send([]);
  }
  const users = USERS.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchFullName) &&
      user.email_address.toLowerCase().includes(searchEmailAddress)
  );
  if (active === null || typeof active === 'undefined') return res.send(users);

  res.send(users.filter((user) => user.active === !!active));
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
  // Activate/deactivate Gary Anderson to simulate a 409
  if (id === '11') {
    res.sendStatus(409);
    return;
  }

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
  const userIds = req.query.user_ids;

  if (email) {
    const user = USERS.find((user) => user.email_address === email);
    res.send(user ? [user] : []);
    return;
  }

  if (userIds) {
    const idArray = userIds.split(',').map((id) => parseInt(id));
    const matchedUsers = USERS.filter((user) => idArray.includes(user.id));
    res.send(matchedUsers);
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
