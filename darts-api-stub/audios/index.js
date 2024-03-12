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
    default:
      res.send([]);
      break;
  }
});

// SSE Preview Audio Stub
router.get('/preview/:mediaId', (req, res) => {
  if (req.params.mediaId === '4') {
    res.status(403).end();
    return;
  }
  if (req.params.mediaId === '5') {
    res.status(404).end();
    return;
  }
  if (req.params.mediaId === '6') {
    res.status(500).end();
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  var filePath = __dirname + '/preview/preview.mp3';

  let counter = 0;
  const intervalId = setInterval(() => {
    if (counter >= 3) {
      clearInterval(intervalId);
      fs.readFile(filePath, (err, data) => {
        if (err) {
          console.error(err);
          res.status(500).end();
          return;
        }
        const base64String = data.toString('base64');
        const x = { body: base64String };
        res.write(`event: audio response\ndata: ${JSON.stringify(x)}\n\n`);
        res.end();
      });
    } else {
      res.write(`event: emptyResponse\ndata: \n\n`);
      counter++;
    }
  }, 100);
});

module.exports = router;
