const express = require('express');

const router = express.Router();

router.get('/:hearingId/events', (req, res) => {
  switch (req.params.hearingId) {
    case '1':
      const body1 = [
        {
          id: 1,
          timestamp: '2023-07-31T01:00:00.620Z',
          name: 'Case called on',
          text: 'Record: New Case',
        },
        {
          id: 2,
          timestamp: '2023-07-31T03:00:00.620Z',
          name: 'Case called on',
          text: 'Record: New Case',
        },
        {
          id: 3,
          timestamp: '2023-07-31T08:00:24.620Z',
          name: 'Case called on',
          text: 'Record: New Case',
        },
      ];
      res.send(body1);
      break;
    case '2':
      const body2 = [
        {
          id: 4,
          timestamp: '2023-07-31T14:32:24.620Z',
          name: 'Case called on',
          text: 'Record:New Case',
        },
      ];
      res.send(body2);
      break;
    default:
      res.send([]);
      break;
  }
});

module.exports = router;
