const express = require('express');

const router = express.Router();

const courthouses = [
  {
    courthouse_name: 'READING',
    display_name: 'Reading',
    code: 0,
    region_id: 4,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
  },
  {
    courthouse_name: 'SLOUGH',
    display_name: 'Slough',
    code: 0,
    region_id: 4,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
  },
  {
    courthouse_name: 'KINGSTON',
    display_name: 'Kingston',
    code: 0,
    region_id: 0,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
  },
  {
    courthouse_name: 'MAIDENHEAD',
    display_name: 'Maidenhead',
    code: 0,
    region_id: 4,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
  },
  {
    courthouse_name: 'BIRMINGHAM',
    display_name: 'Birmingham',
    code: 0,
    region_id: 1,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
  },
  {
    courthouse_name: 'YORKSHIRE',
    display_name: 'Yorkshire',
    code: 0,
    region_id: 3,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
  },
  {
    courthouse_name: 'SOUTHAMPTON',
    display_name: 'Southampton',
    code: 0,
    region_id: 4,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
  },
  {
    courthouse_name: 'CARDIFF',
    display_name: 'Cardiff',
    code: 0,
    region_id: 6,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
  },
  {
    courthouse_name: 'BRIDGEND',
    display_name: 'Bridgend',
    code: 0,
    region_id: 6,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
  },
  {
    courthouse_name: 'GLOUCESTER',
    display_name: 'Gloucester',
    code: 0,
    region_id: 4,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
  },
  {
    courthouse_name: 'MK',
    display_name: 'Milton Keynes',
    code: 0,
    region_id: 5,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
  },

  {
    courthouse_name: 'ANDOVER',
    display_name: 'Andover',
    code: 0,
    region_id: 4,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
  },
  {
    courthouse_name: 'WINDSOR',
    display_name: 'Windsor',
    code: 0,
    region_id: 4,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
  },
  {
    courthouse_name: 'ETON',
    display_name: 'Eton',
    code: 0,
    region_id: 4,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
  },
  {
    courthouse_name: 'COURTSVILLE',
    display_name: 'Courtsville',
    code: 0,
    region_id: 7,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
  },
  {
    courthouse_name: 'MUMBOLAND',
    display_name: 'Mumboland',
    code: 0,
    region_id: 7,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
  },
  {
    courthouse_name: 'OXFORD',
    display_name: 'Oxford',
    code: 0,
    region_id: 2,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
  },
];

// Advanced search stub API
router.get('', (req, res) => {
  res.send(courthouses);
});

module.exports = router;
