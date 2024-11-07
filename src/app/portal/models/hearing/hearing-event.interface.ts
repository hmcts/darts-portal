export interface HearingEvent {
  id: number;
  timestamp: string;
  name: string;
  text?: string;
  is_data_anonymised?: boolean;
}
