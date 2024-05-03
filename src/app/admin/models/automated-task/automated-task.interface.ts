export interface AutomatedTaskData {
  id: number;
  name: string;
  description: string;
  cron_expression: string;
  is_active: boolean;
}

export interface AutomatedTaskDetailsData extends AutomatedTaskData {
  is_cron_editable: boolean;
  created_at: string;
  created_by: number;
  last_modified_at: string;
  last_modified_by: number;
}
