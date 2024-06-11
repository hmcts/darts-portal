const express = require('express');
const router = express.Router();

const DATA = [
  {
    id: 3,
    reason: 'OTHER_REASON_TO_DELETE',
    display_name: 'Other reason to delete',
    display_state: true,
    display_order: 2,
    marked_for_deletion: true,
  },
  {
    id: 4,
    reason: 'FAKE_REASON_DO_NOT_DISPLAY',
    display_name: 'Do not display',
    display_state: false,
    display_order: 4,
    marked_for_deletion: false,
  },
  {
    id: 5,
    reason: 'OTHER_REASON_TO_HIDE',
    display_name: 'Other reason to hide only',
    display_state: true,
    display_order: 3,
    marked_for_deletion: false,
  },
  {
    id: 1,
    reason: 'PUBLIC_INTEREST_IMMUNITY',
    display_name: 'Public interest immunity',
    display_state: true,
    display_order: 0,
    marked_for_deletion: true,
  },
  {
    id: 2,
    reason: 'CLASSIFIED_ABOVE_OFFICIAL',
    display_name: 'Classified above official',
    display_state: true,
    display_order: 1,
    marked_for_deletion: true,
  },
];

router.get('/', (req, res) => {
  res.send(DATA);
});

module.exports = router;
