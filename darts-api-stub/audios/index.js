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
  const mp3 = __dirname + '/preview/preview.mp3';
  const filestream = fs.createReadStream(mp3);
  const range = req.headers.range.replace('bytes=', '').split('-');

  filestream.on('open', function () {
    const stats = fs.statSync(mp3);
    const fileSizeInBytes = stats['size'];

    // If the start or end of the range is empty, replace with 0 or filesize respectively
    const bytes_start = range[0] ? parseInt(range[0], 10) : 0;
    const bytes_end = range[1] ? parseInt(range[1], 10) : fileSizeInBytes;

    const chunk_size = bytes_end - bytes_start;

    if (chunk_size == fileSizeInBytes) {
      // Serve the whole file as before
      res.writeHead(200, {
        'Accept-Ranges': 'bytes',
        'Content-Type': 'audio/mpeg',
        'Content-Length': fileSizeInBytes,
      });
      filestream.pipe(res);
    } else {
      // HTTP/1.1 206 is the partial content response code
      res.writeHead(206, {
        'Content-Range': 'bytes ' + bytes_start + '-' + bytes_end + '/' + fileSizeInBytes,
        'Accept-Ranges': 'bytes',
        'Content-Type': 'audio/mpeg',
        'Content-Length': fileSizeInBytes,
      });
      filestream.pipe(response.slice(bytes_start, bytes_end));
    }
  });
});

module.exports = router;
