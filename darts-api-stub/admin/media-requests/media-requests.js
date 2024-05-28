const express = require('express');
const router = express.Router();

const DATA = [
  {
    id: 1,
    start_at: '2021-01-01T09:30:00Z',
    end_at: '2021-01-01T10:00:00Z',
    requested_at: '2021-01-01T08:00:00Z',
    hearing: {
      id: 1,
      hearing_date: '2021-01-01',
    },
    courtroom: {
      id: 1,
      name: 'courtroom 1',
    },
    requested_by_id: 1,
    owner_id: 1,
  },
  {
    id: 2,
    start_at: '2022-02-01T11:00:00Z',
    end_at: '2022-02-01T12:00:00Z',
    requested_at: '2022-02-01T15:00:00Z',
    hearing: {
      id: 2,
      hearing_date: '2022-02-01',
    },
    courtroom: {
      id: 2,
      name: 'courtroom 2',
    },
    requested_by_id: 2,
    owner_id: 2,
  },
  {
    id: 3,
    start_at: '2023-06-01T14:00:00Z',
    end_at: '2023-06-01T15:00:00Z',
    requested_at: '2023-06-01T16:00:00Z',
    hearing: {
      id: 3,
      hearing_date: '2023-03-01',
    },
    courtroom: {
      id: 3,
      name: 'courtroom 3',
    },
    requested_by_id: 3,
    owner_id: 3,
  },
];

router.get('/:id', (req, res) => {
  const id = +req.params.id;
  const item = DATA.find((item) => item.id === id);
  if (!item) {
    return res.status(404).send();
  }
  res.send(item);
});

router.patch('/:id', (req, res) => {
  const owner_id = +req.body.owner_id;

  if (owner_id === undefined) {
    return res.status(400).send();
  }

  const id = +req.params.id;
  const item = DATA.find((item) => item.id === id);
  if (!item) {
    return res.status(404).send();
  }

  item.owner_id = owner_id;
  res.send(item);
});

module.exports = router;
