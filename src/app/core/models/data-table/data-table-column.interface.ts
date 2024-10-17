export interface DatatableColumn {
  prop: string;
  name: string;
  sortable?: boolean;
  customSortFn?: CustomSort<unknown>;
  width?: string;
  hidden?: boolean;
  sortOnLoad?: 'asc' | 'desc';
}

export type CustomSort<T> = (a: T, b: T, order: Order) => number;

export type Order = 'asc' | 'desc';
