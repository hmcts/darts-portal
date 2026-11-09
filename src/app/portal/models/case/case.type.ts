import { ReportingRestriction } from '@core-types/reporting-restriction/reporting-restriction.interface';
import { LinkedCase } from '@core-types/linked-case/linked-case.interface';
import { Hearing } from '@portal-types/hearing/hearing.type';
import { DateTime } from 'luxon';

export type CaseSearchResult = {
  id: number;
  number: string;
  courthouse?: string;
  defendants?: string[];
  judges?: string[];
  reportingRestriction?: string;
  linkedCases?: LinkedCase[];
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
  linkedCases?: LinkedCase[];
  retainUntil?: string;
  prosecutors?: string[];
  retainUntilDateTime?: DateTime;
  closedDateTime?: DateTime;
  retentionDateTimeApplied?: DateTime;
  retentionPolicyApplied?: string;
  isDataAnonymised?: boolean;
  dataAnonymisedAt?: DateTime;
};
