const permissions = [{ permissionId: 1, permissionName: 'local dev permissions' }];
const REQUESTER = {
  roleId: 1,
  roleName: 'REQUESTER',
  permissions,
};

const APPROVER = {
  roleId: 2,
  roleName: 'APPROVER',
  permissions,
};

const TRANSCRIBER = {
  roleId: 3,
  roleName: 'TRANSCRIBER',
  permissions,
};

const JUDGE = {
  roleId: 4,
  roleName: 'JUDGE',
  permissions,
};

const ADMIN = {
  roleId: 5,
  roleName: 'ADMIN',
  permissions,
};

module.exports = { JUDGE, TRANSCRIBER, APPROVER, REQUESTER, ADMIN };
