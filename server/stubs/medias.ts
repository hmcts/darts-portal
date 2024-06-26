import { StubResponse } from '.';

export const mediasStubResponses: StubResponse[] = [
  {
    method: 'post',
    path: '/admin/medias/search',
    response: [
      {
        id: 101,
        courthouse: {
          id: 1,
          display_name: 'Birmingham',
        },
        courtroom: {
          id: 1,
          name: 'Room A',
        },
        start_at: '2024-01-01T11:00:00Z',
        end_at: '2024-01-01T12:00:00Z',
        channel: 4,
        is_hidden: false,
      },

      {
        id: 102,
        courthouse: {
          id: 2,
          display_name: 'Cardiff',
        },
        courtroom: {
          id: 2,
          name: 'Room B',
        },
        start_at: '2023-01-08T15:30:00Z',
        end_at: '2023-01-08T16:15:00Z',
        channel: 5,
        is_hidden: true,
      },
      {
        id: 103,
        courthouse: {
          id: 3,
          display_name: 'Edinburgh',
        },
        courtroom: {
          id: 3,
          name: 'Room C',
        },
        start_at: '2022-09-01T13:15:00Z',
        end_at: '2022-09-01T14:00:00Z',
        channel: 6,
        is_hidden: false,
      },
    ],
    status: 200,
  },
];
