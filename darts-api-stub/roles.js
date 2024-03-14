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
  roleName: 'SUPER_ADMIN',
  permissions,
};

const TRANSLATION_QA = {
  roleId: 6,
  roleName: 'TRANSLATION_QA',
  permissions,
};

const SUPER_USER = {
  roleId: 7,
  roleName: 'SUPER_USER',
  permissions,
};

module.exports = { JUDGE, TRANSCRIBER, APPROVER, REQUESTER, ADMIN, SUPER_USER, TRANSLATION_QA };
