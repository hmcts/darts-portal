import { LinkedCase } from '@core-types/linked-case/linked-case.interface';

export interface AdminCaseSearchResultData {
  id: number;
  case_number: string;
  linked_cases?: LinkedCase[];
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
  is_data_anonymised?: boolean;
  data_anonymised_at?: string;
}
