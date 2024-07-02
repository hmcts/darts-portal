export interface AdminCaseSearchResultData {
  id: number;
  case_number: string;
  courthouse: {
    id: number;
    display_name: string;
  };
  courtrooms: {
    id: number;
    name: string;
  }[];
  judges: string[];
  defendants: string[];
}
