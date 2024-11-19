import { Injectable, signal } from '@angular/core';
/**
 * Service to manage the state of forms within the application.
 *
 * @remarks
 * This service provides methods to get, set, and clear form values
 * for different screens identified by a screen ID.
 *
 * @example
 * ```typescript
 * formStateService = inject(FormStateService);
 * formStateService.setFormValues('screen1', { name: 'John Doe' });
 * const values = formStateService.getFormValues<{ name: string }>('screen1');
 * console.log(values); // Output: { name: 'John Doe' }
 * formStateService.clearFormValues('screen1');
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class FormStateService {
  private readonly state = signal<Record<string, unknown>>({});

  getFormValues<T>(screenId: string): T | null {
    return (this.state()[screenId] as T) ?? null;
  }

  setFormValues(screenId: string, formValues: unknown) {
    this.state.update((forms) => ({
      ...forms,
      [screenId]: formValues,
    }));
  }

  clearFormValues(screenId: string) {
    this.state.update((forms) => {
      const { [screenId]: _, ...rest } = forms;
      return rest;
    });
  }
}
