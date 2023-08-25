const express = require('express');

const router = express.Router();

router.get('/login-or-refresh', (_, res) => {
  res.header('Location', 'http://localhost:4551/external-user/login');
  res.status(302).send();
});

router.post('/handle-oauth-code', (_, res) => {
  //Objects which reflect express-session module
  const permissions = [{ permissionId: 1, permissionName: 'local dev permissions' }];
  const roles = [
    {
      roleId: 123,
      roleName: 'local dev',
      permissions: permissions,
    },
  ];
  const userState = {
    userId: 123,
    userName: 'localdev01',
    roles: roles,
  };
//   const token = 
// 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2OTI5NTMzMTgsImV4cCI6MTY5Mjk1OTE5OCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSJ9.v9Ps6mn4pYAwiQBaaXhDv2Oplojo9N8TqaRLInnevW8'

  //Token expires 2034-08-23
  const securityToken = {
    userState: userState,
//     accessToken:
// token
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
  res.render('external-login');
});

router.get('/handle-logout', (_, res) => {
  res.render('external-logout');
});

module.exports = router;
