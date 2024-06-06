export interface AssociatedMediaData {
  id: number;
  channel: number;
  start_at: string;
  end_at: string;
  case: {
    id: number;
    case_number: string;
  };
  hearing: {
    id: number;
    hearing_date: string;
  };
  courthouse: {
    id: number;
    display_name: string;
  };
  courtroom: {
    id: number;
    display_name: string;
  };
}
