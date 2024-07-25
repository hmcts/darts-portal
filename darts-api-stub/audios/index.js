const express = require('express');
const fs = require('fs');
const router = express.Router();

router.get('/hearings/:hearingId/audios', (req, res) => {
  switch (req.params.hearingId) {
    case '1':
      const body1 = [
        {
          id: 1,
          media_start_timestamp: '2023-07-31T02:32:24.620Z',
          media_end_timestamp: '2023-07-31T14:32:24.620Z',
          is_available: true,
        },
        {
          id: 2,
          media_start_timestamp: '2023-07-31T04:30:24.620Z',
          media_end_timestamp: '2023-07-31T14:32:24.620Z',
          is_available: true,
        },
        {
          id: 3,
          media_start_timestamp: '2023-07-31T05:32:24.620Z',
          media_end_timestamp: '2023-07-31T14:32:24.620Z',
          is_available: true,
        },
        {
          id: 4,
          media_start_timestamp: '2023-07-31T18:00:00.620Z',
          media_end_timestamp: '2023-07-31T18:01:00.620Z',
          is_available: true,
        },
        {
          id: 5,
          media_start_timestamp: '2023-07-31T19:00:00.620Z',
          media_end_timestamp: '2023-07-31T19:01:00.620Z',
          is_available: true,
        },
        {
          id: 6,
          media_start_timestamp: '2023-07-31T20:00:00.620Z',
          media_end_timestamp: '2023-07-31T20:01:00.620Z',
          is_available: true,
        },
        {
          id: 7,
          media_start_timestamp: '2023-07-31T20:32:24.620Z',
          media_end_timestamp: '2023-07-31T20:35:24.620Z',
          is_available: false,
        },
      ];
      res.send(body1);
      break;
    case '2':
      const body2 = [
        {
          id: 4,
          media_start_timestamp: '2023-07-31T09:32:24.620Z',
          media_end_timestamp: '2023-07-31T09:35:24.620Z',
          is_archived: true,
          is_available: true,
        },
      ];
      res.send(body2);
      break;
    case '3':
      const body3 = [
        {
          id: 5,
          media_start_timestamp: '2023-07-21T08:32:24.620Z',
          media_end_timestamp: '2023-07-21T08:36:24.620Z',
          is_available: false,
        },
      ];
      res.send(body3);
      break;
    case '5':
      const body5 = [
        {
          id: 1,
          media_start_timestamp: '2023-07-21T08:32:24.620Z',
          media_end_timestamp: '2023-07-21T08:36:24.620Z',
          is_available: true,
        },
        {
          id: 7,
          media_start_timestamp: '2023-07-21T09:32:24.620Z',
          media_end_timestamp: '2023-07-21T09:36:24.620Z',
          is_available: true,
        },
      ];
      res.send(body5);
      break;
    case '6':
      const body6 = [
        {
          id: 1,
          media_start_timestamp: '2023-07-21T08:32:24.620Z',
          media_end_timestamp: '2023-07-21T08:36:24.620Z',
          is_available: true,
        },
        {
          id: 7,
          media_start_timestamp: '2023-07-21T09:32:24.620Z',
          media_end_timestamp: '2023-07-21T09:36:24.620Z',
          is_available: true,
        },
        {
          id: 8,
          media_start_timestamp: '2023-07-21T09:37:24.620Z',
          media_end_timestamp: '2023-07-21T09:39:24.620Z',
          is_available: true,
        },
      ];
      res.send(body6);
      break;
    default:
      res.send([]);
      break;
  }
});

let requestCounts = {};
router.get('/preview/reset', (req, res) => {
  requestCounts = {};
  res.sendStatus(202);
});

router.get('/preview/:mediaId', async (req, res) => {
  const largeRequestCount = 6; // Assuming 5 seconds per request
  const smallRequestCount = 2;
  const { mediaId } = req.params;

  // Initialize or increment the request count for the given mediaId
  requestCounts[mediaId] = (requestCounts[mediaId] || 0) + 1;

  if (mediaId === '4') {
    return res.status(403).end();
  }
  if (mediaId === '5') {
    return res.status(404).end();
  }
  if (mediaId === '6') {
    return res.status(500).end();
  }

  if (mediaId === '7') {
    if (requestCounts[mediaId] < largeRequestCount) {
      // Simulate a large file request without resetting the count
      return res.status(202).end();
    }
  }

  if (mediaId === '8') {
    if (requestCounts[mediaId] < smallRequestCount) {
      //Simulate medium file request
      return res.status(202).end();
    }
  }

  // Handle the default case with cached response
  serveAudioFile(res, req.headers.range, __dirname + '/preview/preview.mp3');
});

function serveAudioFile(res, range, filePath) {
  var stat = fs.statSync(filePath);
  var total = stat.size;
  if (range) {
    var parts = range.replace(/bytes=/, '').split('-');
    var start = parseInt(parts[0], 10);
    var end = parts[1] ? parseInt(parts[1], 10) : total - 1;
    var chunksize = end - start + 1;
    res.writeHead(206, {
      'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'audio/mpeg',
    });
    fs.createReadStream(filePath, { start: start, end: end }).pipe(res);
  } else {
    res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'audio/mpeg' });
    fs.createReadStream(filePath).pipe(res);
  }
}

module.exports = router;
