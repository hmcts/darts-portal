import { DateTime } from 'luxon';

export type TransformedMediaAdmin = {
  id: number;
  fileName: string;
  fileFormat: string;
  fileSizeBytes: number;
  mediaRequest: {
    id: number;
    requestedAt: DateTime;
    ownerUserId: number;
    ownerUserName?: string;
    requestedByUserId: number;
    requestedByName?: string;
  };
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
  lastAccessedAt: DateTime;
};
