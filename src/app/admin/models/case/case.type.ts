import { ReportingRestriction } from '@core-types/index';
import { DateTime } from 'luxon';

export type AdminCase = {
  id: number;
  caseNumber: string;
  courthouse: {
    id: number;
    displayName: string;
  };
  defendants?: string[];
  judges?: string[];
  prosecutors?: string[];
  defenders?: string[];
  reportingRestrictions?: ReportingRestriction[];
  retainUntilDateTime?: DateTime;
  caseClosedDateTime?: DateTime;
  retentionDateTimeApplied?: DateTime;
  retentionPolicyApplied?: string;
  caseObjectId: string;
  caseStatus: string;
  createdAt: DateTime;
  createdById: number;
  createdBy?: string;
  lastModifiedAt: DateTime;
  lastModifiedById: number;
  lastModifiedBy?: string;
  isDeleted: boolean;
  caseDeletedAt?: DateTime;
  isDataAnonymised: boolean;
  dataAnonymisedAt?: DateTime;
  isInterpreterUsed: boolean;
};
