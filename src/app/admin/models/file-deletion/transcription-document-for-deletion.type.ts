import { DateTime } from 'luxon';

export type TranscriptionDocumentForDeletion = {
  transcriptionDocumentId: number;
  transcriptionId: number;
  caseNumber: string;
  hearingDate: DateTime;
  courthouse: string;
  courtroom: string;
  hiddenById: number;
  markedById?: number;
  markedHiddenBy?: string;
  comments: string;
  ticketReference: string;
  reasonId: number;
  reasonName?: string;
};
