import { ReportingRestriction } from '@core-types/reporting-restriction/reporting-restriction.interface';
import { Hearing } from '@portal-types/hearing/hearing.type';
import { DateTime } from 'luxon';

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
