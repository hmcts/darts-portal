const router = require('express').Router();
const { DateTime } = require('luxon');

const courthouseNames = ['Basildon', 'Cardiff', 'Swansea', 'Newport'];
const nodeRegistrations = [
  {
    id: 1,
    courthouse: {
      id: 1,
      display_name: 'Basildon',
    },
    courtroom: {
      id: '2',
      name: '1',
    },
    ip_address: '192.168.0.1',
    hostname: 'node1.example.com',
    mac_address: '00-12-34-F2-C1-D2',
    node_type: 'DAR',
    created_at: '2024-01-01T00:00:00Z',
    created_by: 1,
  },
  {
    id: 2,
    courthouse: {
      id: 2,
      display_name: 'Basildon',
    },
    courtroom: {
      id: '3',
      name: '2',
    },
    ip_address: '182.168.0.2',
    hostname: 'node2.example.com',
    mac_address: '00-12-34-F2-C1-D3',
    node_type: 'DAR',
    created_at: '2024-01-02T00:00:00Z',
    created_by: 2,
  },
];

function generateMoreNodeRegistrations(existing, count) {
  const baseId = Math.max(...existing.map((n) => n.id));
  const results = [...existing];
  const startDate = DateTime.fromISO('2024-01-03T00:00:00Z');

  for (let i = 0; i < count; i++) {
    const id = baseId + i + 1;
    const courthouseIndex = i % courthouseNames.length;
    const createdBy = (i % 4) + 1;
    const createdAt = startDate.plus({ days: i }).toISO();
    const ip = `192.168.0.${i + 3}`;
    const mac = `00-12-34-F2-C1-${(0xd4 + i).toString(16).padStart(2, '0').toUpperCase()}`;
    const courtroomNumber = (i + 3).toString();

    results.push({
      id,
      courthouse: {
        id: courthouseIndex + 1,
        display_name: courthouseNames[courthouseIndex],
      },
      courtroom: {
        id: courtroomNumber,
        name: courtroomNumber,
      },
      ip_address: ip,
      hostname: `node${id}.example.com`,
      mac_address: mac,
      node_type: 'DAR',
      created_at: createdAt,
      created_by: createdBy,
    });
  }

  return results;
}

router.get('/', (req, res) => {
  const allNodeRegistrations = generateMoreNodeRegistrations(nodeRegistrations, 500);
  res.send(allNodeRegistrations);
});

module.exports = router;
