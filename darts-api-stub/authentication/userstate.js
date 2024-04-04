const express = require('express');
const { getUserById } = require('../users');

const router = express.Router();

router.get('/', (req, res) => {
  const user = getUserById(parseInt(req.headers.user_id, 10));
  if (!user) {
    return res.status(401).send();
  }
  res.send(user.userState);
});

module.exports = router;
