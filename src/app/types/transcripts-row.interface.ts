export interface TranscriptsRow {
  tra_id: number;
  hearingDate: string;
  type: string;
  requestedOn: string;
  requestedBy: string;
  status: TranscriptStatus;
}

export type TranscriptStatus =
  | 'Requested'
  | 'Awaiting Authorisation'
  | 'Approved'
  | 'Rejected'
  | 'With Transcriber'
  | 'Complete'
  | 'Closed';
