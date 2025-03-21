export interface AudioVersionData {
  id: number;
  courthouse: {
    id: number;
    display_name: string;
  };
  courtroom: {
    id: number;
    name: string;
  };
  start_at: string;
  end_at: string;
  channel: number;
  chronicle_id: string;
  antecedent_id: string;
  is_current: boolean;
  created_at: string;
}
