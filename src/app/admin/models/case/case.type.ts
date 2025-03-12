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
  isRetentionUpdated?: boolean;
  retentionRetries?: number;
  retentionDateTimeApplied?: DateTime;
  retentionPolicyApplied?: string;
  retConfScore?: number;
  retConfReason?: string;
  retConfUpdatedTs?: DateTime;
  caseObjectId: string;
  caseObjectName?: string;
  caseType?: string;
  uploadPriority?: number;
  caseStatus: string;
  createdAt: DateTime;
  createdById: number;
  createdBy?: string;
  lastModifiedAt?: DateTime;
  lastModifiedById: number;
  lastModifiedBy?: string;
  isDeleted?: boolean;
  caseDeletedAt?: DateTime;
  caseDeletedById: number;
  caseDeletedBy?: string;
  isDataAnonymised: boolean;
  dataAnonymisedAt?: DateTime;
  dataAnonymisedById: number;
  dataAnonymisedBy?: string;
  isInterpreterUsed: boolean;
};
