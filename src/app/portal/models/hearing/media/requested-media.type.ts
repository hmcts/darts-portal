import { MediaRequest } from './media-request.type';
import { TransformedMedia } from './transformed-media-type';

export type RequestedMedia = {
  mediaRequests: MediaRequest[];
  transformedMedia: TransformedMedia[];
};
