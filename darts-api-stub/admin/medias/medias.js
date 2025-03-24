const express = require('express');
const router = express.Router();
const { DateTime } = require('luxon');

const medias = [
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
    is_hidden: false,
    is_current: true,
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
    is_hidden: false,
    is_current: true,
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
    is_hidden: false,
    is_current: true,
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
    is_hidden: false,
    is_current: false,
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
    is_hidden: true,
    is_current: false,
  },
  {
    id: 4,
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
    is_hidden: true,
    is_current: false,
  },
  {
    id: 409,
    channel: 4,
    start_at: '2020-08-01T16:00:00Z',
    end_at: '2020-08-01T17:00:00Z',
    case: {
      id: 4,
      case_number: '101',
    },
    hearing: {
      id: 4,
      hearing_date: '2020-09-01',
    },
    courthouse: {
      id: 4,
      display_name: 'courthouse 4',
    },
    courtroom: {
      id: 4,
      display_name: 'courtroom 4',
    },
    is_hidden: false,
    is_current: false,
  },
];

const defaultMarkedForDeletionMedia = [
  {
    media: [
      {
        id: 1,
        channel: 1,
        total_channels: 4,
        is_current: true,
        version_count: 1,
      },
      {
        id: 2,
        channel: 2,
        total_channels: 4,
        is_current: true,
        version_count: 1,
      },
      {
        id: 3,
        channel: 3,
        total_channels: 4,
        is_current: true,
        version_count: 1,
      },
      {
        id: 4,
        channel: 4,
        total_channels: 4,
        is_current: true,
        version_count: 1,
      },
    ],
    start_at: '2024-01-01T10:00:00Z',
    end_at: '2024-01-01T11:30:00Z',
    courthouse: {
      id: 0,
      display_name: 'Cardiff',
    },
    courtroom: {
      id: 0,
      name: '9',
    },
    admin_action: {
      reason_id: 3,
      hidden_by_id: 1,
      ticket_reference: '1234REF1',
      comments: ['This has been marked for deletion', 'This is a test comment'],
    },
  },
  {
    media: [
      {
        id: 1,
        channel: 1,
        total_channels: 4,
        is_current: true,
        version_count: 1,
      },
      {
        id: 2,
        channel: 2,
        total_channels: 4,
        is_current: true,
        version_count: 1,
      },
      {
        id: 3,
        channel: 3,
        total_channels: 4,
        is_current: true,
        version_count: 1,
      },
    ],
    start_at: '2024-03-01T11:00:00Z',
    end_at: '2024-03-01T11:30:00Z',
    courthouse: {
      id: 0,
      display_name: 'Birmingham',
    },
    courtroom: {
      id: 0,
      name: '11',
    },
    admin_action: {
      hidden_by_id: 1,
      reason_id: 1,
      ticket_reference: '9987REF00',
      comments: ['This has been marked for deletion', 'This is a test comment'],
    },
  },
  {
    media: [
      {
        id: 1,
        channel: 1,
        total_channels: 4,
        is_current: true,
        version_count: 1,
      },
      {
        id: 2,
        channel: 2,
        total_channels: 4,
        is_current: true,
        version_count: 1,
      },
    ],
    start_at: '2024-03-03T15:00:00Z',
    end_at: '2024-03-03T15:22:00Z',
    courthouse: {
      id: 0,
      display_name: 'Manchester',
    },
    courtroom: {
      id: 0,
      name: '11',
    },
    admin_action: {
      reason_id: 2,
      hidden_by_id: 5,
      ticket_reference: '122REF224',
      comments: ['Manchester audio file marked for deletion'],
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

const defaultMedia = {
  id: 0,
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
  checksum: '2963841',
  media_status: 'media status',
  is_hidden: true,
  is_deleted: true,
  is_current: true,
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
  cases: [
    {
      id: null,
      case_number: 'CASE1',
      source: 'Add Audio Metadata',
      courthouse: {
        id: 0,
        display_name: 'Courthouse 321',
      },
    },
    {
      id: 1,
      case_number: 'CASE2',
      source: 'Source Type 3',
      courthouse: {
        id: 1,
        display_name: 'Courthouse 123',
      },
    },
  ],

  hearings: [
    {
      id: 0,
      case_id: 0,
      case_number: 'CASE1',
      hearing_date: '2024-06-11',
      courthouse: {
        id: 0,
        display_name: 'Courthouse 321',
      },
      courtroom: {
        id: 0,
        name: 'Courtroom 1',
      },
    },
    {
      id: 1,
      case_id: 1,
      case_number: 'CASE2',
      hearing_date: '2024-06-11',
      courthouse: {
        id: 1,
        display_name: 'Courthouse 123',
      },
      courtroom: {
        id: 1,
        name: 'Courtroom 2',
      },
    },
  ],
};

const versions = {
  media_object_id: 'media_12345',
  current_version: {
    id: 101,
    courthouse: {
      id: 5,
      display_name: 'London Crown Court',
    },
    courtroom: {
      id: 12,
      name: 'Courtroom A',
    },
    start_at: '2024-06-11T08:30:00.000Z',
    end_at: '2024-06-11T09:15:00.000Z',
    channel: 3,
    chronicle_id: 'chronicle_456',
    antecedent_id: 'antecedent_789',
    is_current: true,
    created_at: '2024-06-11T10:00:00.000Z',
  },
  previous_versions: [
    {
      id: 100,
      courthouse: {
        id: 5,
        display_name: 'London Crown Court',
      },
      courtroom: {
        id: 11,
        name: 'Courtroom B',
      },
      start_at: '2024-06-10T14:00:00.000Z',
      end_at: '2024-06-10T14:45:00.000Z',
      channel: 2,
      chronicle_id: 'chronicle_123',
      antecedent_id: 'antecedent_456',
      is_current: false,
      created_at: '2024-06-10T16:00:00.000Z',
    },
    {
      id: 101,
      courthouse: {
        id: 5,
        display_name: 'London Crown Court',
      },
      courtroom: {
        id: 11,
        name: 'Courtroom B',
      },
      start_at: '2024-06-10T14:00:00.000Z',
      end_at: '2024-06-10T14:45:00.000Z',
      channel: 2,
      chronicle_id: 'chronicle_123',
      antecedent_id: 'antecedent_456',
      is_current: false,
      created_at: '2024-06-10T16:00:00.000Z',
    },
  ],
};

let updatedMedia = [];
let media = { ...defaultMedia };
let markedForDeletionMedia = [...defaultMarkedForDeletionMedia];

router.get('/reset', (req, res) => {
  media = { ...defaultMedia };
  markedForDeletionMedia = [...defaultMarkedForDeletionMedia];
  updatedMedia = [];
  res.sendStatus(202);
});

router.get('/', (req, res) => {
  const transformed_media_id = req.query.transformed_media_id;
  const transcription_document_id = req.query.transcription_document_id;
  const hearingIds = +req.query.hearing_ids;
  const startAt = req.query.start_at;
  const endAt = req.query.end_at;

  if (hearingIds === 11) {
    return res.send([{ ...medias[0], id: 11 }]);
  }

  res.send(medias);
});

router.get('/marked-for-deletion', (req, res) => {
  res.send(markedForDeletionMedia);
});

router.post('/:id/hide', (req, res) => {
  const body = req.body;
  let response;

  if (req.params.id === '409') {
    res.sendStatus(409);
    return;
  }

  if (body.is_hidden) {
    response = {
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
  } else {
    media.is_hidden = false;
    media.is_deleted = false;
    media.admin_action.is_marked_for_manual_deletion = false;
    updatedMedia.push(parseInt(req.params.id));

    response = {
      id: 0,
      is_hidden: false,
      is_deleted: false,
    };
  }

  res.send(response);
});

router.get('/:id/versions', (req, res) => {
  res.send(versions);
});

router.get('/:id', (req, res) => {
  media.id = parseInt(req.params.id);

  if (media.id === 0) {
    media.is_hidden = false;
    media.is_deleted = false;
    media.admin_action.is_marked_for_manual_deletion = false;
  } else if (!updatedMedia.includes(media.id)) {
    media.is_hidden = true;
    media.is_deleted = true;
    media.admin_action.is_marked_for_manual_deletion = true;
  }

  if (media.id === 2) {
    // Set expired banner
    res.send({ ...media, retain_until: '2022-02-02T09:00:00Z' });
    return;
  }

  if (media.id === 11) {
    // Set hearing id to 11 to ensure no associated audio
    res.send({
      ...media,
      hearings: [
        {
          id: 11,
          hearing_date: '2020-02-20',
          case_id: 0,
          courthouse: {
            id: 0,
            display_name: 'Courthouse 321',
          },
          courtroom: {
            id: 0,
            name: 'Courtroom 1',
          },
        },
      ],
    });
    return;
  }

  res.send(media);
});

router.post('/:id/approve-deletion', (req, res) => {
  const id = req.params.id;

  const index = markedForDeletionMedia.findIndex((m) => m.media.some((media) => media.id === parseInt(id)));

  if (index !== -1) {
    markedForDeletionMedia[index].admin_action.is_marked_for_manual_deletion = true;
    markedForDeletionMedia[index].admin_action.marked_for_manual_deletion_by_id = 1;
    markedForDeletionMedia[index].admin_action.marked_for_manual_deletion_at = DateTime.now().toISO();

    return res.send({ is_hidden: true, is_deleted: false, ...markedForDeletionMedia[index] });
  }

  res.sendStatus(200);
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
