import { StubResponse } from '.';

export const mediasStubResponses: StubResponse[] = [
  {
    method: 'post',
    path: '/admin/medias/:id/approve-deletion',
    response: {
      is_hidden: true,
      is_deleted: false,
      media_id: 0,
      channel: 5,
      start_at: '2024-01-01T10:00:00Z',
      end_at: '2024-01-01T11:30:00Z',
      courthouse: { id: 0, display_name: 'Cardiff' },
      courtroom: { id: 0, name: '9' },
      admin_action: {
        id: 0,
        reason_id: 3,
        hidden_by_id: 1,
        hidden_at: '2024-05-01T00:00:00Z',
        is_marked_for_manual_deletion: true,
        marked_for_manual_deletion_by_id: 1,
        marked_for_manual_deletion_at: '2024-08-12T09:43:12.199Z',
        ticket_reference: '1234REF1',
        comments: 'This is an example comment',
      },
    },
    status: 200,
  },
];
