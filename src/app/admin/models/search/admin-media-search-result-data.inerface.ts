export interface AdminMediaSearchResultData {
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
  is_hidden: boolean;
}
