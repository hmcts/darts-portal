import { EventData } from './event-data.interface';

export interface EventVersionsData {
  current_version: EventData;
  previous_versions: EventData[];
}
