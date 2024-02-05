export interface CaseRetentionChange {
  case_id: number;
  retention_date: string | undefined;
  is_permanent_retention: boolean | undefined;
  comments: string;
}
