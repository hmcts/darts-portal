import { TranscriptionSearchFormValues } from '@admin-types/transcription';

export type TransformedMediaSearchFormValues = Omit<TranscriptionSearchFormValues, 'requestMethod'>;
