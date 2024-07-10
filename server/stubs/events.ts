import { StubResponse } from '.';

const events = [
  {
    id: 1,
    hearing_id: 1,
    hearing_date: '2024-04-24',
    timestamp: '2024-04-24T14:30:00Z',
    name: 'Event one name',
    text: 'Event one text',
  },
  {
    id: 2,
    hearing_id: 1,
    hearing_date: '2024-04-24',
    timestamp: '2024-04-24T14:31:00Z',
    name: 'Event two name',
    text: 'Event two text',
  },
  {
    id: 3,
    hearing_id: 1,
    hearing_date: '2024-04-24',
    timestamp: '2024-04-24T14:32:00Z',
    name: 'Event three name',
    text: 'Event three text',
  },
];

export const eventsStubResponses: StubResponse[] = [
  {
    method: 'post',
    path: '/admin/events/search',
    response: [
      {
        id: 111,
        created_at: '2024-01-01T00:00:00Z',
        name: 'Event 1',
        text: 'This is an event',
        chronicle_id: '123',
        antecedent_id: '456',
        courthouse: {
          id: 1,
          display_name: 'Cardiff',
        },
        courtroom: {
          id: 1,
          name: 'Room 1',
        },
      },
      {
        id: 222,
        created_at: '2024-01-02T00:00:00Z',
        name: 'Event 2',
        text: 'This is another event',
        chronicle_id: '789',
        antecedent_id: '012',
        courthouse: {
          id: 2,
          display_name: 'Swansea',
        },
        courtroom: {
          id: 2,
          name: 'Room 2',
        },
      },
      {
        id: 333,
        created_at: '2024-01-03T00:00:00Z',
        name: 'Event 3',
        text: 'This is yet another event',
        chronicle_id: '345',
        antecedent_id: '678',
        courthouse: {
          id: 3,
          display_name: 'Newport',
        },
        courtroom: {
          id: 3,
          name: 'Room 3',
        },
      },
    ],
    status: 200,
  },
];
