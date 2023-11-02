export interface ErrorMessage {
  message?: string[];
  type?: string;
  endpoint?: string;
  route?: string;
  display?: 'COMPONENT' | 'PAGE';
  status: number;
  statusText?: string;
}
