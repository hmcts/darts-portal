import { DateTime } from 'luxon';

export type CaseRetentionHistory = {
  retentionLastChangedDate: DateTime;
  retentionDate: DateTime;
  amendedBy: string;
  retentionPolicyApplied: string;
  comments: string;
  status: string;
};
