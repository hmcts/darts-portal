import { DateTime } from 'luxon';
import { Hearing } from './hearing.interface';
import { ReportingRestriction } from './reporting-restriction.interface';

export interface CaseData {
  case_id: number;
  case_number: string;
  courthouse?: string;
  defendants?: string[];
  defenders?: string[];
  judges?: string[];
  reporting_restriction?: string;
  reporting_restrictions?: ReportingRestriction[];
  hearings?: Hearing[];
  retain_until?: string;
  prosecutors?: string[];
  retain_until_date_time?: string;
  case_closed_date_time?: string;
  retention_date_time_applied?: string;
  retention_policy_applied?: string;
}

export type Case = {
  id: number;
  number: string;
  courthouse?: string;
  defendants?: string[];
  defenders?: string[];
  judges?: string[];
  reportingRestriction?: string;
  reportingRestrictions?: ReportingRestriction[];
  hearings?: Hearing[];
  retainUntil?: string;
  prosecutors?: string[];
  retainUntilDateTime?: DateTime;
  closedDateTime?: DateTime;
  retentionDateTimeApplied?: DateTime;
  retentionPolicyApplied?: string;
};
