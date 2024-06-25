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

const mediaSearchResults = [
  {
    id: 101,
    courthouse: {
      id: 1,
      display_name: 'Birmingham',
    },
    courtroom: {
      id: 1,
      name: 'Room A',
    },
    start_at: '2024-01-01T11:00:00Z',
    end_at: '2024-01-01T12:00:00Z',
    channel: 4,
    is_hidden: false,
  },

  {
    id: 102,
    courthouse: {
      id: 2,
      display_name: 'Cardiff',
    },
    courtroom: {
      id: 2,
      name: 'Room B',
    },
    start_at: '2023-01-08T15:30:00Z',
    end_at: '2023-01-08T16:15:00Z',
    channel: 5,
    is_hidden: true,
  },
  {
    id: 103,
    courthouse: {
      id: 3,
      display_name: 'Edinburgh',
    },
    courtroom: {
      id: 3,
      name: 'Room C',
    },
    start_at: '2022-09-01T13:15:00Z',
    end_at: '2022-09-01T14:00:00Z',
    channel: 6,
    is_hidden: false,
  },
];

router.get('/', (req, res) => {
  const transformed_media_id = req.query.transformed_media_id;
  const transcription_document_id = req.query.transcription_document_id;

  res.send(media);
});

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  res.send({
    id,
    start_at: '2024-06-11T09:55:18.404Z',
    end_at: '2024-06-11T10:55:18.404Z',
    channel: 4,
    total_channels: 16,
    media_type: 'Audio',
    media_format: 'MP3',
    file_size_bytes: 123456789,
    filename: 'filename.mp3',
    media_object_id: '123',
    content_object_id: '456',
    clip_id: '789',
    reference_id: 'ABC',
    checksum: '2963841',
    media_status: 'media status',
    is_hidden: true,
    is_deleted: true,
    admin_action: {
      id: 0,
      reason_id: 2,
      hidden_by_id: 4,
      hidden_at: '2024-06-11T07:55:18.404Z',
      is_marked_for_manual_deletion: true,
      marked_for_manual_deletion_by_id: 3,
      marked_for_manual_deletion_at: '2024-06-11T07:55:18.404Z',
      ticket_reference: 'ref123',
      comments: 'This is a test comment',
    },
    version: 'v2',
    chronicle_id: '33',
    antecedent_id: '44',
    retain_until: '2030-06-11T07:55:18.404Z',
    created_at: '2024-06-11T17:55:18.404Z',
    created_by_id: 1,
    last_modified_at: '2023-03-03T03:30:18.404Z',
    last_modified_by_id: 2,
    courthouse: {
      id: 0,
      display_name: 'Cardiff',
    },
    courtroom: {
      id: 0,
      name: 'Courtroom 1',
    },
    hearings: [
      {
        id: 0,
        hearing_date: '2020-02-20',
        case_id: 0,
      },
      {
        id: 1,
        hearing_date: '2020-03-25',
        case_id: 1,
      },
    ],
  });
});

router.post('/search', (req, res) => {
  if (req.body.case_number === 'NO_RESULTS') {
    res.send([]);
    return;
  }

  if (req.body.case_number === 'TOO_MANY_RESULTS') {
    res.status(400).send('Too many results found. Please refine your search.');
    return;
  }

  res.send(mediaSearchResults);
});

module.exports = router;
