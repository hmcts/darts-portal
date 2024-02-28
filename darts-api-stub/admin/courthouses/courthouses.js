const express = require('express');
const { localArray } = require('../../localArray');
const { ADMIN } = require('../../roles');
const { userIdhasAnyRoles } = require('../../users');

const router = express.Router();

const defaultCourthouses = [
  {
    courthouse_name: 'Reading',
    display_name: 'READING',
    id: 0,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
    region_id: 4,
    security_group_ids: [1, 2, 3, 4, 5],
  },
  {
    courthouse_name: 'Slough',
    display_name: 'SLOUGH',
    id: 1,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
    region_id: 4,
    security_group_ids: [1, 2, 3, 4, 5],
  },
  {
    courthouse_name: 'Kingston',
    display_name: 'KINGSTON',
    id: 2,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
    region_id: 0,
    security_group_ids: [1, 2, 3, 4, 5],
  },
  {
    courthouse_name: 'Maidenhead',
    display_name: 'MAIDENHEAD',
    id: 3,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
    region_id: 4,
    security_group_ids: [1, 2, 3, 4, 5],
  },
  {
    courthouse_name: 'Basingstoke',
    display_name: 'BASINGSTOKE',
    id: 4,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
    region_id: 1,
    security_group_ids: [1, 2, 3, 4, 5],
  },
  {
    courthouse_name: 'Bournemouth',
    display_name: 'BOURNEMOUTH',
    id: 5,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
    region_id: 3,
    security_group_ids: [1, 2, 3, 4, 5],
  },
  {
    courthouse_name: 'Southampton',
    display_name: 'SOUTHAMPTON',
    id: 6,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
    region_id: 4,
    security_group_ids: [1, 2, 3, 4, 5],
  },
  {
    courthouse_name: 'Cardiff',
    display_name: 'CARDIFF',
    id: 7,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
    region_id: 6,
    security_group_ids: [1, 2, 3, 4, 5, 6, 7],
  },
  {
    courthouse_name: 'Bridgend',
    display_name: 'BRIDGEND',
    id: 8,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
    region_id: 6,
    security_group_ids: [1, 2, 3, 4, 5],
  },
  {
    courthouse_name: 'Gloucester',
    display_name: 'GLOUCESTER',
    id: 9,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
    region_id: 4,
    security_group_ids: [1, 2, 3, 4, 5],
  },
  {
    courthouse_name: 'Milton Keynes',
    display_name: 'MILTON Keynes',
    id: 10,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
    region_id: 5,
    security_group_ids: [1, 2, 3, 4, 5],
  },

  {
    courthouse_name: 'Andover',
    display_name: 'ANDOVER',
    id: 11,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
    region_id: 4,
    security_group_ids: [1, 2, 3, 4, 5],
  },
  {
    courthouse_name: 'Windsor',
    display_name: 'WINDSOR',
    id: 12,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
    region_id: 4,
    security_group_ids: [1, 2, 3, 4, 5],
  },
  {
    courthouse_name: 'Eton',
    display_name: 'ETON',
    id: 13,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
    region_id: 4,
    security_group_ids: [1, 2, 3, 4, 5],
  },
  {
    courthouse_name: 'Courtsville',
    display_name: 'COURTSVILLE',
    id: 14,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
    security_group_ids: [1, 2, 3, 4, 5],
  },
  {
    courthouse_name: 'Mumboland',
    display_name: 'MUMBOLAND',
    id: 15,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
    security_group_ids: [1, 2, 3, 4, 5],
  },
  {
    courthouse_name: 'Oxford',
    display_name: 'OXFORD',
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
