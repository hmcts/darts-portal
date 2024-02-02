import { DateTime } from 'luxon';
import { MediaRequest } from './media-request.type';

export type TransformedMedia = MediaRequest & {
  transformedMediaId: number;
  transformedMediaFilename: string;
  transformedMediaFormat: string;
  transformedMediaExpiryTs: DateTime;
  lastAccessedTs?: DateTime;
};
