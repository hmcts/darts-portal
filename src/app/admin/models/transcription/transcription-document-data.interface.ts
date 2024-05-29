export interface TranscriptionDocumentData {
  transcription_document_id: number;
  transcription_id: number;
  case: {
    id: number;
    case_number: string;
  };
  courthouse: {
    id: number;
    display_name: string;
  };
  hearing: {
    id: number;
    hearing_date: string;
  };
  is_manual_transcription: boolean;
  is_hidden: boolean;
}
