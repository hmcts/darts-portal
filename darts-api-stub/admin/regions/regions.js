const express = require('express');

const router = express.Router();

const regions = [
  {
    id: 0,
    name: 'London',
  },
  {
    id: 1,
    name: 'Midlands',
  },
  {
    id: 2,
    name: 'North west',
  },
  {
    id: 3,
    name: 'North east',
  },
  {
    id: 4,
    name: 'South west',
  },
  {
    id: 5,
    name: 'South east',
  },
  {
    id: 6,
    name: 'Wales',
  },
  {
    id: 7,
    name: 'No region',
  },
];

router.get('', (req, res) => {
  res.send(regions);
});

module.exports = router;
