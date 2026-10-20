import { AdminLinkedCase } from '@admin-types/linked-case/linked-case.interface';

export interface AdminCaseSearchResultData {
  id: number;
  case_number: string;
  linked_cases?: AdminLinkedCase[];
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
