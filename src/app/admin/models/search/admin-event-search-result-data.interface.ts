export interface AdminEventSearchResultData {
  id: number;
  created_at: string;
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
}
