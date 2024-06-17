export interface TranscriptionDocumentData {
  transcription_document_id: number;
  transcription_id: number;
  file_type: string;
  file_name: string;
  file_size_bytes: number;
  uploaded_at: string;
  uploaded_by: number;
  is_hidden: boolean;
  retain_until: string;
  content_object_id: string;
  checksum: string;
  clip_id: string;
  last_modified_at: string;
  last_modified_by: number;
  admin_action?: {
    id: number;
    reason_id: number;
    hidden_by_id: number;
    hidden_at: string;
    is_marked_for_manual_deletion: boolean;
    marked_for_manual_deletion_by_id: number;
    marked_for_manual_deletion_at: string;
    ticket_reference: string;
    comments: string;
  };
}
