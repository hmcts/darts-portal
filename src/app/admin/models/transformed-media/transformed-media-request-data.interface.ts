export interface TransformedMediaRequestData {
  id: number;
  start_at: string;
  end_at: string;
  requested_at: string;
  hearing: {
    id: number;
    hearing_date: string;
  };
  courtroom: {
    id: number;
    name: string;
  };
  requested_by_id: number;
  owner_id: number;
}
