const express = require('express');

const router = express.Router();

// const audioRequestOne = {
//   request_id: 1234,
//   case_id: 'T4565443',
//   courthouse_name: 'Swansea',
//   defendants: ['Derek Defender'],
//   hearing_date: '2023-09-20',
//   start_time: '2023-09-20T09:00:00Z',
//   end_time: '2023-09-20T10:00:00Z',
// };

const audioRequestMulti = [
  {
    media_request_id: 12345,
    case_number: 'T20200190',
    courthouse_name: 'Manchester Minshull Street',
    hearing_date: '2023-10-03',
    media_request_start_ts: '2023-08-21T09:00:00Z',
    media_request_end_ts: '2023-08-21T10:00:00Z',
    media_request_expiry_ts: '2023-08-23T09:00:00Z',
    media_request_status: 'OPEN',
    last_accessed_ts: '2023-08-23T09:00:00Z',
  },
  {
    media_request_id: 12346,
    case_number: 'T2020019210',
    courthouse_name: 'Reading',
    hearing_date: '2023-11-13',
    media_request_start_ts: '2023-08-21T09:08:00Z',
    media_request_end_ts: '2023-08-21T10:14:00Z',
    media_request_expiry_ts: '2023-08-23T09:00:00Z',
    media_request_status: 'PROCESSING',
    last_accessed_ts: '2023-08-23T09:00:00Z',
  },
  {
    media_request_id: 12347,
    case_number: 'T20200192222',
    courthouse_name: 'Slough',
    hearing_date: '2023-11-12',
    media_request_start_ts: '2023-08-21T09:57:00Z',
    media_request_end_ts: '2023-08-21T10:43:00Z',
    media_request_expiry_ts: '2023-11-23T09:00:00Z',
    media_request_status: 'OPEN',
    last_accessed_ts: '2023-08-23T09:00:00Z',
  },

  {
    media_request_id: 12347,
    case_number: 'T20200192231',
    courthouse_name: 'Brighton',
    hearing_date: '2023-11-13',
    media_request_start_ts: '2023-08-21T09:57:00Z',
    media_request_end_ts: '2023-08-21T10:43:00Z',
    media_request_expiry_ts: '2023-11-23T09:00:00Z',
    media_request_status: 'FAILED',
  },

  {
    media_request_id: 12378,
    case_number: 'T20200331',
    courthouse_name: 'Liverpool',
    hearing_date: '2023-10-04',
    media_request_start_ts: '2023-08-21T09:00:00Z',
    media_request_end_ts: '2023-08-21T10:00:00Z',
    media_request_expiry_ts: '2023-08-23T09:00:00Z',
    media_request_status: 'COMPLETED',
  },
  {
    media_request_id: 12377,
    case_number: 'T20200333',
    courthouse_name: 'Liverpool',
    hearing_date: '2023-10-04',
    media_request_start_ts: '2023-08-21T09:00:00Z',
    media_request_end_ts: '2023-08-21T10:00:00Z',
    media_request_expiry_ts: '2023-08-23T09:00:00Z',
    media_request_status: 'COMPLETED',
    last_accessed_ts: '2023-08-23T09:00:00Z',
  },
  {
    media_request_id: 12342,
    case_number: 'T2020011820',
    courthouse_name: 'Ascot',
    hearing_date: '2023-11-13',
    media_request_start_ts: '2023-08-21T09:08:00Z',
    media_request_end_ts: '2023-08-21T10:14:00Z',
    media_request_expiry_ts: '2023-08-23T09:00:00Z',
    media_request_status: 'COMPLETED',
  },
  {
    media_request_id: 12341,
    case_number: 'T2023453422',
    courthouse_name: 'Bournemouth',
    hearing_date: '2023-11-15',
    media_request_start_ts: '2023-08-21T09:57:00Z',
    media_request_end_ts: '2023-08-21T10:43:00Z',
    media_request_expiry_ts: '2023-11-23T09:00:00Z',
    media_request_status: 'COMPLETED',
  },
  {
    media_request_id: 123443,
    case_number: 'T20200192231',
    courthouse_name: 'Brighton',
    hearing_date: '2023-11-13',
    media_request_start_ts: '2023-08-21T09:57:00Z',
    media_request_end_ts: '2023-08-21T10:43:00Z',
    media_request_expiry_ts: '2023-11-23T09:00:00Z',
    media_request_status: 'COMPLETED',
  },
  {
    media_request_id: 123449,
    case_number: 'T202001922310202',
    courthouse_name: 'Swindon',
    hearing_date: '2023-11-13',
    media_request_start_ts: '2023-08-21T09:57:00Z',
    media_request_end_ts: '2023-08-21T10:43:00Z',
    media_request_expiry_ts: '2023-11-23T09:00:00Z',
    media_request_status: 'COMPLETED',
  },
];

const audioRequestMultiExpired = [
  {
    media_request_id: 12311,
    case_number: 'T20202110',
    courthouse_name: 'Manchester Minshull Street',
    hearing_date: '2023-10-13',
    media_request_start_ts: '2023-08-21T09:00:00Z',
    media_request_end_ts: '2023-08-21T10:00:00Z',
    media_request_expiry_ts: '2023-08-23T09:00:00Z',
    media_request_status: 'EXPIRED',
  },
  {
    media_request_id: 123123,
    case_number: 'T202001232',
    courthouse_name: 'Reading',
    hearing_date: '2023-11-21',
    media_request_start_ts: '2023-08-21T09:08:00Z',
    media_request_end_ts: '2023-08-21T10:14:00Z',
    media_request_expiry_ts: '2023-08-23T09:00:00Z',
    media_request_status: 'EXPIRED',
  },
  {
    media_request_id: 4321,
    case_number: 'T20200192772',
    courthouse_name: 'Slough',
    hearing_date: '2023-11-28',
    media_request_start_ts: '2023-08-21T09:57:00Z',
    media_request_end_ts: '2023-08-21T10:43:00Z',
    media_request_expiry_ts: '2023-11-23T09:00:00Z',
    media_request_status: 'EXPIRED',
  },
];

router.patch('/:requestId', (req, res) => {
  //Set specific media request last_accessed_ts value
  let id = req.params.requestId;
  audioRequestMulti.find((x) => x.media_request_id == id).last_accessed_ts = new Date().toISOString();
  res.sendStatus(200);
});

router.post('', (req, res) => {
  res.send(audioRequestOne);
});

router.get('', (req, res) => {
  const expired = Boolean(JSON.parse(req.query.expired));
  if (!expired) {
    res.send(audioRequestMulti);
  } else {
    res.send(audioRequestMultiExpired);
  }
});

module.exports = router;
