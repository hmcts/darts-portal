export interface CaseRow {
  id: number;
  caseNumber: string;
  courthouse?: string;
  courtroom: string;
  judges: string;
  defendants: string;
  reporting_restriction?: string;
}
