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
        },
        {
          id: 2,
          media_start_timestamp: '2023-07-31T04:30:24.620Z',
          media_end_timestamp: '2023-07-31T14:32:24.620Z',
        },
        {
          id: 3,
          media_start_timestamp: '2023-07-31T05:32:24.620Z',
          media_end_timestamp: '2023-07-31T14:32:24.620Z',
        },
        {
          id: 4,
          media_start_timestamp: '2023-07-31T18:00:00.620Z',
          media_end_timestamp: '2023-07-31T18:01:00.620Z',
        },
        {
          id: 5,
          media_start_timestamp: '2023-07-31T19:00:00.620Z',
          media_end_timestamp: '2023-07-31T19:01:00.620Z',
        },
        {
          id: 6,
          media_start_timestamp: '2023-07-31T20:00:00.620Z',
          media_end_timestamp: '2023-07-31T20:01:00.620Z',
        },
      ];
      res.send(body1);
      break;
    case '2':
      const body2 = [
        {
          id: 4,
          media_start_timestamp: '2023-07-31T14:32:24.620Z',
          media_end_timestamp: '2023-07-31T14:32:24.620Z',
        },
      ];
      res.send(body2);
      break;
    default:
      res.send([]);
      break;
  }
});

router.get('/preview/:mediaId', (req, res) => {
  if (req.params.mediaId === '4') res.sendStatus(403);
  if (req.params.mediaId === '5') res.sendStatus(404);
  if (req.params.mediaId === '6') res.sendStatus(500);

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
});

module.exports = router;
