const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();
router.use(express.json());

const audioRequestOne = {
  case_id: 1,
  request_id: 1234,
  case_id: 'T4565443',
  courthouse_name: 'Swansea',
  defendants: ['Derek Defender'],
  hearing_date: '2023-09-20',
  start_time: '2023-09-20T09:00:00Z',
  end_time: '2023-09-20T10:00:00Z',
};

const audioRequestMulti = [
  {
    case_id: 2,
    media_request_id: 12345,
    case_number: 'T20200190',
    courthouse_name: 'Manchester Minshull Street',
    hearing_date: '2022-01-03',
    media_request_start_ts: '2023-08-21T09:00:00Z',
    media_request_end_ts: '2023-08-21T10:00:00Z',
    media_request_expiry_ts: '2023-08-23T09:00:00Z',
    media_request_status: 'OPEN',
    last_accessed_ts: '2023-08-23T09:00:00Z',
    request_type: 'PLAYBACK',
    hearing_id: 1,
  },
  {
    case_id: 3,
    media_request_id: 12346,
    case_number: 'T2020019210',
    courthouse_name: 'Reading',
    hearing_date: '2021-01-02',
    media_request_start_ts: '2023-08-21T09:08:00Z',
    media_request_end_ts: '2023-08-21T10:14:00Z',
    media_request_expiry_ts: '2023-08-23T09:00:00Z',
    media_request_status: 'PROCESSING',
    last_accessed_ts: '2023-08-23T09:00:00Z',
    request_type: 'PLAYBACK',
    hearing_id: 3,
  },
  {
    case_id: 4,
    media_request_id: 12347,
    case_number: 'T20200192222',
    courthouse_name: 'Slough',
    hearing_date: '2023-11-12',
    media_request_start_ts: '2023-08-21T09:57:00Z',
    media_request_end_ts: '2023-08-21T10:43:00Z',
    media_request_expiry_ts: '2023-11-23T09:00:00Z',
    media_request_status: 'OPEN',
    last_accessed_ts: '2023-08-23T09:00:00Z',
    request_type: 'PLAYBACK',
    hearing_id: 3,
  },
  {
    case_id: 5,
    media_request_id: 12348,
    case_number: 'T20200192231',
    courthouse_name: 'Brighton',
    hearing_date: '2023-11-13',
    media_request_start_ts: '2023-08-21T09:57:00Z',
    media_request_end_ts: '2023-08-21T10:43:00Z',
    media_request_expiry_ts: '2023-11-23T09:00:00Z',
    media_request_status: 'FAILED',
    request_type: 'PLAYBACK',
    hearing_id: 3,
  },

  {
    case_id: 6,
    media_request_id: 12378,
    case_number: 'T20200331',
    courthouse_name: 'Liverpool',
    hearing_date: '2023-10-04',
    media_request_start_ts: '2023-08-21T09:00:00Z',
    media_request_end_ts: '2023-08-21T10:00:00Z',
    media_request_expiry_ts: '2023-08-23T09:00:00Z',
    media_request_status: 'COMPLETED',
    request_type: 'DOWNLOAD',
    hearing_id: 3,
    output_filename: 'T20200331',
    output_format: 'zip',
  },
  {
    case_id: 7,
    media_request_id: 12377,
    case_number: 'T20200333',
    courthouse_name: 'Liverpool',
    hearing_date: '2023-10-04',
    media_request_start_ts: '2023-08-21T09:00:00Z',
    media_request_end_ts: '2023-08-21T10:00:00Z',
    media_request_expiry_ts: '2023-08-23T09:00:00Z',
    media_request_status: 'COMPLETED',
    last_accessed_ts: '2023-08-23T09:00:00Z',
    request_type: 'PLAYBACK',
    hearing_id: 3,
    output_filename: 'T20200333',
    output_format: 'mp3',
  },
  {
    case_id: 7,
    media_request_id: 12376,
    case_number: 'T20200334',
    courthouse_name: 'Manchester',
    hearing_date: '2023-10-04',
    media_request_start_ts: '2023-08-21T09:00:00Z',
    media_request_end_ts: '2023-08-21T10:00:00Z',
    media_request_expiry_ts: '2023-08-23T09:00:00Z',
    media_request_status: 'COMPLETED',
    last_accessed_ts: '2023-08-23T09:00:00Z',
    hearing_id: 3,
    output_filename: 'T20200334',
    output_format: 'mp3',
    request_type: 'PLAYBACK',
  },
  {
    case_id: 8,
    media_request_id: 12342,
    case_number: 'T2020011820',
    courthouse_name: 'Ascot',
    hearing_date: '2023-11-13',
    media_request_start_ts: '2023-08-21T09:08:00Z',
    media_request_end_ts: '2023-08-21T10:14:00Z',
    media_request_expiry_ts: '2023-08-23T09:00:00Z',
    media_request_status: 'COMPLETED',
    request_type: 'PLAYBACK',
    hearing_id: 3,
    output_filename: 'T2020011820',
    output_format: 'mp3',
  },
  {
    case_id: 9,
    media_request_id: 12341,
    case_number: 'T2023453422',
    courthouse_name: 'Bournemouth',
    hearing_date: '2023-11-13',
    media_request_start_ts: '2023-11-13T09:00:00Z',
    media_request_end_ts: '2023-11-13T09:01:00Z',
    media_request_expiry_ts: '2023-11-23T09:00:00Z',
    media_request_status: 'COMPLETED',
    request_type: 'PLAYBACK',
    hearing_id: 3,
    output_filename: 'T2023453422',
    output_format: 'mp3',
  },
  {
    case_id: 10,
    media_request_id: 123443,
    case_number: 'T20200192232',
    courthouse_name: 'Brighton',
    hearing_date: '2023-11-13',
    media_request_start_ts: '2023-11-13T09:00:00Z',
    media_request_end_ts: '2023-11-13T09:01:00Z',
    media_request_expiry_ts: '2023-11-23T09:00:00Z',
    media_request_status: 'COMPLETED',
    request_type: 'PLAYBACK',
    hearing_id: 3,
    output_filename: 'T20200192232',
    output_format: 'mp3',
  },
  {
    case_id: 11,
    media_request_id: 123449,
    case_number: 'T20200192233',
    courthouse_name: 'Swindon',
    hearing_date: '2023-11-13',
    media_request_start_ts: '2023-11-13T09:00:00Z',
    media_request_end_ts: '2023-11-13T09:01:00Z',
    media_request_expiry_ts: '2023-11-23T09:00:00Z',
    media_request_status: 'COMPLETED',
    request_type: 'PLAYBACK',
    hearing_id: 3,
    output_filename: 'T20200192233',
    output_format: 'mp3',
  },
  {
    case_id: 12,
    media_request_id: 8080,
    case_number: 'C22334455',
    courthouse_name: 'Swindon',
    hearing_date: '2023-12-18',
    media_request_start_ts: '2023-08-21T09:57:00Z',
    media_request_end_ts: '2023-08-21T10:43:00Z',
    media_request_expiry_ts: '2023-11-23T09:00:00Z',
    media_request_status: 'COMPLETED',
    request_type: 'DOWNLOAD',
    hearing_id: 3,
    output_filename: 'C22334455',
    output_format: 'zip',
  },
];

const audioRequestMultiExpired = [
  {
    media_request_id: 444,
    case_number: 'T20202110',
    courthouse_name: 'Manchester Minshull Street',
    hearing_id: 3,
    hearing_date: '2023-10-13',
    media_request_start_ts: '2023-08-21T09:00:00Z',
    media_request_end_ts: '2023-08-21T10:00:00Z',
    media_request_expiry_ts: '2023-08-23T09:00:00Z',
    media_request_status: 'EXPIRED',
  },
  {
    media_request_id: 555,
    case_number: 'T202001232',
    courthouse_name: 'Reading',
    hearing_id: 3,
    hearing_date: '2023-11-21',
    media_request_start_ts: '2023-08-21T09:08:00Z',
    media_request_end_ts: '2023-08-21T10:14:00Z',
    media_request_expiry_ts: '2023-08-23T09:00:00Z',
    media_request_status: 'EXPIRED',
  },
  {
    media_request_id: 666,
    case_number: 'T20200192772',
    courthouse_name: 'Slough',
    hearing_id: 3,
    hearing_date: '2023-11-28',
    media_request_start_ts: '2023-08-21T09:57:00Z',
    media_request_end_ts: '2023-08-21T10:43:00Z',
    media_request_expiry_ts: '2023-11-23T09:00:00Z',
    media_request_status: 'EXPIRED',
  },
];

router.delete('/:requestId', (req, res) => {
  const requestId = req.params.requestId;
  const index = audioRequestMulti.findIndex((x) => x.media_request_id == requestId);
  const expiredIndex = audioRequestMultiExpired.findIndex((x) => x.media_request_id == requestId);

  if (index >= 0) {
    audioRequestMulti.splice(index, 1);
  }

  if (expiredIndex >= 0) {
    audioRequestMultiExpired.splice(index, 1);
  }

  res.sendStatus(204);
});

router.patch('/:requestId', (req, res) => {
  //Set specific media request last_accessed_ts value
  let id = req.params.requestId;
  audioRequestMulti.find((x) => x.media_request_id == id).last_accessed_ts = new Date().toISOString();
  res.sendStatus(204);
});

router.get('/playback', (req, res) => {
  const mediaReqId = req.query.media_request_id;
  if (mediaReqId !== '1') {
    var filePath = __dirname + '/preview/preview.mp3';
    var stat = fs.statSync(filePath);
    var total = stat.size;
    if (req.headers.range) {
      var range = req.headers.range;
      var parts = range.replace(/bytes=/, '').split('-');
      var partialstart = parts[0];
      var partialend = parts[1];

      var start = parseInt(partialstart, 10);
      var end = partialend ? parseInt(partialend, 10) : total - 1;
      var chunksize = end - start + 1;
      var readStream = fs.createReadStream(filePath, { start: start, end: end });
      res.writeHead(206, {
        'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'audio/mpeg',
      });
      readStream.pipe(res);
    } else {
      res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'audio/mpeg' });
      fs.createReadStream(filePath).pipe(res);
    }
  } else {
    res.sendStatus(403);
  }
});

router.get('/download', (req, res) => {
  const mediaReqId = req.query.media_request_id;
  if (mediaReqId !== '12377') {
    res.sendFile(path.join(__dirname, './preview', 'preview.mp3.zip'));
  } else {
    res.sendStatus(403);
  }
});

router.get('/not-accessed-count', (req, res) => {
  let count = 0;
  audioRequestMulti.forEach((request) => {
    if (request.media_request_status === 'COMPLETED' && !request.last_accessed_ts) count++;
  });
  res.send({ count });
});

router.post('', (req, res) => {
  if (req.body?.hearing_id === 3) {
    res.sendStatus(403);
  } else {
    res.send(audioRequestOne);
  }
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
