const express = require('express');
const { localArray } = require('../localArray');

const router = express.Router();

router.get('', (_, res) => {
  const courthouses = localArray('courthouses');
  const cleanedCourthouses = courthouses.value.map((courthouse) => {
    // Remove security_group_ids key
    const { security_group_ids, ...rest } = courthouse;
    return rest;
  });

  res.send(cleanedCourthouses);
});

module.exports = router;
