import { FormControl, FormGroup } from '@angular/forms';

// Utility type to unwrap FormControl and recursively unwrap FormGroup
export type UnwrapFormValues<T> =
  T extends FormControl<infer U>
    ? U
    : T extends FormGroup<infer U>
      ? { [K in keyof U]: UnwrapFormValues<U[K]> }
      : never;
