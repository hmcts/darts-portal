const express = require('express');
const router = express.Router();
const { localArray } = require('../../localArray');
const eventMapping = localArray('eventMappings');

router.get('/', (_, res) => res.json(eventMapping.value));

module.exports = router;
