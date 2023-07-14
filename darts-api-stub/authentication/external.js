const express = require('express');

const router = express.Router();

router.get('/login-or-refresh', (_, res) => {
  res.header('Location', 'http://localhost:4551/external-user/login');
  res.status(302).send();
});

router.post('/handle-oauth-code', (_, res) => {
  res.send('fake-jwt');
});

router.get('/logout', (_, res) => {
  res.header('Location', 'http://localhost:4551/external-user/handle-logout');
  res.status(302).send();
});

router.get('/login', (_, res) => {
  res.render('external-login');
});

router.get('/handle-logout', (_, res) => {
  res.render('external-logout');
});

module.exports = router;
