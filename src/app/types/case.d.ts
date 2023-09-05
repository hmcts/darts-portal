import Hearing from './hearing';

export interface CaseData {
  case_id: number;
  case_number: string;
  courthouse?: string;
  defendants?: string[] = [];
  judges?: string[] = [];
  reporting_restriction?: string;
  hearings?: Hearing[];
}
