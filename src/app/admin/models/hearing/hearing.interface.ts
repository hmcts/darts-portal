import { AdminCaseData } from '@admin-types/case/case.interface';

export interface AdminHearingData {
  id: number;
  hearing_date: string;
  scheduled_start_time: string;
  hearing_is_actual: boolean;
  case: Partial<AdminCaseData> & Required<Pick<AdminCaseData, 'id' | 'case_number' | 'courthouse'>>;
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
