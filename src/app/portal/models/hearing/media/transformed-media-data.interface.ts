import { MediaRequestData } from './media-request-data.interface';

export interface TransformedMediaData extends MediaRequestData {
  transformed_media_id: number;
  transformed_media_filename: string;
  transformed_media_format: string;
  transformed_media_expiry_ts: string;
  last_accessed_ts?: string;
}
