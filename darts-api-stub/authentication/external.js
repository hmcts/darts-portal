const express = require('express');

const router = express.Router();

router.get('/login-or-refresh', (_, res) => {
  res.header('Location', 'http://localhost:4551/external-user/login');
  res.status(302).send();
});

router.post('/handle-oauth-code', (_, res) => {
  res.send('fake-jwt');
});

router.get('/login', (_, res) => {
  res.render('external-login');
});

module.exports = router;
