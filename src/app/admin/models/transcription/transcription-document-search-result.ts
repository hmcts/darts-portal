import { DateTime } from 'luxon';

export type TranscriptionDocumentSearchResult = {
  transcriptionDocumentId: number;
  transcriptionId: number;
  case: {
    id: number;
    caseNumber: string;
  };
  courthouse: {
    id: number;
    displayName: string;
  };
  hearing: {
    id: number;
    hearingDate: DateTime;
  };
  isManualTranscription: boolean;
  isHidden: boolean;
};
