import { Event } from './event';

export type EventVersions = {
  currentVersion: Event;
  previousVersions: Event[];
};
