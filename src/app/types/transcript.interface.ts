import { DateTime } from 'luxon/src/datetime';

// 'Data' postfixed to the end of the interface name is the data returned from the API
export interface TranscriptData {
  transcription_id: number;
  hearing_id: number;
  hearing_date: string;
  type: string;
  requested_on: string;
  requested_by_name: string;
  status: TranscriptStatus;
}

// Interface is mapped to type in the service
// JS/TS properties should be camelCased
// Date/Time properties are converted to DateTime objects
export type Transcript = {
  id: number;
  hearingId: number;
  hearingDate: DateTime;
  type: string;
  requestedOn: DateTime;
  requestedByName: string;
  status: TranscriptStatus;
};

export type TranscriptStatus =
  | 'Requested'
  | 'Awaiting Authorisation'
  | 'Approved'
  | 'Rejected'
  | 'With Transcriber'
  | 'Complete'
  | 'Closed';
