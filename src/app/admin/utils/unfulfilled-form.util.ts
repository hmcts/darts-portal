import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';

export type Outcome = 'complete' | 'unfulfilled';
export type ErrorField = 'file' | 'reason' | 'details';
export type ErrorMessages = Record<ErrorField, Record<string, string>>;

/** Reason required when unfulfilled; details required iff reason === 'other'. */
export function applyUnfulfilledValidators(
  isUnfulfilled: boolean,
  reason: AbstractControl,
  details: AbstractControl,
  maxLen = 200
): void {
  if (isUnfulfilled) {
    reason.setValidators([Validators.required]);
  } else {
    reason.clearValidators();
    reason.setValue('', { emitEvent: false });
  }
  reason.updateValueAndValidity({ emitEvent: false });

  const base = [Validators.maxLength(maxLen)];
  const needDetails = isUnfulfilled && reason.value === 'other';
  details.setValidators(needDetails ? [Validators.required, ...base] : base);
  details.updateValueAndValidity({ emitEvent: false });
}

/** First matching error message */
export function firstError(
  messages: ErrorMessages,
  field: ErrorField,
  errors: ValidationErrors | null | undefined
): string | null {
  if (!errors) return null;
  const map = messages[field];
  for (const key of Object.keys(errors)) {
    const msg = map[key];
    if (msg) return msg;
  }
  return null;
}

/** Build error-summary rows for unfulfilled section only. */
export function buildUnfulfilledErrors(
  messages: ErrorMessages,
  isUnfulfilled: boolean,
  reasonErrors: ValidationErrors | null | undefined,
  detailsErrors: ValidationErrors | null | undefined
): { fieldId: string; message: string }[] {
  if (!isUnfulfilled) return [];
  const out: { fieldId: string; message: string }[] = [];

  const r = firstError(messages, 'reason', reasonErrors);
  if (r) out.push({ fieldId: 'reason', message: r });

  const d = firstError(messages, 'details', detailsErrors);
  if (d) out.push({ fieldId: 'details', message: d });

  return out;
}
