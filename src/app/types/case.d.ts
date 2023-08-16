import Hearing from './hearing';

export interface CaseData {
  caseID: number;
  caseNumber: string;
  courthouse: string;
  defendants: string[];
  judges: string[];
  reportingRestriction?: string;
  hearings?: Hearing[];
}
