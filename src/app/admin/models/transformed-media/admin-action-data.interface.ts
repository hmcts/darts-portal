export interface AdminActionData {
  id: number;
  reason_id: number;
  hidden_by_id: number;
  hidden_at: string;
  is_marked_for_manual_deletion: boolean;
  marked_for_manual_deletion_by_id: number;
  marked_for_manual_deletion_at: string;
  ticket_reference: string;
  comments: string;
}
