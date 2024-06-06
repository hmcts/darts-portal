const express = require('express');
const router = express.Router();

const media = [
  {
    id: 1,
    channel: 1,
    start_at: '2020-06-01T17:00:00Z',
    end_at: '2020-06-01T18:00:00Z',
    case: {
      id: 1,
      case_number: '123',
    },
    hearing: {
      id: 1,
      hearing_date: '2020-06-01',
    },
    courthouse: {
      id: 1,
      display_name: 'courthouse 1',
    },
    courtroom: {
      id: 1,
      display_name: 'courtroom 1',
    },
  },
  {
    id: 2,
    channel: 2,
    start_at: '2020-01-01T19:00:00Z',
    end_at: '2020-01-01T20:00:00Z',
    case: {
      id: 2,
      case_number: '456',
    },
    hearing: {
      id: 2,
      hearing_date: '2020-06-01',
    },
    courthouse: {
      id: 2,
      display_name: 'courthouse 2',
    },
    courtroom: {
      id: 2,
      display_name: 'courtroom 2',
    },
  },
  {
    id: 3,
    channel: 3,
    start_at: '2020-07-01T14:00:00Z',
    end_at: '2020-07-01T15:00:00Z',
    case: {
      id: 3,
      case_number: '789',
    },
    hearing: {
      id: 3,
      hearing_date: '2020-08-01',
    },
    courthouse: {
      id: 3,
      display_name: 'courthouse 3',
    },
    courtroom: {
      id: 3,
      display_name: 'courtroom 3',
    },
  },
];

router.get('/', (req, res) => {
  const transformed_media_id = req.query.transformed_media_id;
  const transcription_document_id = req.query.transcription_document_id;

  res.send(media);
});

module.exports = router;
