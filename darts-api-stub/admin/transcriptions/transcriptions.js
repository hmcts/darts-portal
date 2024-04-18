const express = require('express');
const { userIdHasAnyRoles } = require('../../users');
const { SUPER_ADMIN } = require('../../roles');

const router = express.Router();

const transcripts = [
  {
    transcription_id: 1,
    case_number: 'C0000000001',
    courthouse_id: 1,
    hearing_date: '2022-01-01T01:00:00Z',
    requested_at: '2023-01-01T02:00:00Z',
    transcription_status_id: 1,
    is_manual_transcription: true,
  },
  {
    transcription_id: 2,
    case_number: 'C0000000002',
    courthouse_id: 2,
    hearing_date: '2022-01-02T03:00:00Z',
    requested_at: '2023-01-02T04:00:00Z',
    transcription_status_id: 1,
    is_manual_transcription: false,
  },
  {
    transcription_id: 3,
    case_number: 'C0000000003',
    courthouse_id: 3,
    hearing_date: '2022-01-03T05:00:00Z',
    requested_at: '2023-01-03T06:00:00Z',
    transcription_status_id: 2,
    is_manual_transcription: true,
  },
  {
    transcription_id: 4,
    case_number: 'C0000000004',
    courthouse_id: 4,
    hearing_date: '2022-01-04T07:00:00Z',
    requested_at: '2023-01-04T08:00:00Z',
    transcription_status_id: 3,
    is_manual_transcription: false,
  },
  {
    transcription_id: 5,
    case_number: 'C0000000005',
    courthouse_id: 5,
    hearing_date: '2022-01-05T09:00:00Z',
    requested_at: '2023-01-05T10:00:00Z',
    transcription_status_id: 4,
    is_manual_transcription: true,
  },
  {
    transcription_id: 6,
    case_number: 'C0000000006',
    courthouse_id: 6,
    hearing_date: '2022-01-06T11:00:00Z',
    requested_at: '2023-01-06T12:00:00Z',
    transcription_status_id: 5,
    is_manual_transcription: false,
  },
];

function authCheck(req, res) {
  if (!userIdHasAnyRoles([SUPER_ADMIN], req.headers.user_id))
    return res.status(403).send({
      detail: `You do not have permission`,
    });
}

router.get('/', (req, res) => {
  authCheck(req, res);
  res.send(transcripts);
});

router.post('/search', (req, res) => {
  authCheck(req, res);

  if (req.body.transcription_id) {
    return res.send(transcripts.filter((t) => t.transcription_id === req.body.transcription_id));
  }

  if (req.body.case_number) return res.send(transcripts.filter((t) => t.case_number === req.body.case_number));

  res.send(transcripts);
});

module.exports = router;
