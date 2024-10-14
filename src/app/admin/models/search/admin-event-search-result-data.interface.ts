export interface AdminEventSearchResultData {
  id: number;
  event_ts: string;
  name: string;
  text: string;
  chronicle_id: string;
  antecedent_id: string;
  courthouse: {
    id: number;
    display_name: string;
  };
  courtroom: {
    id: number;
    name: string;
  };
  is_event_anonymised?: boolean;
  is_case_expired?: boolean;
}
