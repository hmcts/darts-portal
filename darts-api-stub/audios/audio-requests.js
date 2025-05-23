const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();
router.use(express.json());

const audioRequestOne = {
  request_id: 1234,
  case_id: 'T4565443',
  courthouse_name: 'Swansea',
  defendants: ['Derek Defender'],
  hearing_date: '2023-09-20',
  start_time: '2023-09-20T09:00:00Z',
  end_time: '2023-09-20T10:00:00Z',
};

const defaultMediaRequests = {
  media_request_details: [
    {
      case_id: 1,
      media_request_id: 3,
      case_number: 'C0',
      courthouse_name: 'Newport',
      hearing_date: '2023-02-01',
      start_ts: '2023-08-21T10:00:00Z',
      end_ts: '2023-08-21T11:00:00Z',
      media_request_status: 'OPEN',
      request_type: 'PLAYBACK',
      hearing_id: 2,
    },
    {
      case_id: 1,
      media_request_id: 2,
      case_number: 'C1',
      courthouse_name: 'Cardiff',
      hearing_date: '2024-01-02',
      start_ts: '2023-08-21T09:00:00Z',
      end_ts: '2023-08-21T10:00:00Z',
      media_request_status: 'IN PROGRESS',
      request_type: 'PLAYBACK',
      hearing_id: 1,
    },
    {
      case_id: 3,
      media_request_id: 1,
      case_number: 'C2',
      courthouse_name: 'Swansea',
      hearing_date: '2023-02-01',
      start_ts: '2023-08-21T10:00:00Z',
      end_ts: '2023-08-21T11:00:00Z',
      media_request_status: 'FAILED',
      request_type: 'PLAYBACK',
      hearing_id: 2,
    },
  ],
  transformed_media_details: [
    {
      case_id: 3,
      media_request_id: 3,
      case_number: 'C3',
      courthouse_name: 'Reading',
      hearing_date: '2022-01-04',
      start_ts: '2022-01-04T09:00:00Z',
      end_ts: '2022-01-04T10:00:00Z',
      transformed_media_expiry_ts: '2022-01-04T09:00:00Z',
      media_request_status: 'COMPLETED',
      request_type: 'DOWNLOAD',
      last_accessed_ts: '',
      transformed_media_filename: 'C3.zip',
      transformed_media_format: 'ZIP',
      transformed_media_id: 4,
      hearing_id: 3,
    },
    {
      case_id: 4,
      media_request_id: 4,
      case_number: 'C4_Playback',
      courthouse_name: 'Cardiff',
      hearing_date: '2023-11-13',
      start_ts: '2023-11-13T09:00:00Z',
      end_ts: '2023-11-13T09:01:00Z',
      transformed_media_expiry_ts: '2023-11-13T09:00:00Z',
      media_request_status: 'COMPLETED',
      request_type: 'PLAYBACK',
      last_accessed_ts: '',
      transformed_media_filename: 'C4_Playback.mp3',
      transformed_media_format: 'MP3',
      transformed_media_id: 5,
      hearing_id: 4,
    },
    {
      case_id: 5,
      media_request_id: 5,
      case_number: 'C5_NoDownloadPermissions',
      courthouse_name: 'Swansea',
      hearing_date: '2022-01-04',
      start_ts: '2022-01-04T09:00:00Z',
      end_ts: '2022-01-04T10:00:00Z',
      transformed_media_expiry_ts: '2022-01-04T09:00:00Z',
      media_request_status: 'COMPLETED',
      request_type: 'PLAYBACK',
      last_accessed_ts: '',
      transformed_media_filename: 'C5_NoDownloadPermissions.mp3',
      transformed_media_format: 'MP3',
      transformed_media_id: 6,
      hearing_id: 5,
    },
    {
      case_id: 6,
      media_request_id: 6,
      case_number: 'C6_ViewAndDeleteMe',
      courthouse_name: 'Newcastle',
      hearing_date: '2022-01-04',
      start_ts: '2022-01-04T09:00:00Z',
      end_ts: '2022-01-04T10:00:00Z',
      transformed_media_expiry_ts: '2022-01-04T09:00:00Z',
      media_request_status: 'COMPLETED',
      request_type: 'PLAYBACK',
      last_accessed_ts: '',
      transformed_media_filename: 'C6_ViewAndDeleteMe.mp3',
      transformed_media_format: 'MP3',
      transformed_media_id: 7,
      hearing_id: 6,
    },
    {
      case_id: 7,
      media_request_id: 7,
      case_number: 'C7_DeleteMe',
      courthouse_name: 'Windsor',
      hearing_date: '2022-01-04',
      start_ts: '2022-01-04T09:00:00Z',
      end_ts: '2022-01-04T10:00:00Z',
      transformed_media_expiry_ts: '2022-01-04T09:00:00Z',
      media_request_status: 'COMPLETED',
      request_type: 'PLAYBACK',
      last_accessed_ts: '',
      transformed_media_filename: 'C7_DeleteMe.mp3',
      transformed_media_format: 'MP3',
      transformed_media_id: 8,
      hearing_id: 7,
    },
  ],
};

let mediaRequests = structuredClone(defaultMediaRequests);

const expiredMediaRequests = {
  // media_request_details: [], isn't returned by the API when expired=true
  transformed_media_details: [
    {
      case_id: 99,
      media_request_id: 99,
      case_number: 'C99',
      courthouse_name: 'Cardiff',
      hearing_date: '2022-01-04',
      start_ts: '2022-01-04T09:00:00Z',
      end_ts: '2022-01-04T10:00:00Z',
      transformed_media_expiry_ts: '2022-01-04T09:00:00Z',
      media_request_status: 'EXPIRED',
      request_type: 'PLAYBACK',
      last_accessed_ts: '2022-01-04T09:00:00Z',
      transformed_media_filename: 'C99',
      transformed_media_format: 'MP3',
      transformed_media_id: 99,
      hearing_id: 99,
    },
  ],
};

router.get('/reset', (req, res) => {
  mediaRequests = structuredClone(defaultMediaRequests);
  res.sendStatus(200);
});

router.delete('/transformed_media/:transformedMediaId', (req, res) => {
  let id = req.params.transformedMediaId;
  const index = mediaRequests.transformed_media_details.findIndex((x) => x.transformed_media_id == id);
  const expiredIndex = expiredMediaRequests.transformed_media_details.findIndex((x) => x.transformed_media_id == id);
  const clearIndex = mediaRequests.media_request_details.findIndex((x) => x.transformed_media_id == id);

  if (index >= 0) {
    mediaRequests.transformed_media_details.splice(index, 1);
  }

  if (expiredIndex >= 0) {
    expiredMediaRequests.transformed_media_details.splice(index, 1);
  }

  if (clearIndex >= 0) {
    mediaRequests.media_request_details.splice(index, 1);
  }

  res.sendStatus(204);
});

router.delete('/:requestId', (req, res) => {
  const requestId = req.params.requestId;
  const index = mediaRequests.transformed_media_details.findIndex((x) => x.media_request_id == requestId);
  const expiredIndex = expiredMediaRequests.transformed_media_details.findIndex((x) => x.media_request_id == requestId);
  const clearIndex = mediaRequests.media_request_details.findIndex((x) => x.media_request_id == requestId);

  if (index >= 0) {
    mediaRequests.transformed_media_details.splice(index, 1);
  }

  if (expiredIndex >= 0) {
    expiredMediaRequests.transformed_media_details.splice(index, 1);
  }

  if (clearIndex >= 0) {
    mediaRequests.media_request_details.splice(index, 1);
  }

  res.sendStatus(204);
});

router.patch('/transformed_media/:transformedMediaId', (req, res) => {
  //Set specific media request last_accessed_ts value
  let id = req.params.transformedMediaId;
  mediaRequests.transformed_media_details.find((x) => x.transformed_media_id == id).last_accessed_ts =
    new Date().toISOString();
  res.sendStatus(204);
});

router.get('/playback', (req, res) => {
  const transformedMediaId = req.query.transformed_media_id;
  if (transformedMediaId !== '6') {
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
  const transformedMediaId = req.query.transformed_media_id;
  if (transformedMediaId !== '5') {
    res.sendFile(path.join(__dirname, './preview', 'preview.mp3.zip'));
  } else {
    res.sendStatus(403);
  }
});

router.get('/not-accessed-count', (req, res) => {
  let count = 0;
  mediaRequests.transformed_media_details.forEach((request) => {
    if (request.media_request_status === 'COMPLETED' && !request.last_accessed_ts) count++;
  });
  res.send({ count });
});

router.post('/download', (req, res) => {
  switch (req.body?.hearing_id) {
    case 3:
      res.sendStatus(403);
      break;
    case 5:
      res.sendStatus(409);
      break;
    case 6:
      res.sendStatus(413);
      break;
    default:
      res.send(audioRequestOne);
  }
});

router.post('/playback', (req, res) => {
  switch (req.body?.hearing_id) {
    case 3:
      res.sendStatus(403);
      break;
    case 5:
      res.sendStatus(409);
      break;
    case 6:
      res.sendStatus(413);
      break;
    default:
      res.send(audioRequestOne);
  }
});

router.get('/v2', (req, res) => {
  const expired = Boolean(JSON.parse(req.query.expired));
  if (!expired) {
    res.send(mediaRequests);
  } else {
    res.send(expiredMediaRequests);
  }
});

module.exports = router;
