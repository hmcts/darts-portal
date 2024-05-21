import { StubResponse } from '.';

const stubData = [
  {
    id: 1,
    file_name: 'filename.mp3',
    file_format: 'MP3',
    file_size_bytes: 2097152,
    media_request: {
      id: 1,
      requested_at: '2024-01-01T00:00:00Z',
      owner_user_id: -19,
      requested_by_user_id: -18,
    },
    case: {
      id: 1,
      case_number: 'CASE123',
    },
    courthouse: {
      id: 1,
      display_name: 'Swansea',
    },
    hearing: {
      id: 1,
      hearing_date: '2024-01-01',
    },
    last_accessed_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    file_name: 'filename2.mp3',
    file_format: 'MP3',
    file_size_bytes: 1048576,
    media_request: {
      id: 2,
      requested_at: '2022-01-01T00:00:00Z',
      owner_user_id: -16,
      requested_by_user_id: -17,
    },
    case: {
      id: 2,
      case_number: 'CASE456',
    },
    courthouse: {
      id: 2,
      display_name: 'Newport',
    },
    hearing: {
      id: 2,
      hearing_date: '2022-01-01',
    },
    last_accessed_at: '2022-01-01T00:00:00Z',
  },
  {
    id: 3,
    file_name: 'filename3.mp3',
    file_format: 'MP3',
    file_size_bytes: 3145728,
    media_request: {
      id: 3,
      requested_at: '2023-01-01T00:00:00Z',
      owner_user_id: -14,
      requested_by_user_id: -13,
    },
    case: {
      id: 3,
      case_number: 'CASE789',
    },
    courthouse: {
      id: 3,
      display_name: 'Cardiff',
    },
    hearing: {
      id: 3,
      hearing_date: '2023-01-01',
    },
    last_accessed_at: '2023-01-01T00:00:00Z',
  },
];

export const transformedMedia: StubResponse[] = [
  {
    path: '/admin/transformed-medias/search',
    method: 'post',
    response: stubData,
    status: 200,
  },
];
