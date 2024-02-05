import { Hearing } from '@portal-types/hearing/hearing.type';
import { ReportingRestriction } from '../../../types/reporting-restriction.interface'; //Update once core is re-structured

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
