const express = require('express');
const { DateTime } = require('luxon');
const router = express.Router();

const caseSearchResults = [
  {
    id: 1,
    case_number: '123456',
    courthouse: {
      id: 1,
      display_name: 'Courthouse 1',
    },
    courtrooms: [
      {
        id: 1,
        name: 'Courtroom 1',
      },
      {
        id: 2,
        name: 'Courtroom 2',
      },
    ],
    judges: ['Judge 1', 'Judge 2'],
    defendants: ['Defendant 1', 'Defendant 2'],
  },
  {
    id: 2,
    case_number: '654321',
    courthouse: {
      id: 2,
      display_name: 'Courthouse 2',
    },
    courtrooms: [
      {
        id: 2,
        name: 'Courtroom 2',
      },
    ],
    judges: ['Judge 3'],
    defendants: ['Defendant 3'],
  },
  {
    id: 3,
    case_number: '8714155',
    courthouse: {
      id: 3,
      display_name: 'Courthouse 3',
    },
    courtrooms: [
      {
        id: 3,
        name: 'Courtroom 3',
      },
    ],
    judges: ['Judge 4'],
    defendants: ['Defendant 4'],
    is_data_anonymised: true,
    data_anonymised_at: '2023-08-10T11:53:24.858Z',
  },
];

const singleCase = {
  id: 1,
  courthouse: {
    id: 1001,
    display_name: 'SWANSEA',
  },
  case_number: 'CASE1001',
  defendants: ['Joe Bloggs'],
  judges: ['Mr Judge'],
  prosecutors: ['Mrs Prosecutor'],
  defenders: ['Mr Defender'],
  reporting_restrictions: [
    {
      event_id: 123,
      event_name: 'Verdict',
      event_text: 'Manually entered text',
      hearing_id: 123,
      event_ts: '2024-01-01T00:00:00Z',
    },
  ],
  retain_until_date_time: '2020-01-31T15:42:10.361Z',
  case_closed_date_time: '2023-07-20T15:42:10.361Z',
  is_retention_updated: true,
  retention_retries: 0,
  retention_date_time_applied: '2023-07-22T15:42:10.361Z',
  retention_policy_applied: 'MANUAL',
  ret_conf_score: 123,
  ret_conf_reason: 'Some reason',
  ret_conf_updated_ts: '2024-01-01T00:00:00Z',
  case_object_id: '12345',
  case_object_name: 'NAME',
  case_type: 'Type A',
  upload_priority: 0,
  case_status: 'OPEN',
  created_at: '2024-01-01T00:00:00Z',
  created_by: 3,
  last_modified_at: '2024-01-01T00:00:00Z',
  last_modified_by: 2,
  is_deleted: false,
  case_deleted_at: '2024-01-01T00:00:00Z',
  case_deleted_by: 4,
  is_data_anonymised: false,
  data_anonymised_at: '2024-01-01T00:00:00Z',
  data_anonymised_by: 5,
  is_interpreter_used: false,
};

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
      type: 'CASE_100',
      title: 'Too many results have been returned. Please change search criteria.',
      status: 400,
    });
    return;
  }

  res.send(caseSearchResults);
});

router.get('/:id', (req, res) => {
  if (req.params.id == 3) {
    res.send({ ...singleCase, is_data_anonymised: true });
  } else {
    res.send(singleCase);
  }
});

router.get('/:id/audios', (req, res) => {
  const pageNumber = parseInt(req.query.page_number) || null;
  const pageSize = parseInt(req.query.page_size) || null;
  const sortBy = req.query.sort_by;
  const sortOrder = (req.query.sort_order || 'ASC').toUpperCase();

  const validSortFields = ['audioId', 'startTime', 'endTime', 'channel', 'courtroom'];
  const startBase = DateTime.fromISO('2024-06-11T07:55:18.404Z');
  const channels = [1, 2, 3, 4];
  const totalAudios = 1650; // Total number of audios to generate

  const generatedAudios = Array.from({ length: totalAudios }, (_, i) => {
    const start_at = startBase.plus({ seconds: i * 30 });
    const end_at = start_at.plus({ seconds: 29 });

    return {
      id: i + 1,
      start_at: start_at.toISO(),
      end_at: end_at.toISO(),
      channel: channels[Math.floor(Math.random() * channels.length)],
      courtroom: `Courtroom ${Math.floor(Math.random() * 5) + 1}`,
    };
  });

  const sortFieldMap = {
    audioId: 'id',
    startTime: 'start_at',
    endTime: 'end_at',
    channel: 'channel',
    courtroom: 'courtroom',
  };

  let sortedAudios = [...generatedAudios];
  if (sortBy && sortFieldMap[sortBy]) {
    const actualKey = sortFieldMap[sortBy];

    sortedAudios.sort((a, b) => {
      const valA = a[actualKey];
      const valB = b[actualKey];

      if (valA < valB) return sortOrder === 'ASC' ? -1 : 1;
      if (valA > valB) return sortOrder === 'ASC' ? 1 : -1;
      return 0;
    });
  }

  if (pageNumber && pageSize) {
    const start = (pageNumber - 1) * pageSize;
    const pagedData = sortedAudios.slice(start, start + pageSize);

    return res.send({
      current_page: pageNumber,
      page_size: pageSize,
      total_pages: Math.ceil(sortedAudios.length / pageSize),
      total_items: sortedAudios.length,
      data: pagedData,
    });
  }

  res.send(sortedAudios);
});

module.exports = router;
