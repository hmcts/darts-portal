export interface CaseSearchRequest {
  case_number: string | null;
  courthouse_ids: number[];
  courtroom: string | null;
  judge_name: string | null;
  defendant_name: string | null;
  date_from: string | null;
  date_to: string | null;
  event_text_contains: string | null;
}
