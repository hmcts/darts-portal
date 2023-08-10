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
  const securityToken = {
    userState: userState,
    accessToken: 'fake-jwt',
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
