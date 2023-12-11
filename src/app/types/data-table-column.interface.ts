export interface DatatableColumn {
  prop: string;
  name: string;
  sortable?: boolean;
  sortFn?: CustomSort<unknown>;
}

export type CustomSort<T> = (a: T, b: T, order: 'asc' | 'desc') => number;
