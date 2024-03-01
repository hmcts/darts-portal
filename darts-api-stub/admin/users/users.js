const c = require('config');
const express = require('express');

const router = express.Router();

const USERS = [
  {
    id: 1,
    last_modified_at: '2024-01-20T00:00:00.000000Z',
    last_login_at: '2024-01-23T00:00:00.000000Z',
    description: 'This is a test user',
    created_at: '2024-01-20T00:00:00.000000Z',
    full_name: 'Darts User',
    email_address: 'user@local.net',
    active: true,
    security_group_ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  {
    id: 2,
    last_modified_at: '2023-01-20T00:00:00.000000Z',
    last_login_at: '2024-01-23T00:00:00.000000Z',
    description: 'This is a test user',
    created_at: '2023-01-20T00:00:00.000000Z',
    full_name: 'Dev User',
    email_address: 'dev@local.net',
    active: true,
    security_group_ids: [1, 2, 3],
  },
  {
    id: 3,
    last_modified_at: '2021-01-20T00:00:00.000000Z',
    created_at: '2021-01-20T00:00:00.000000Z',
    full_name: 'Inactive User',
    email_address: 'inactive.user@local.net',
    active: false,
    security_group_ids: [1],
  },
  {
    id: 4,
    last_modified_at: '2022-01-20T00:00:00.000000Z',
    last_login_at: '2024-01-23T00:00:00.000000Z',
    description: 'Edit me',
    created_at: '2022-01-20T00:00:00.000000Z',
    full_name: 'Edit Email Functional Test',
    email_address: 'edit@me.net',
    active: true,
    security_group_ids: [1],
  },
  {
    id: 5,
    last_modified_at: '2024-01-20T00:00:00.000000Z',
    last_login_at: '2024-01-23T00:00:00.000000Z',
    description: 'Edit description',
    created_at: '2024-01-20T00:00:00.000000Z',
    full_name: 'Edit Functional Test',
    email_address: 'dont.edit@me.net',
    active: true,
    security_group_ids: [1],
  },
];

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
