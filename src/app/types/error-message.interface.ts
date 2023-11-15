export interface ErrorMessage {
  message?: string[];
  detail?: ErrorType;
  endpoint?: string;
  route?: string;
  display?: 'COMPONENT' | 'PAGE';
  status: number;
  statusText?: string;
}

export interface ErrorType {
  duplicate_transcription_id?: number;
  type?: string;
  status?: number;
  title?: string;
}
