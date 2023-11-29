const { REQUESTER, APPROVER, TRANSCRIBER, JUDGE } = require('./roles');

module.exports = [
  {
    name: 'Eric Bristow',
    code: 'requestor',
    userState: {
      userId: 1,
      userName: 'eric.bristow@darts.local',
      roles: [REQUESTER],
    },
  },
  {
    name: 'Fallon Sherrock',
    code: 'approver',
    userState: {
      userId: 2,
      userName: 'fallon.sherrock@darts.local',
      roles: [APPROVER],
    },
  },
  {
    name: 'Michael van Gerwen',
    code: 'requestor-approver',
    userState: {
      userId: 2,
      userName: 'michael.vangerwen@darts.local',
      roles: [REQUESTER, APPROVER],
    },
  },
  {
    name: 'Trina Gulliver',
    code: 'transcriber',
    userState: {
      userId: 2,
      userName: 'trina.gulliver@darts.local',
      roles: [TRANSCRIBER],
    },
  },
  {
    name: 'Phil Taylor',
    code: 'admin',
    userState: {
      userId: 2,
      userName: 'phil.taylor@darts.local',
      roles: [REQUESTER, APPROVER, TRANSCRIBER],
    },
  },
  {
    name: 'Nigel Justice',
    code: 'judge',
    userState: {
      userId: 2,
      userName: 'nigel.justice@darts.local',
      roles: [JUDGE],
    },
  },
  {
    name: 'Martin Adams',
    code: 'judge-approver',
    userState: {
      userId: 2,
      userName: 'martin.adams@darts.local',
      roles: [JUDGE, APPROVER],
    },
  },
];
