export interface CaseEventData {
  id: number;
  hearing_id: number;
  hearing_date: string;
  timestamp: string;
  name: string;
  text: string;
  is_data_anonymised?: boolean;
  courtroom?: string;
}
