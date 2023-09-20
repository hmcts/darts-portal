import { HearingData } from './hearing';

export interface CaseData {
  case_id: number;
  case_number: string;
  courthouse?: string;
  defendants?: string[];
  defenders?: string[];
  judges?: string[];
  reporting_restriction?: string;
  hearings?: HearingData[];
  retain_until?: string;
  prosecutors?: string[];
}
