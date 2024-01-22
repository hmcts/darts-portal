export interface Filter {
  display_name: string;
  name: string;
  values: string[];
  multiselect?: boolean;
  search?: boolean;
}
