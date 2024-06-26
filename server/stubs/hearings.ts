import { StubResponse } from '.';

export const hearingsStubResponses: StubResponse[] = [
  {
    method: 'post',
    path: '/admin/hearings/search',
    response: [
      {
        id: 1,
        hearing_date: '2024-01-01',
        case: {
          id: 1,
          case_number: '123',
        },
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
        id: 2,
        hearing_date: '2024-01-02',
        case: {
          id: 2,
          case_number: '456',
        },
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
        id: 3,
        hearing_date: '2024-01-03',
        case: {
          id: 3,
          case_number: '789',
        },
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
