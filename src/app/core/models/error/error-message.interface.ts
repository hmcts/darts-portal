import { ErrorType } from './error-type.type';

export interface ErrorMessage {
  message?: string[];
  detail?: ErrorType;
  endpoint?: string;
  route?: string;
  display?: 'COMPONENT' | 'PAGE';
  status: number;
  statusText?: string;
}
