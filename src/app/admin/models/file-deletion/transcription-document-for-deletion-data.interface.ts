import { AdminActionData } from '@admin-types/transformed-media/admin-action-data.interface';

export interface TranscriptionDocumentForDeletionData {
  transcription_document_id: number;
  transcription: {
    id: number;
  };
  case: {
    id: number;
    case_number: string;
  };
  hearing: {
    id: number;
    hearing_date: string;
  };
  courthouse: {
    id: number;
    display_name: string;
  };
  courtroom: {
    id: number;
    name: string;
  };
  admin_action: AdminActionData;
}
