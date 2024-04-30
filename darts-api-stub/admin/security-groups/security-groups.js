const express = require('express');
const router = express.Router();

const defaultSecurityGroups = [
  {
    id: 1,
    security_role_id: 1,
    name: 'Judiciary',
    display_name: 'Judiciary',
    display_state: true,
    global_access: true,
    courthouse_ids: [0],
    user_ids: [1],
    description: 'Dummy description 1',
  },
  {
    id: 2,
    security_role_id: 2,
    name: 'Opus Transcribers',
    display_name: 'Opus Transcribers',
    display_state: true,
    global_access: true,
    courthouse_ids: [0],
    user_ids: [1, 2],
    description: 'Dummy description 2',
  },
  {
    id: 3,
    security_role_id: 3,
    name: 'Super user (DARTS portal)',
    display_name: 'Super user (DARTS portal)',
    display_state: true,
    global_access: true,
    courthouse_ids: [1, 2, 3],
    user_ids: [1, 2, 3],
    description: 'Dummy description 3',
  },
  {
    id: 4,
    security_role_id: 2,
    name: 'Admin (Admin portal)',
    display_name: 'Admin (Admin portal)',
    display_state: true,
    global_access: true,
    courthouse_ids: [1, 2, 3, 4],
    user_ids: [1, 2, 3, 4],
    description: 'Dummy description 4',
  },
  {
    id: 5,
    security_role_id: 5,
    name: 'Super admin (Admin portal)',
    display_name: 'Super admin (Admin portal)',
    display_state: true,
    global_access: true,
    courthouse_ids: [1, 2, 3, 4, 5],
    user_ids: [1, 2, 3, 4, 5],
    description: 'Dummy description 5',
  },
  {
    id: 6,
    security_role_id: 6,
    name: 'Cardiff Requesters',
    display_name: 'Cardiff Requesters',
    display_state: true,
    global_access: true,
    courthouse_ids: [1, 2, 3, 4, 5, 6],
    user_ids: [1, 2, 3, 4, 5, 6],
    description: 'Dummy description 6',
  },
  {
    id: 7,
    security_role_id: 7,
    name: 'Cardiff Approvers',
    display_name: 'Cardiff Approvers',
    display_state: true,
    global_access: true,
    courthouse_ids: [1, 2, 3, 4, 5, 6, 7],
    user_ids: [1, 2, 3, 4, 5, 6, 7],
    description: 'Dummy description 7',
  },
  {
    id: 8,
    security_role_id: 8,
    name: 'Visually Hidden Group',
    display_name: 'Visually Hidden Group',
    display_state: false,
    global_access: true,
    courthouse_ids: [1, 2, 3, 4, 5, 6, 7, 8],
    user_ids: [1, 2, 3, 4, 5, 6, 7, 8],
    description: 'Dummy description 8',
  },
  {
    id: 9,
    security_role_id: 4,
    name: 'Magic Transcribers Inc',
    display_name: 'Magic Transcribers Inc',
    display_state: true,
    global_access: true,
    courthouse_ids: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    user_ids: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    description: 'Dummy description 9',
  },
  {
    id: 10,
    security_role_id: 4,
    name: 'Transcribers R Us',
    display_name: 'Transcribers R Us',
    display_state: true,
    global_access: true,
    courthouse_ids: [],
    user_ids: [],
    description: 'Dummy description 10',
  },
  {
    id: 11,
    security_role_id: 4,
    name: 'Skriber Tech UK',
    display_name: 'Skriber Tech UK',
    display_state: true,
    global_access: true,
    courthouse_ids: [1],
    user_ids: [1],
    description: 'Dummy description 11',
  },
  {
    id: 12,
    security_role_id: 1,
    name: 'Oxford Requesters',
    display_name: 'Oxford Requesters',
    display_state: true,
    global_access: true,
    courthouse_ids: [16],
    user_ids: [1, 3],
    description: 'Dummy description 1',
  },
  {
    id: 13,
    security_role_id: 2,
    name: 'Oxford Approvers',
    display_name: 'Oxford Approvers',
    display_state: true,
    global_access: true,
    courthouse_ids: [16],
    user_ids: [2, 3],
    description: 'Dummy description 2',
  },
];

router.patch('/:id', (req, res) => {
  const id = req.params.id;
  const securityGroup = securityGroups.find((securityGroup) => securityGroup.id == id);
  if (!securityGroup) return res.status(404).send('Security group not found');
  Object.assign(securityGroup, req.body);
  res.send(securityGroup);
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  const securityGroup = securityGroups.find((securityGroup) => securityGroup.id == id);
  if (!securityGroup) return res.status(404).send('Security group not found');
  res.send(securityGroup);
});

router.get('/', (req, res) => {
  const roleIds = req?.query?.['role_ids'];
  const courthouseId = req.query.courthouse_id;
  if (!courthouseId && !roleIds) {
    res.send(defaultSecurityGroups);
    return;
  }
  if (courthouseId && roleIds) {
    res.send(
      defaultSecurityGroups.filter(
        (securityGroup) =>
          securityGroup.courthouse_ids.includes(+courthouseId) &&
          roleIds.includes(securityGroup.security_role_id.toString())
      )
    );
    return;
  }
  if (courthouseId) {
    res.send(defaultSecurityGroups.filter((securityGroup) => securityGroup.courthouse_ids.includes(+courthouseId)));
    return;
  }
  if (roleIds) {
    res.send(
      defaultSecurityGroups.filter((securityGroup) => roleIds.includes(+securityGroup.security_role_id.toString()))
    );
    return;
  }
});

router.post('/', (req, res) => {
  const group = {
    ...req.body,
    global_access: true,
    display_state: true,
    id: securityGroups.value.length + 1,
    courthouse_ids: [],
    user_ids: [],
  };
  securityGroups.value.push(group);
  res.send(group).status(201);
});

module.exports = { router, defaultSecurityGroups };
