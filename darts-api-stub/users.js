const {
  REQUESTER,
  APPROVER,
  TRANSCRIBER,
  GLOBAL_JUDGE,
  JUDGE,
  SUPER_ADMIN,
  TRANSLATION_QA,
  SUPER_USER,
} = require('./roles');

const stubUsers = [
  {
    name: 'Eric Bristow',
    code: 'requestor',
    userState: {
      userId: 1,
      userName: 'eric.bristow@darts.local',
      roles: [REQUESTER],
      isActive: true,
    },
    active: true,
  },
  {
    name: 'Fallon Sherrock',
    code: 'approver',
    userState: {
      userId: 2,
      userName: 'fallon.sherrock@darts.local',
      roles: [APPROVER],
      isActive: true,
    },
    active: true,
  },
  {
    name: 'Michael van Gerwen',
    code: 'requestor-approver',
    userState: {
      userId: 3,
      userName: 'michael.vangerwen@darts.local',
      roles: [REQUESTER, APPROVER],
      isActive: true,
    },
    active: true,
  },
  {
    name: 'Trina Gulliver',
    code: 'transcriber',
    userState: {
      userId: 4,
      userName: 'trina.gulliver@darts.local',
      roles: [TRANSCRIBER],
      isActive: true,
    },
    active: true,
  },
  {
    name: 'Phil Taylor',
    code: 'admin',
    userState: {
      userId: 5,
      userName: 'phil.taylor@darts.local',
      roles: [REQUESTER, APPROVER, TRANSCRIBER, SUPER_ADMIN, SUPER_USER],
      isActive: true,
    },
    active: true,
  },
  {
    name: 'Nigel Justice',
    code: 'judge',
    userState: {
      userId: 6,
      userName: 'nigel.justice@darts.local',
      roles: [GLOBAL_JUDGE],
      isActive: true,
    },
    active: true,
  },
  {
    name: 'Martin Adams',
    code: 'judge-approver',
    userState: {
      userId: 7,
      userName: 'martin.adams@darts.local',
      roles: [JUDGE, APPROVER],
      isActive: true,
    },
    active: true,
  },
  {
    name: 'Luke Littler',
    code: 'admin-only',
    userState: {
      userId: 8,
      userName: 'luke.littler@darts.local',
      roles: [SUPER_ADMIN],
      isActive: true,
    },
    active: true,
  },
  {
    name: 'Peter Wright (Inactive)',
    code: 'non-active',
    userState: {
      userId: 9,
      userName: 'peter.wright@darts.local',
      roles: [],
      isActive: false,
    },
    active: false,
  },
  {
    name: 'John Lowe',
    code: 'translation-qa',
    userState: {
      userId: 10,
      userName: 'john.lowe@darts.local',
      roles: [TRANSLATION_QA],
      isActive: true,
    },
    active: true,
  },
  {
    name: 'Gary Anderson',
    code: 'superuser',
    userState: {
      userId: 11,
      userName: 'gary.anderson@darts.local',
      roles: [SUPER_USER],
      isActive: true,
    },
    active: false,
  },
];

const getUserById = (userId) => stubUsers.find((user) => user.userState.userId === userId);

const getRolesByUserId = (userId) => {
  return getUserById(parseInt(userId, 10))?.userState.roles;
};

const userIdHasAnyRoles = (roles, userId) => {
  // If user id has any of these roles
  const user = getUserById(parseInt(userId, 10));
  if (!user) return false;
  return user.userState.roles.some((role) => roles.includes(role));
};

const getUserNameByUserId = (userId) => {
  // If user id has any of these roles
  const user = getUserById(parseInt(userId, 10));
  if (!user) return false;
  return user.name;
};

module.exports = {
  stubUsers,
  getUserById,
  userIdHasAnyRoles,
  getUserNameByUserId,
  getRolesByUserId,
};
