const express = require('express');
const { localArray } = require('../../localArray');
const { ADMIN } = require('../../roles');
const { userIdhasAnyRoles } = require('../../users');

const router = express.Router();

const defaultCourthouses = [
  {
    courthouse_name: 'READING',
    display_name: 'Reading',
    id: 0,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
    region_id: 4,
    security_group_ids: [1, 2, 3, 4, 5],
  },
  {
    courthouse_name: 'SLOUGH',
    display_name: 'Slough',
    id: 1,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
    region_id: 4,
    security_group_ids: [1, 2, 3, 4, 5],
  },
  {
    courthouse_name: 'KINGSTON',
    display_name: 'Kingston',
    id: 2,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
    region_id: 0,
    security_group_ids: [1, 2, 3, 4, 5],
  },
  {
    courthouse_name: 'MAIDENHEAD',
    display_name: 'Maidenhead',
    id: 3,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
    region_id: 4,
    security_group_ids: [1, 2, 3, 4, 5],
  },
  {
    courthouse_name: 'BASINGSTOKE',
    display_name: 'Basingstoke',
    id: 4,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
    region_id: 1,
    security_group_ids: [1, 2, 3, 4, 5],
  },
  {
    courthouse_name: 'BOURNEMOUTH',
    display_name: 'Bournemouth',
    id: 5,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
    region_id: 3,
    security_group_ids: [1, 2, 3, 4, 5],
  },
  {
    courthouse_name: 'SOUTHAMPTON',
    display_name: 'Southampton',
    id: 6,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
    region_id: 4,
    security_group_ids: [1, 2, 3, 4, 5],
  },
  {
    courthouse_name: 'CARDIFF',
    display_name: 'Cardiff',
    id: 7,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
    region_id: 6,
    security_group_ids: [1, 2, 3, 4, 5, 6, 7],
  },
  {
    courthouse_name: 'BRIDGEND',
    display_name: 'Bridgend',
    id: 8,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
    region_id: 6,
    security_group_ids: [1, 2, 3, 4, 5],
  },
  {
    courthouse_name: 'GLOUCESTER',
    display_name: 'Gloucester',
    id: 9,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
    region_id: 4,
    security_group_ids: [1, 2, 3, 4, 5],
  },
  {
    courthouse_name: 'MILTON KEYNES',
    display_name: 'Milton Keynes',
    id: 10,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
    region_id: 5,
    security_group_ids: [1, 2, 3, 4, 5],
  },

  {
    courthouse_name: 'ANDOVER',
    display_name: 'Andover',
    id: 11,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
    region_id: 4,
    security_group_ids: [1, 2, 3, 4, 5],
  },
  {
    courthouse_name: 'WINDSOR',
    display_name: 'Windsor',
    id: 12,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
    region_id: 4,
    security_group_ids: [1, 2, 3, 4, 5],
  },
  {
    courthouse_name: 'ETON',
    display_name: 'Eton',
    id: 13,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
    region_id: 4,
    security_group_ids: [1, 2, 3, 4, 5],
  },
  {
    courthouse_name: 'COURTSVILLE',
    display_name: 'Courtsville',
    id: 14,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
    security_group_ids: [1, 2, 3, 4, 5],
  },
  {
    courthouse_name: 'MUMBOLAND',
    display_name: 'Mumboland',
    id: 15,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
    security_group_ids: [1, 2, 3, 4, 5],
  },
  {
    courthouse_name: 'OXFORD',
    display_name: 'Oxford',
    id: 16,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
    region_id: 2,
    security_group_ids: [1, 2, 3, 4, 5],
  },
];

const courthouses = localArray('courthouses');
// Clear out old values on restart
courthouses.value = defaultCourthouses;

const getCourthouseByCourthouseId = (courthouseId) => {
  return courthouses.value.find((courthouse) => courthouse.id === parseInt(courthouseId));
};

router.get('/:courthouseId', (req, res) => {
  if (!userIdhasAnyRoles([ADMIN], req.headers.user_id))
    return res.status(403).send({
      detail: `You do not have permission`,
    });
  const courthouse = getCourthouseByCourthouseId(req?.params?.courthouseId);
  if (!courthouse) return res.sendStatus(404);
  res.send(courthouse);
});

module.exports = router;
