const express = require('express');
const router = express.Router();
const { localArray } = require('../../localArray');
const eventMappings = localArray('eventMappings');

router.get('/', (_, res) => res.json(eventMappings.value));

router.post('/', (req, res) => {
  const eventMapping = req.body;
  const isRevision = req.params.is_revision;

  //Type and subtype must be unique when isRevision is false
  if (!isRevision && !isNewTypeSubTypeUnique(eventMapping.type, eventMapping.sub_type)) {
    return res.sendStatus(409);
  }

  if (!eventMapping.handler) eventMapping.handler = 'DartsEventNullHandler';
  eventMapping.id = 1;
  eventMapping.created_at = new Date().toISOString();
  eventMapping.is_active = true;
  eventMappings.value.push(eventMapping);
  res.status(200).send(eventMapping);
});

function isNewTypeSubTypeUnique(newType, newSubType) {
  const seen = new Set();

  for (const mapping of eventMappings.value) {
    const combo = `${mapping.type}-${mapping.sub_type}`;
    seen.add(combo);
  }

  const newCombo = `${newType}-${newSubType}`;
  return !seen.has(newCombo);
}

module.exports = router;
