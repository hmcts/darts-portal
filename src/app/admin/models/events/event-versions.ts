import { Event } from './event';

export type EventVersions = {
  currentVersion: Event | null;
  previousVersions: Event[];
};
