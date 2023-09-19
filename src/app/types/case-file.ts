export interface CaseFile {
  case_id: number;
  courthouse?: string;
  case_number: string;
  defendants?: string[];
  judges?: string[];
  prosecutors?: string[];
  defenders?: string[];
  reporting_restriction?: string;
  retain_until?: string;
}
