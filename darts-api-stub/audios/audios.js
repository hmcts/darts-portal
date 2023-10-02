const express = require('express');

const router = express.Router();

const audioRequestOne = {
  request_id: 1234,
  case_id: 'T4565443',
  courthouse_name: 'Swansea',
  defendants: ['Derek Defender'],
  hearing_date: '2023-09-20',
  start_time: '2023-09-20T09:00:00Z',
  end_time: '2023-09-20T10:00:00Z',
};

router.post('', (req, res) => {
  res.send(audioRequestOne);
});
module.exports = router;
