export interface ErrorType {
  duplicate_transcription_id?: number;
  detail?: string;
  instance?: string;
  type?: string;
  status?: number;
  title?: string;
  [key: string]: unknown;
}
