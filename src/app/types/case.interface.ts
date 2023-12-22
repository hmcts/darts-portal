import { Hearing } from './hearing.interface';
import { ReportingRestriction } from './reporting-restriction.interface';

export interface Case {
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
}
