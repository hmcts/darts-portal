export interface AdminHearingSearchResultData {
  id: number;
  hearing_date: string;
  case: {
    id: number;
    case_number: string;
  };
  courthouse: {
    id: number;
    display_name: string;
  };
  courtroom: {
    id: number;
    name: string;
  };
}
