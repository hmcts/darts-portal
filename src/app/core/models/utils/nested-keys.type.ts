// Utility type to get nested keys
export type NestedKeys<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T & (string | number)]: T[K] extends object
        ? `${Prefix}${K}` | NestedKeys<T[K], `${Prefix}${K}.`>
        : `${Prefix}${K}`;
    }[keyof T & (string | number)]
  : never;
