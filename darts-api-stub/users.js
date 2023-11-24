const permissions = [{ permissionId: 1, permissionName: 'local dev permissions' }];

module.exports = [
  {
    name: 'Phil Taylor',
    code: 'requestor',
    userState: {
      userId: 1,
      userName: 'phil.taylor@darts.local',
      roles: [
        {
          roleId: 1,
          roleName: 'REQUESTER',
          permissions,
        },
      ],
    },
  },
  {
    name: 'Fallon Sherrock',
    code: 'approver',
    userState: {
      userId: 2,
      userName: 'fallon.sherrock@darts.local',
      roles: [
        {
          roleId: 2,
          roleName: 'APPROVER',
          permissions,
        },
      ],
    },
  },
  {
    name: 'Michael van Gerwen',
    code: 'requestor-approver',
    userState: {
      userId: 2,
      userName: 'michael.vangerwen@darts.local',
      roles: [
        {
          roleId: 1,
          roleName: 'REQUESTER',
          permissions,
        },
        {
          roleId: 2,
          roleName: 'APPROVER',
          permissions,
        },
      ],
    },
  },
  {
    name: 'Trina Gulliver',
    code: 'transcriber',
    userState: {
      userId: 2,
      userName: 'trina.gulliver@darts.local',
      roles: [
        {
          roleId: 3,
          roleName: 'TRANSCRIBER',
          permissions,
        },
      ],
    },
  },
  {
    name: 'Eric Bristow',
    code: 'admin',
    userState: {
      userId: 2,
      userName: 'eric.bristow@darts.local',
      roles: [
        {
          roleId: 1,
          roleName: 'REQUESTER',
          permissions,
        },
        {
          roleId: 2,
          roleName: 'APPROVER',
          permissions,
        },
        {
          roleId: 3,
          roleName: 'TRANSCRIBER',
          permissions,
        },
      ],
    },
  },
];
