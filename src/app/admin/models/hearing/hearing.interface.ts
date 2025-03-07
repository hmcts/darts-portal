import { AdminCaseData } from '@admin-types/case/case.interface';

export interface AdminHearingData {
  id: number;
  hearing_date: string;
  scheduled_start_time: string;
  hearing_is_actual: boolean;
  case: AdminCaseData;
  courtroom: {
    id: number;
    name: string;
  };
  judges: string[];
  created_at: string;
  created_by: number;
  last_modified_at: string;
  last_modified_by: number;
}
