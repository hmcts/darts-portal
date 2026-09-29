export interface AutomatedTaskData {
  id: number;
  name: string;
  description: string;
  cron_expression: string;
  is_active: boolean;
}

export interface AutomatedTaskDetailsData extends AutomatedTaskData {
  is_cron_editable: boolean;
  batch_size: number;
  created_at: string;
  created_by: number;
  last_modified_at: string;
  last_modified_by: number;
  rpo_csv_start_hour?: number;
  rpo_csv_end_hour?: number;
  arm_replay_start_ts?: string;
  arm_replay_end_ts?: string;
  arm_attribute_type?: 'RPO' | 'REPLAY';
}
