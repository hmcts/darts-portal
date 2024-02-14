const express = require('express');
const { stubUsers } = require('../users');

const router = express.Router();

router.get('/login-or-refresh', (_, res) => {
  res.header('Location', 'http://localhost:4551/external-user/login');
  res.status(302).send();
});

router.post('/handle-oauth-code', (req, res, next) => {
  const code = req.body.code;
  const user = stubUsers.find((u) => u.code === code);
  if (!user) {
    return next(`Could not find stub user for code ${code}`);
  }
  //Token expires 2034-08-23
  const securityToken = {
    userState: user.userState,
    accessToken:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJEYXZpZE1hbm4iLCJpYXQiOjE2OTI4NzQ5MzAsImV4cCI6MjAzOTk0MzczMCwiYXVkIjoiZGFydHMtbG9jYWwtZGV2Iiwic3ViIjoiZGFydHMtbG9jYWwtand0In0.6wJo9geKWacjA-FR67waVRsNuS6uP5X-JJRlTOpwGhI',
  };
  res.send(securityToken);
});

router.get('/logout', (_, res) => {
  res.header('Location', 'http://localhost:4551/external-user/handle-logout');
  res.status(302).send();
});

router.get('/login', (_, res) => {
  res.render('login', { callbackUrl: 'http://localhost:3000/auth/callback', stubUsers });
});

router.get('/handle-logout', (_, res) => {
  res.render('logout');
});

module.exports = router;
