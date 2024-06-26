const express = require('express');
const router = express.Router();
const { DateTime } = require('luxon');

const media = [
  {
    id: 0,
    channel: 1,
    start_at: '2020-06-01T17:00:00Z',
    end_at: '2020-06-01T18:00:00Z',
    case: {
      id: 1,
      case_number: '001',
    },
    hearing: {
      id: 1,
      hearing_date: '2020-06-01',
    },
    courthouse: {
      id: 1,
      display_name: 'courthouse 12',
    },
    courtroom: {
      id: 1,
      display_name: 'courtroom 11',
    },
  },
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
  const hearingIds = req.query.hearing_ids;
  const startAt = req.query.start_at;
  const endAt = req.query.end_at;

  res.send(media);
});

router.post('/:id/hide', (req, res) => {
  const body = req.body;

  const response = {
    id: 0,
    is_hidden: true,
    is_deleted: false,
    admin_action: {
      id: 0,
      reason_id: body.admin_action.reason_id,
      hidden_by_id: 0,
      hidden_at: DateTime.now().toISO(),
      is_marked_for_manual_deletion: false,
      marked_for_manual_deletion_by_id: 0,
      marked_for_manual_deletion_at: DateTime.now().toISO(),
      ticket_reference: body.admin_action.ticket_reference,
      comments: body.admin_action.comments,
    },
  };

  res.send(response);
});

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const media = {
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
  };

  if (id === 0) {
    media.is_hidden = false;
    media.is_deleted = false;
    media.admin_action.is_marked_for_manual_deletion = false;
  }

  res.send(media);
});

module.exports = router;
