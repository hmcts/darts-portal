export interface Filter {
  displayName: string;
  name: string;
  values: string[];
  multiselect?: boolean;
  search?: boolean;
  isCollapsed?: boolean;
}
