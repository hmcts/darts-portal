const express = require('express');
const router = express.Router();
const { localArray } = require('../../localArray');

const defaultEventMappings = localArray('eventMappings').value;
let eventMappings = structuredClone(defaultEventMappings);

router.get('/', (_, res) => res.json(eventMappings));

router.get('/reset', (req, res) => {
  eventMappings = structuredClone(defaultEventMappings);
  res.sendStatus(200);
});

router.get('/:event_handler_id', (req, res) => {
  const policy = eventMappings.find((p) => p.id === parseInt(req.params.event_handler_id));
  res.json(policy);
});

router.delete('/:event_handler_id', (req, res) => {
  res.sendStatus(200);
});

router.post('/', (req, res) => {
  const eventMapping = req.body;
  const isRevision = req.query.is_revision === 'true';

  //Type and subtype must be unique when isRevision is false
  if (!isRevision && !isNewTypeSubTypeUnique(eventMapping.type, eventMapping.sub_type)) {
    return res.sendStatus(409);
  }

  if (!isRevision) {
    if (!eventMapping.handler) eventMapping.handler = 'DartsEventNullHandler';
    eventMapping.id = 99;
    eventMapping.created_at = new Date().toISOString();
    eventMapping.is_active = true;
    eventMappings.push(eventMapping);
    res.status(200).send(eventMapping);
  } else {
    const event = eventMappings.find((p) => p.id === eventMapping.id);
    if (event) {
      Object.assign(event, eventMapping);
      res.status(200).send(event);
    } else {
      res.status(404).send({ message: 'Event Mapping not found for update' });
    }
  }
});

function isNewTypeSubTypeUnique(newType, newSubType) {
  const seen = new Set();

  for (const mapping of eventMappings) {
    const combo = `${mapping.type}-${mapping.sub_type}`;
    seen.add(combo);
  }

  const newCombo = `${newType}-${newSubType}`;
  return !seen.has(newCombo);
}

module.exports = router;
