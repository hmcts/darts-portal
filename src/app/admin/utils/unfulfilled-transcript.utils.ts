export type UnfulfilledReason = 'inaudible' | 'no_audio' | 'one_second' | 'other';

export const REASON_DISPLAY: Record<UnfulfilledReason, string> = {
  inaudible: 'Inaudible / unintelligible',
  no_audio: 'No audio / white noise',
  one_second: 'Audio is 1 second',
  other: 'Other',
};

export const UNFULFILLED_STATUS_ID = 8;

export interface UnfulfilledPayload {
  transcription_status_id: number;
  workflow_comment: string;
}

export function getUnfulfilledReason(reason: UnfulfilledReason, details?: string | null): string {
  const trimmedDetails = details?.trim();

  return reason === 'other'
    ? 'Other - ' + (trimmedDetails ?? '') // Details is required if 'other'
    : REASON_DISPLAY[reason];
}
