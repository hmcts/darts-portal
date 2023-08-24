const express = require('express');

const router = express.Router();

const courthouses = [
  {
    courthouse_name: 'Reading',
    code: 0,
    id: 0,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
  },
  {
    courthouse_name: 'Slough',
    code: 0,
    id: 0,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
  },
  {
    courthouse_name: 'Kingston',
    code: 0,
    id: 0,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
  },
  {
    courthouse_name: 'Maidenhead',
    code: 0,
    id: 0,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
  },
  {
    courthouse_name: 'Basingstoke',
    code: 0,
    id: 0,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
  },
  {
    courthouse_name: 'Bournemouth',
    code: 0,
    id: 0,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
  },
  {
    courthouse_name: 'Southampton',
    code: 0,
    id: 0,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
  },
  {
    courthouse_name: 'Cardiff',
    code: 0,
    id: 0,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
  },
  {
    courthouse_name: 'Bridgend',
    code: 0,
    id: 0,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
  },
  {
    courthouse_name: 'Gloucester',
    code: 0,
    id: 0,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
  },
  {
    courthouse_name: 'Milton Keynes',
    code: 0,
    id: 0,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
  },

  {
    courthouse_name: 'Andover',
    code: 0,
    id: 0,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
  },
  {
    courthouse_name: 'Windsor',
    code: 0,
    id: 0,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
  },
  {
    courthouse_name: 'Eton',
    code: 0,
    id: 0,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
  },
  {
    courthouse_name: 'Courtsville',
    code: 0,
    id: 0,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
  },
  {
    courthouse_name: 'Mumboland',
    code: 0,
    id: 0,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
  },
  {
    courthouse_name: 'Oxford',
    code: 0,
    id: 0,
    created_date_time: '2023-08-18T09:48:29.728Z',
    last_modified_date_time: '2023-08-18T09:48:29.728Z',
  },
];

// Advanced search stub API
router.get('', (req, res) => {
  res.send(courthouses);
});

module.exports = router;
