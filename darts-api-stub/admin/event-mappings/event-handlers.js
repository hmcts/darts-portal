const express = require('express');
const router = express.Router();

const eventHandlers = ['StandardEventHandler', 'TranscriptionRequestHandler'];

router.get('/', (_, res) => res.send(eventHandlers));

module.exports = router;
