import Hearing from './hearing';
declare module 'case' {
  interface CaseData {
    case_id: number;
    case_number: string;
    defendants: string[];
    judges: string[];
    prosecutors: string[];
    defenders: string[];
    retain_until: string;
    reportingRestriction?: string;
    hearings?: Hearing[];
  }
}

export {};
