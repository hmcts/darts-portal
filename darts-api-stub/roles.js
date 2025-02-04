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
  courthouseIds: [1, 2, 3, 4],
};

const JUDGE = {
  roleId: 4,
  roleName: 'JUDICIARY',
  permissions,
  courthouseIds: [1, 2, 3, 4],
};

const SUPER_ADMIN = {
  roleId: 5,
  roleName: 'SUPER_ADMIN',
  globalAccess: true,
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
  globalAccess: true,
  permissions,
};

const GLOBAL_JUDGE = {
  roleId: 8,
  roleName: 'JUDICIARY',
  permissions,
  globalAccess: true,
};

const RCJ_APPEALS = {
  roleId: 9,
  roleName: 'RCJ_APPEALS',
  permissions,
};

module.exports = {
  GLOBAL_JUDGE,
  JUDGE,
  TRANSCRIBER,
  APPROVER,
  REQUESTER,
  SUPER_ADMIN,
  TRANSLATION_QA,
  SUPER_USER,
  RCJ_APPEALS,
};
