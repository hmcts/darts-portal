import { AudioRequestStatus } from '@portal-types/hearing/audio-request-status.type';
import { AudioRequestType } from '@portal-types/hearing/audio-request-type.type';
import { DateTime } from 'luxon';

export type MediaRequest = {
  caseId: number;
  mediaRequestId: number;
  caseNumber: string;
  courthouseName: string;
  hearingId: number;
  hearingDate: DateTime;
  startTime: DateTime;
  endTime: DateTime;
  status: AudioRequestStatus;
  requestType: AudioRequestType;
};
