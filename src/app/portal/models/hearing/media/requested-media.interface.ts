import { MediaRequestData } from './media-request-data.interface';
import { TransformedMediaData } from './transformed-media-data.interface';

export interface RequestedMediaData {
  media_request_details: MediaRequestData[];
  transformed_media_details: TransformedMediaData[];
}
