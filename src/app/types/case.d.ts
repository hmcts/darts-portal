import Hearing from './hearing';

export interface CaseData {
  case_id: number;
  caseNumber: string;
  courthouse: string;
  [defendants: string]: string[];
  [judges: string]: string[];
  reportingRestriction?: string;
  hearings?: Hearing[];
}
