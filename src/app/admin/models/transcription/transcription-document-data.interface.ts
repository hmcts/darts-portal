import { AdminActionData } from '@admin-types/transformed-media/admin-action-data.interface';

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
  admin_action?: AdminActionData;
}
