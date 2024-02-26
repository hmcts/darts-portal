const express = require('express');

const router = express.Router();

const regions = [
  {
    id: 0,
    name: 'Reading County Court',
  },
  {
    id: 1,
    name: 'Slough County Court',
  },
  {
    id: 2,
    name: 'Kingston Magistrates Court',
  },
  {
    id: 3,
    name: 'Maidenhead County Court',
  },
  {
    id: 4,
    name: 'Basingstoke Magistrates',
  },
  {
    id: 5,
    name: 'Bournemouth County Court',
  },
  {
    id: 6,
    name: 'Southampton County Court',
  },
  {
    id: 7,
    name: 'Cardiff County Court',
  },
  {
    id: 8,
    name: 'Bridgend County Court',
  },
  {
    id: 9,
    name: 'Gloucester County Court',
  },
  {
    id: 10,
    name: 'Milton Keynes Magistrates',
  },
  {
    id: 11,
    name: 'Andover Magistrates',
  },
  {
    id: 12,
    name: 'Windsor County Court',
  },
  {
    id: 13,
    name: 'Eton County Court',
  },
  {
    id: 14,
    name: 'Courtsville High Court',
  },
  {
    id: 15,
    name: 'Mumboland High Court',
  },
  {
    id: 16,
    name: 'Oxford Magistrates Court',
  },
];

router.get('', (req, res) => {
  res.send(regions);
});

module.exports = router;
