declare module 'govuk-frontend' {
  export function initAll(): void;
}

declare module '@ministryofjustice/frontend' {
  export interface SortableTableConfig {
    statusMessage?: string;
    ascendingText?: string;
    descendingText?: string;
  }

  export class SortableTable {
    constructor(root: HTMLElement, config?: SortableTableConfig);

    sort(rows: HTMLTableRowElement[], columnNumber: number, sortDirection: string): HTMLTableRowElement[];

    getTableRowsArray(): HTMLTableRowElement[];

    updateDirectionIndicators(): void;
    updateButtonState(button: HTMLButtonElement, direction: string): void;
  }

  export class DatePicker {
    constructor(element: HTMLElement, config?: Record<string, unknown>);
  }

  export function initAll(options?: { scope?: HTMLElement }): void;
}
