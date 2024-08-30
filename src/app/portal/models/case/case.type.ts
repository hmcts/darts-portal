import { ReportingRestriction } from '@core-types/reporting-restriction/reporting-restriction.interface';
import { Hearing } from '@portal-types/hearing/hearing.type';
import { DateTime } from 'luxon';

export type CaseSearchResult = {
  id: number;
  number: string;
  courthouse?: string;
  defendants?: string[];
  judges?: string[];
  reportingRestriction?: string;
  hearings?: Hearing[];
  courtrooms?: string[];
  isDataAnonymised?: boolean;
  dataAnonymisedAt?: DateTime;
};

export type Case = {
  id: number;
  number: string;
  courthouse?: string;
  courthouseId?: number;
  defendants?: string[];
  defenders?: string[];
  judges?: string[];
  reportingRestrictions?: ReportingRestriction[];
  retainUntil?: string;
  prosecutors?: string[];
  retainUntilDateTime?: DateTime;
  closedDateTime?: DateTime;
  retentionDateTimeApplied?: DateTime;
  retentionPolicyApplied?: string;
  isDataAnonymised?: boolean;
  dataAnonymisedAt?: DateTime;
};
