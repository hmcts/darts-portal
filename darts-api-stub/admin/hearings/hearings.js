const router = require('express').Router();

const hearings = [
  {
    id: 1,
    hearing_date: '2024-01-01',
    case: {
      id: 1,
      case_number: '123',
    },
    courthouse: {
      id: 1,
      display_name: 'Cardiff',
    },
    courtroom: {
      id: 1,
      name: 'Room 1',
    },
  },
  {
    id: 2,
    hearing_date: '2024-01-02',
    case: {
      id: 2,
      case_number: '456',
    },
    courthouse: {
      id: 2,
      display_name: 'Swansea',
    },
    courtroom: {
      id: 2,
      name: 'Room 2',
    },
  },
  {
    id: 3,
    hearing_date: '2024-01-03',
    case: {
      id: 3,
      case_number: '789',
    },
    courthouse: {
      id: 3,
      display_name: 'Newport',
    },
    courtroom: {
      id: 3,
      name: 'Room 3',
    },
  },
];

const singleHearing = {
  id: 1,
  hearing_date: '2025-01-23',
  scheduled_start_time: '08:00:00',
  hearing_is_actual: true,
  case: {
    id: 1,
    case_number: 'CASE1',
    courthouse: {
      id: 0,
      display_name: 'Courthouse 12',
    },
    defendants: ['Joe Bloggs'],
    prosecutors: ['Mrs Prosecutor'],
    defenders: ['Mr Defender'],
    judges: ['Mr Judge'],
  },
  courtroom: {
    id: 0,
    name: 'ROOM CD',
  },
  judges: ['Mr Judge'],
  created_at: '2024-01-01T00:00:00Z',
  created_by: 3,
  last_modified_at: '2024-01-01T00:00:00Z',
  last_modified_by: 2,
};

const hearingAudios = [
  {
    id: 1,
    start_at: '2024-06-11T07:55:18.404Z',
    end_at: '2024-06-11T11:11:18.404Z',
    filename: 'Test recording.mp3',
    channel: 1,
    total_channels: 4,
  },
  {
    id: 2,
    start_at: '2024-06-11T13:12:18.404Z',
    end_at: '2024-06-11T19:33:18.404Z',
    filename: 'Test recording 1.mp3',
    channel: 2,
    total_channels: 4,
  },
];

router.get('/:id', (req, res) => {
  res.send(singleHearing);
});

router.get('/:id/audios', (req, res) => {
  res.send(hearingAudios);
});

router.post('/search', (req, res) => {
  if (req.body.case_number === 'NO_RESULTS') {
    res.send([]);
    return;
  }

  if (req.body.case_number === 'NO_CRITERIA') {
    res.status(400).send({ type: 'COMMON_105', title: 'The search criteria is too broad', status: 400 });
    return;
  }

  if (req.body.case_number === 'TOO_MANY_RESULTS') {
    res.status(400).send({
      type: 'HEARING_101',
      title: 'Too many results have been returned. Please change search criteria.',
      status: 400,
    });
    return;
  }

  res.send(hearings);
});

module.exports = router;
