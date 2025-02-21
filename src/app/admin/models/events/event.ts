import { EventMapping } from '@admin-types/event-mappings/event-mapping.type';
import { User } from '@admin-types/users/user.type';
import { DateTime } from 'luxon';

type OptionalEventMapping = Partial<Omit<EventMapping, 'id'>> & { id: number; name?: string };

export type Event = {
  id: number;
  documentumId: string;
  sourceId: number;
  messageId: string;
  text: string;
  eventMapping: OptionalEventMapping;
  isLogEntry: boolean;
  courthouse: {
    id: number;
    displayName: string;
  };
  courtroom: {
    id: number;
    name: string;
  };
  version: string;
  chronicleId: string;
  antecedentId: string;
  isDataAnonymised: boolean;
  eventTs: DateTime;
  createdAt: DateTime;
  createdById: number;
  createdBy?: User;
  lastModifiedAt: DateTime;
  lastModifiedById: number;
  lastModifiedBy?: User;
  isCurrentVersion: boolean;
};
